import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/ui/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Edit, Trash, Check, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { type Product, type Category } from "@shared/schema";

const ITEMS_PER_PAGE = 10;

const ProductsManage = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);
  
  useEffect(() => {
    document.title = "مدیریت محصولات - مبلمان پاشا";
  }, []);
  
  // Fetch all products
  const { 
    data: products, 
    isLoading: isLoadingProducts 
  } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  // Fetch categories for product info
  const { 
    data: categories, 
    isLoading: isLoadingCategories 
  } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "حذف محصول",
        description: "محصول با موفقیت حذف شد",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setProductToDelete(null);
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "مشکلی در حذف محصول رخ داد",
        variant: "destructive",
      });
    }
  });
  
  // Handle product deletion
  const handleDeleteProduct = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete.id);
    }
  };
  
  // Filter products based on search term
  const filteredProducts = products?.filter(product => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      (product.nameEn && product.nameEn.toLowerCase().includes(term)) ||
      product.description.toLowerCase().includes(term)
    );
  }) || [];
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  // Get category name by id
  const getCategoryName = (categoryId: number) => {
    const category = categories?.find(c => c.id === categoryId);
    return category ? category.name : "-";
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary vazir">مدیریت محصولات</h1>
            <p className="text-gray-600 vazir mt-1">
              افزودن، ویرایش و حذف محصولات فروشگاه
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link href="/admin/products/create">
              <Button className="bg-primary text-white vazir">
                <Plus className="ml-2 h-4 w-4" />
                افزودن محصول جدید
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="جستجو در محصولات..."
              className="vazir pr-10 w-full md:max-w-md"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
        
        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoadingProducts || isLoadingCategories ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-500 vazir">در حال بارگذاری...</p>
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right vazir">تصویر</TableHead>
                      <TableHead className="text-right vazir">نام محصول</TableHead>
                      <TableHead className="text-right vazir">دسته‌بندی</TableHead>
                      <TableHead className="text-right vazir">محصول ویژه</TableHead>
                      <TableHead className="text-right vazir">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-16 h-16 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="vazir font-medium">
                          {product.name}
                          {product.nameEn && (
                            <div className="text-sm text-gray-500 latin">{product.nameEn}</div>
                          )}
                        </TableCell>
                        <TableCell className="vazir">{getCategoryName(product.categoryId)}</TableCell>
                        <TableCell>
                          {product.featured ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/admin/products/edit/${product.id}`}>
                              <Button variant="outline" size="sm" className="vazir">
                                <Edit className="ml-1 h-4 w-4" />
                                ویرایش
                              </Button>
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="vazir text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => setProductToDelete(product)}
                                >
                                  <Trash className="ml-1 h-4 w-4" />
                                  حذف
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="vazir">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="vazir text-right">
                                    تأیید حذف محصول
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="vazir text-right">
                                    آیا از حذف محصول "{productToDelete?.name}" اطمینان دارید؟ 
                                    این عمل قابل بازگشت نیست.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="vazir">انصراف</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="vazir bg-red-500 hover:bg-red-600"
                                    onClick={handleDeleteProduct}
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                          aria-disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // Show first page, last page, current page and adjacent pages
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                onClick={() => setCurrentPage(pageNumber)}
                                isActive={currentPage === pageNumber}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        
                        // Show ellipsis instead of all pages
                        if (
                          (pageNumber === 2 && currentPage > 3) ||
                          (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                          aria-disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 vazir">
                {searchTerm ? "محصولی با این مشخصات یافت نشد" : "هیچ محصولی ثبت نشده است"}
              </p>
              {searchTerm && (
                <Button 
                  variant="link" 
                  className="vazir mt-2"
                  onClick={() => setSearchTerm("")}
                >
                  پاک کردن جستجو
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsManage;
