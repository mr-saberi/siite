import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import ProductCard from "@/components/ui/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { type Product, type Category } from "@shared/schema";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [, params] = useRoute("/products");
  
  // Get category from URL if available (simplified approach)
  useEffect(() => {
    // Check URL for any category parameter using window.location
    const queryParams = new URLSearchParams(window.location.search);
    const categoryParam = queryParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);
  
  // Set document title
  useEffect(() => {
    document.title = "محصولات - مبلمان پاشا";
  }, []);
  
  // Fetch all products
  const {
    data: products,
    isLoading: isLoadingProducts,
  } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory !== "all" ? parseInt(selectedCategory) : null],
    queryFn: async ({ queryKey }) => {
      const categoryId = queryKey[1];
      const url = categoryId 
        ? `/api/products?categoryId=${categoryId}` 
        : "/api/products";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    }
  });
  
  // Fetch categories for filter
  const { 
    data: categories,
    isLoading: isLoadingCategories
  } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Filter products by search term
  const filteredProducts = products?.filter(product => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      (product.nameEn && product.nameEn.toLowerCase().includes(term)) ||
      product.description.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-light py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary vazir">محصولات مبلمان پاشا</h1>
          <p className="text-lg text-charcoal max-w-3xl mx-auto vazir">
            مجموعه کاملی از محصولات با کیفیت و طراحی منحصر به فرد
          </p>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-2 vazir">
                جستجو در محصولات
              </label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="نام محصول را وارد کنید..."
                  className="vazir pr-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-2 vazir">
                دسته‌بندی
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="vazir">
                  <SelectValue placeholder="انتخاب دسته‌بندی" />
                </SelectTrigger>
                <SelectContent className="vazir">
                  <SelectItem value="all">همه دسته‌بندی‌ها</SelectItem>
                  {!isLoadingCategories && categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/3">
              <Button 
                className="w-full bg-primary text-white vazir"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                پاک کردن فیلترها
              </Button>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoadingProducts ? (
            // Show skeleton while loading
            Array(8).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-80 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))
          ) : filteredProducts && filteredProducts.length > 0 ? (
            // Show filtered products
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="vazir text-gray-500 text-lg">
                {searchTerm 
                  ? "محصولی با این مشخصات یافت نشد" 
                  : "محصولی در این دسته‌بندی یافت نشد"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
