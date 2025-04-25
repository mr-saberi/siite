import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  loginSchema, 
  insertCategorySchema, 
  insertProductSchema, 
  insertGalleryImageSchema 
} from "@shared/schema";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup with enhanced security
  app.use(session({
    secret: process.env.SESSION_SECRET || "pasha-furniture-secret-key-for-enhanced-security",
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      maxAge: 8 * 60 * 60 * 1000, // 8 hours (shorter session lifetime)
      secure: process.env.NODE_ENV === "production",
      httpOnly: true, // Prevents client-side JS from reading the cookie
      sameSite: 'strict' // Prevents CSRF attacks
    }
  }));

  // Passport authentication setup
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        // Use consistent error messages for security (don't reveal if username exists)
        return done(null, false, { message: "نام کاربری یا رمز عبور نادرست است" });
      }
      
      // If we're using plain text passwords for demo/development
      if (process.env.NODE_ENV === "development" && user.password === password) {
        return done(null, user);
      }
      
      // For production or to test bcrypt (even in development)
      // Check if the password is already hashed (starts with $2a$, $2b$, or $2y$)
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$')) {
        // Compare with bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "نام کاربری یا رمز عبور نادرست است" });
        }
        return done(null, user);
      } else {
        // Plain text fallback for development or migration period
        if (user.password !== password) {
          return done(null, false, { message: "نام کاربری یا رمز عبور نادرست است" });
        }
        return done(null, user);
      }
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth middleware
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "لطفا وارد حساب کاربری خود شوید" });
  };

  const isAdmin = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated() && (req.user as any)?.isAdmin) {
      return next();
    }
    res.status(403).json({ message: "شما دسترسی به این بخش را ندارید" });
  };

  // Authentication routes
  app.post("/api/auth/login", (req, res, next) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info.message || "اطلاعات ورود نادرست است" });
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.json({ 
            id: user.id, 
            username: user.username, 
            isAdmin: user.isAdmin 
          });
        });
      })(req, res, next);
    } catch (error) {
      res.status(400).json({ message: "خطا در اعتبارسنجی اطلاعات" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "خطا در خروج از حساب کاربری" });
      }
      res.json({ message: "با موفقیت خارج شدید" });
    });
  });

  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      res.json({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      });
    } else {
      res.status(401).json({ message: "کاربر وارد نشده است" });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "خطا در دریافت دسته‌بندی‌ها" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      
      if (!category) {
        return res.status(404).json({ message: "دسته‌بندی یافت نشد" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "خطا در دریافت دسته‌بندی" });
    }
  });

  app.post("/api/categories", isAdmin, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "خطا در ایجاد دسته‌بندی" });
    }
  });

  app.put("/api/categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCategorySchema.partial().parse(req.body);
      
      const updatedCategory = await storage.updateCategory(id, validatedData);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: "دسته‌بندی یافت نشد" });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      res.status(400).json({ message: "خطا در بروزرسانی دسته‌بندی" });
    }
  });

  app.delete("/api/categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(404).json({ message: "دسته‌بندی یافت نشد" });
      }
      
      res.json({ message: "دسته‌بندی با موفقیت حذف شد" });
    } catch (error) {
      res.status(500).json({ message: "خطا در حذف دسته‌بندی" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      let products;
      if (categoryId) {
        products = await storage.getProductsByCategory(categoryId);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "خطا در دریافت محصولات" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const featuredProducts = await storage.getFeaturedProducts();
      res.json(featuredProducts);
    } catch (error) {
      res.status(500).json({ message: "خطا در دریافت محصولات ویژه" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "محصول یافت نشد" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "خطا در دریافت محصول" });
    }
  });

  app.post("/api/products", isAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "خطا در ایجاد محصول" });
    }
  });

  app.put("/api/products/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      
      const updatedProduct = await storage.updateProduct(id, validatedData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "محصول یافت نشد" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: "خطا در بروزرسانی محصول" });
    }
  });

  app.delete("/api/products/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "محصول یافت نشد" });
      }
      
      res.json({ message: "محصول با موفقیت حذف شد" });
    } catch (error) {
      res.status(500).json({ message: "خطا در حذف محصول" });
    }
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const gallery = await storage.getGalleryImages();
      res.json(gallery);
    } catch (error) {
      res.status(500).json({ message: "خطا در دریافت تصاویر گالری" });
    }
  });

  app.post("/api/gallery", isAdmin, async (req, res) => {
    try {
      const validatedData = insertGalleryImageSchema.parse(req.body);
      const image = await storage.createGalleryImage(validatedData);
      res.status(201).json(image);
    } catch (error) {
      res.status(400).json({ message: "خطا در افزودن تصویر به گالری" });
    }
  });

  app.delete("/api/gallery/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGalleryImage(id);
      
      if (!success) {
        return res.status(404).json({ message: "تصویر یافت نشد" });
      }
      
      res.json({ message: "تصویر با موفقیت حذف شد" });
    } catch (error) {
      res.status(500).json({ message: "خطا در حذف تصویر" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
