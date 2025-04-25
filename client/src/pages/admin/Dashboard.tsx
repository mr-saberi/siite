import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "@/components/ui/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronLeft, ShoppingBag, Layers, Image, Edit, Plus } from "lucide-react";
import { type Product, type Category, type GalleryImage } from "@shared/schema";

const Dashboard = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);
  
  useEffect(() => {
    document.title = "پنل مدیریت - مبلمان پاشا";
  }, []);
  
  // Fetch data for dashboard
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const { data: galleryImages } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });
  
  const featuredProducts = products?.filter(product => product.featured) || [];
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary vazir">داشبورد مدیریت</h1>
          <p className="text-gray-600 vazir mt-1">
            خوش آمدید {user?.username}، مدیریت محتوای فروشگاه از اینجا امکان‌پذیر است
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 vazir">
                تعداد محصولات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-primary ml-3" />
                <div>
                  <div className="text-3xl font-bold vazir">{products?.length || 0}</div>
                  <p className="text-xs text-gray-500 vazir">
                    {featuredProducts.length} محصول ویژه
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 vazir">
                تعداد دسته‌بندی‌ها
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Layers className="h-8 w-8 text-primary ml-3" />
                <div className="text-3xl font-bold vazir">{categories?.length || 0}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 vazir">
                تصاویر گالری
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Image className="h-8 w-8 text-primary ml-3" />
                <div className="text-3xl font-bold vazir">{galleryImages?.length || 0}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-primary vazir mb-4">دسترسی سریع</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/products/create">
              <Button className="w-full bg-primary text-white vazir h-20 text-lg">
                <Plus className="ml-2 h-5 w-5" />
                محصول جدید
              </Button>
            </Link>
            
            <Link href="/admin/products">
              <Button variant="outline" className="w-full vazir h-20 text-lg">
                <Edit className="ml-2 h-5 w-5" />
                مدیریت محصولات
              </Button>
            </Link>
            
            <Link href="/admin/categories">
              <Button variant="outline" className="w-full vazir h-20 text-lg">
                <Layers className="ml-2 h-5 w-5" />
                مدیریت دسته‌بندی‌ها
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="secondary" className="w-full vazir h-20 text-lg">
                <ChevronLeft className="ml-2 h-5 w-5" />
                مشاهده سایت
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Recent Items */}
        <div>
          <Tabs defaultValue="products">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary vazir">آخرین موارد</h2>
              <TabsList>
                <TabsTrigger value="products" className="vazir">محصولات</TabsTrigger>
                <TabsTrigger value="categories" className="vazir">دسته‌بندی‌ها</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="products" className="mt-0">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="py-3 px-4 text-right vazir font-medium text-gray-500">نام محصول</th>
                          <th className="py-3 px-4 text-right vazir font-medium text-gray-500">دسته‌بندی</th>
                          <th className="py-3 px-4 text-right vazir font-medium text-gray-500">ویژه</th>
                          <th className="py-3 px-4 text-right vazir font-medium text-gray-500">عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products?.slice(0, 5).map(product => (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 vazir">{product.name}</td>
                            <td className="py-3 px-4 vazir">
                              {categories?.find(c => c.id === product.categoryId)?.name || "-"}
                            </td>
                            <td className="py-3 px-4 vazir">
                              {product.featured ? (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                  بله
                                </span>
                              ) : (
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                                  خیر
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <Link href={`/admin/products/edit/${product.id}`}>
                                <Button variant="ghost" size="sm" className="vazir text-primary">
                                  ویرایش
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                        
                        {(!products || products.length === 0) && (
                          <tr>
                            <td colSpan={4} className="py-4 text-center vazir text-gray-500">
                              هیچ محصولی یافت نشد
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="categories" className="mt-0">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="py-3 px-4 text-right vazir font-medium text-gray-500">نام دسته‌بندی</th>
                          <th className="py-3 px-4 text-right vazir font-medium text-gray-500">نام انگلیسی</th>
                          <th className="py-3 px-4 text-right vazir font-medium text-gray-500">تعداد محصولات</th>
                          <th className="py-3 px-4 text-right vazir font-medium text-gray-500">عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories?.map(category => {
                          const categoryProductCount = products?.filter(p => p.categoryId === category.id).length || 0;
                          return (
                            <tr key={category.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 vazir">{category.name}</td>
                              <td className="py-3 px-4 latin">{category.nameEn}</td>
                              <td className="py-3 px-4 vazir">{categoryProductCount}</td>
                              <td className="py-3 px-4">
                                <Link href={`/admin/categories`}>
                                  <Button variant="ghost" size="sm" className="vazir text-primary">
                                    ویرایش
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                        
                        {(!categories || categories.length === 0) && (
                          <tr>
                            <td colSpan={4} className="py-4 text-center vazir text-gray-500">
                              هیچ دسته‌بندی یافت نشد
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
