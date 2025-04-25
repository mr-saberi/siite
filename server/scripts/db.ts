import { db } from "../db";
import { storage } from "../storage";
import { users, categories, products, galleryImages } from "@shared/schema";

async function main() {
  console.log("Running database migrations and setup...");
  
  // Forcing all tables to create
  try {
    // First, ensure schema is up to date
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_admin BOOLEAN NOT NULL DEFAULT FALSE
      );
      
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        name_en TEXT,
        image TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        name_en TEXT,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        specifications TEXT,
        price INTEGER NOT NULL DEFAULT 0
      );
      
      CREATE TABLE IF NOT EXISTS gallery_images (
        id SERIAL PRIMARY KEY,
        image TEXT NOT NULL,
        alt TEXT NOT NULL
      );
    `);
    
    console.log("Created database schema");
    
    // Now seed initial data
    await storage.seedInitialData();
    console.log("Seeded initial data");
    
    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }
}

main().then(() => {
  console.log("All tasks completed");
  process.exit(0);
}).catch(err => {
  console.error("Error in main function:", err);
  process.exit(1);
});