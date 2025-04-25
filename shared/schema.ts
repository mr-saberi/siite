import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  image: text("image").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  description: text("description").notNull(),
  image: text("image").notNull(),
  categoryId: integer("category_id").notNull(),
  featured: boolean("featured").default(false),
  specifications: text("specifications"),
  price: integer("price").default(0).notNull(),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  alt: text("alt").notNull(),
});

// Schemas for insert
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  nameEn: true,
  image: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  nameEn: true,
  description: true,
  image: true,
  categoryId: true,
  featured: true,
  specifications: true,
  price: true,
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).pick({
  image: true,
  alt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;

// Extended schemas for validation
export const loginSchema = z.object({
  username: z.string().min(3, { message: "نام کاربری باید حداقل 3 کاراکتر باشد" }),
  password: z.string().min(6, { message: "رمز عبور باید حداقل 6 کاراکتر باشد" }),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
