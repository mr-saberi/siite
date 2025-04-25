import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  products, type Product, type InsertProduct,
  galleryImages, type GalleryImage, type InsertGalleryImage
} from "@shared/schema";
import { db } from "./db";
import { eq, asc, desc, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Gallery operations
  getGalleryImages(): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  deleteGalleryImage(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash password if it's not already hashed
    if (!insertUser.password.startsWith('$2a$') && !insertUser.password.startsWith('$2b$') && !insertUser.password.startsWith('$2y$')) {
      insertUser.password = await bcrypt.hash(insertUser.password, 10);
    }
    
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(asc(categories.name));
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }
  
  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(categoryUpdate)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id));
    return true; // PostgreSQL doesn't return affected rows directly in the same way
  }
  
  // Product operations
  async getProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(asc(products.name));
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.categoryId, categoryId))
      .orderBy(asc(products.name));
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .orderBy(asc(products.name));
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }
  
  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(productUpdate)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    await db.delete(products).where(eq(products.id, id));
    return true;
  }
  
  // Gallery operations
  async getGalleryImages(): Promise<GalleryImage[]> {
    return db.select().from(galleryImages);
  }
  
  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const [image] = await db
      .insert(galleryImages)
      .values(insertImage)
      .returning();
    return image;
  }
  
  async deleteGalleryImage(id: number): Promise<boolean> {
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
    return true;
  }
  
  // Helper method for seeding data
  async seedInitialData(): Promise<void> {
    // Check if we already have users
    const existingUsers = await db.select().from(users);
    if (existingUsers.length === 0) {
      // Create admin user
      await this.createUser({
        username: "admin",
        password: "admin123", // Will be hashed in createUser
        isAdmin: true
      });
      
      // Seed categories
      const sampleCategories: InsertCategory[] = [
        {
          name: "مبلمان نشیمن",
          nameEn: "Living Room",
          image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
        },
        {
          name: "اتاق خواب",
          nameEn: "Bedroom",
          image: "https://images.unsplash.com/photo-1556910585-09baa3a3c593?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
        },
        {
          name: "غذاخوری",
          nameEn: "Dining Room",
          image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
        },
        {
          name: "دفتر کار",
          nameEn: "Office",
          image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
        },
        {
          name: "مبلمان راحتی",
          nameEn: "Comfortable Furniture",
          image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
        },
        {
          name: "مبلمان کلاسیک",
          nameEn: "Classic Furniture",
          image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
        },
        {
          name: "مبلمان سلطنتی",
          nameEn: "Royal Furniture",
          image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
        },
        {
          name: "مبلمان مدرن",
          nameEn: "Modern Furniture",
          image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
        },
        {
          name: "میز و صندلی",
          nameEn: "Tables & Chairs",
          image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
        },
        {
          name: "کابینت و قفسه",
          nameEn: "Cabinets & Shelves",
          image: "https://images.unsplash.com/photo-1594286851359-8e5fb989eac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
        }
      ];
      
      for (const category of sampleCategories) {
        await this.createCategory(category);
      }
      
      // Seed products
      const categoriesDb = await this.getCategories();
      const categoryIds = categoriesDb.map(c => c.id);
      
      const sampleProducts: InsertProduct[] = [
        {
          name: "مبل راحتی مدرن",
          nameEn: "Modern Sofa",
          description: "مبل راحتی سه نفره با طراحی مدرن و پارچه مخمل",
          image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
          categoryId: categoryIds[0],
          featured: true,
          specifications: "ابعاد: 220×90×85 سانتی‌متر، جنس: چوب راش و پارچه مخمل، رنگ: طوسی",
          price: 12500000
        },
        {
          name: "میز نهارخوری چوبی",
          nameEn: "Wooden Dining Table",
          description: "میز نهارخوری شش نفره از چوب گردو با پایه‌های فلزی",
          image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
          categoryId: categoryIds[2],
          featured: true,
          specifications: "ابعاد: 180×90×76 سانتی‌متر، جنس: چوب گردو و پایه فلزی، رنگ: قهوه‌ای تیره",
          price: 8700000
        },
        {
          name: "چراغ رومیزی مدرن",
          nameEn: "Modern Table Lamp",
          description: "چراغ رومیزی با پایه برنجی و حباب کتان سفید",
          image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
          categoryId: categoryIds[3],
          featured: true,
          specifications: "ارتفاع: 60 سانتی‌متر، قطر حباب: 30 سانتی‌متر، جنس: برنج و کتان، نوع لامپ: LED",
          price: 2500000
        },
        {
          name: "تخت خواب دو نفره",
          nameEn: "Double Bed",
          description: "تخت خواب دو نفره با طراحی شیک و سرتخت پارچه‌ای",
          image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
          categoryId: categoryIds[1],
          price: 18900000,
          featured: false,
          specifications: "ابعاد: 200×180×110 سانتی‌متر، جنس: چوب و MDF روکش دار، رنگ: کرم"
        },
        {
          name: "مبلمان سلطنتی استیل",
          nameEn: "Royal Sofa Set",
          description: "مبلمان سلطنتی با پارچه مخمل و پایه‌های طلایی",
          image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
          categoryId: categoryIds[6],
          price: 32000000,
          featured: true,
          specifications: "ست کامل شامل کاناپه سه نفره، دو کاناپه تک نفره و میز جلو مبلی، جنس: چوب گردو، روکش مخمل، رنگ: قرمز و طلایی"
        },
        {
          name: "میز کنسول کلاسیک",
          nameEn: "Classic Console Table",
          description: "میز کنسول با طراحی کلاسیک و آینه بزرگ",
          image: "https://images.unsplash.com/photo-1616464916356-3a777b414d95?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
          categoryId: categoryIds[5],
          price: 9800000,
          featured: false,
          specifications: "ابعاد: 120×40×85 سانتی‌متر، جنس: چوب و MDF با روکش ونگه، آینه: 120×80 سانتی‌متر"
        },
        {
          name: "میز تلویزیون مدرن",
          nameEn: "Modern TV Stand",
          description: "میز تلویزیون با طراحی مدرن و کشوهای متعدد",
          image: "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
          categoryId: categoryIds[7],
          price: 7500000,
          featured: false,
          specifications: "ابعاد: 180×45×50 سانتی‌متر، جنس: MDF هایگلاس، رنگ: سفید با درب‌های شیشه‌ای دودی"
        },
        {
          name: "صندلی ناهارخوری مخملی",
          nameEn: "Velvet Dining Chair",
          description: "صندلی ناهارخوری با روکش مخمل و پایه‌های فلزی",
          image: "https://images.unsplash.com/photo-1579656381275-8a754f679e6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
          categoryId: categoryIds[8],
          price: 2800000,
          featured: false,
          specifications: "ارتفاع: 95 سانتی‌متر، عرض: 45 سانتی‌متر، جنس: پارچه مخمل و پایه فلزی، رنگ: سبز زمردی"
        },
        {
          name: "کتابخانه چوبی",
          nameEn: "Wooden Bookshelf",
          description: "کتابخانه چوبی با طراحی ساده و کاربردی",
          image: "https://images.unsplash.com/photo-1594286851359-8e5fb989eac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
          categoryId: categoryIds[9],
          price: 6500000,
          featured: false,
          specifications: "ابعاد: 120×35×180 سانتی‌متر، جنس: چوب کاج، 5 طبقه قابل تنظیم، رنگ: قهوه‌ای روشن"
        },
        {
          name: "مبل ال راحتی",
          nameEn: "L-Shaped Sofa",
          description: "مبل ال راحتی با روکش پارچه مقاوم و دوام بالا",
          image: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
          categoryId: categoryIds[4],
          price: 15800000,
          featured: true,
          specifications: "ابعاد: 280×220×85 سانتی‌متر، جنس: چوب و پارچه مقاوم، رنگ: طوسی، قابلیت تبدیل به تختخواب"
        },
        {
          name: "صندلی اداری ارگونومیک",
          nameEn: "Ergonomic Office Chair",
          description: "صندلی اداری با طراحی ارگونومیک برای راحتی بیشتر",
          image: "https://images.unsplash.com/photo-1596079890744-c1a0462d0975?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
          categoryId: categoryIds[3],
          price: 4200000,
          featured: false,
          specifications: "تنظیم ارتفاع: 45-55 سانتی‌متر، پشتی قابل تنظیم، دسته‌های قابل تنظیم، چرخ 360 درجه، جنس: مش و فوم، رنگ: مشکی"
        }
      ];
      
      for (const product of sampleProducts) {
        await this.createProduct(product);
      }
      
      // Seed gallery images
      const sampleGalleryImages: InsertGalleryImage[] = [
        {
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          alt: "نمایشگاه مبلمان پاشا"
        },
        {
          image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          alt: "طراحی داخلی فروشگاه"
        },
        {
          image: "https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          alt: "مبلمان لوکس"
        }
      ];
      
      for (const image of sampleGalleryImages) {
        await this.createGalleryImage(image);
      }
    }
  }
}

// Create an instance of the storage
export const storage = new DatabaseStorage();