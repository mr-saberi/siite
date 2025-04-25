import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AdminSidebar from "@/components/ui/admin-sidebar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Edit, Trash } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { type Category, type InsertCategory } from "@shared/schema";

// Form validation schema
const categorySchema = z.object({
  name: z.string().min(2, { message: "نام دسته‌بندی باید حداقل 2 کاراکتر باشد" }),
  nameEn: z.string().min(2, { message: "نام انگلیسی باید حداقل 2 کاراکتر باشد" }),
  image: z.string().url({ message: "آدرس تصویر معتبر نیست" }),
});

const CategoryManage = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);
  
  useEffect(() => {
    document.title = "مدیریت دسته‌بندی‌ها - مبلمان پاشا";
  }, []);
  
  // Fetch categories
  const { 
    data: categories, 
    isLoading: isLoadingCategories 
  } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Form for adding new category
  const addForm = useForm<InsertCategory>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      nameEn: "",
      image: "",
    },
  });
  
  // Form for editing category
  const editForm = useForm<InsertCategory & { id?: number }>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      nameEn: "",
      image: "",
    },
  });
  
  // Update edit form when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      editForm.reset({
        id: selectedCategory.id,
        name: selectedCategory.name,
        nameEn: selectedCategory.nameEn,
        image: selectedCategory.image,
      });
    }
  }, [selectedCategory, editForm]);
  
  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (data: InsertCategory) => {
      const res = await apiRequest("POST", "/api/categories", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "افزودن دسته‌بندی",
        description: "دسته‌بندی با موفقیت اضافه شد",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsAddDialogOpen(false);
      addForm.reset();
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "مشکلی در افزودن دسته‌بندی رخ داد",
        variant: "destructive",
      });
    }
  });
  
  // Edit category mutation
  const editCategoryMutation = useMutation({
    mutationFn: async (data: InsertCategory & { id: number }) => {
      const { id, ...updateData } = data;
      const res = await apiRequest("PUT", `/api/categories/${id}`, updateData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "ویرایش دسته‌بندی",
        description: "دسته‌بندی با موفقیت ویرایش شد",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "مشکلی در ویرایش دسته‌بندی رخ داد",
        variant: "destructive",
      });
    }
  });
  
  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "حذف دسته‌بندی",
        description: "دسته‌بندی با موفقیت حذف شد",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setCategoryToDelete(null);
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "مشکلی در حذف دسته‌بندی رخ داد",
        variant: "destructive",
      });
    }
  });
  
  // Handle form submissions
  const onAddSubmit = (data: InsertCategory) => {
    addCategoryMutation.mutate(data);
  };
  
  const onEditSubmit = (data: InsertCategory & { id?: number }) => {
    if (data.id) {
      editCategoryMutation.mutate({ ...data, id: data.id });
    }
  };
  
  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete.id);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary vazir">مدیریت دسته‌بندی‌ها</h1>
            <p className="text-gray-600 vazir mt-1">
              افزودن، ویرایش و حذف دسته‌بندی‌های محصولات
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white vazir">
                  <Plus className="ml-2 h-4 w-4" />
                  افزودن دسته‌بندی جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="vazir">
                <DialogHeader>
                  <DialogTitle className="vazir text-right">افزودن دسته‌بندی جدید</DialogTitle>
                  <DialogDescription className="vazir text-right">
                    مشخصات دسته‌بندی جدید را وارد کنید
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...addForm}>
                  <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                    <FormField
                      control={addForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="vazir">نام دسته‌بندی (فارسی)</FormLabel>
                          <FormControl>
                            <Input className="vazir" placeholder="مثال: مبلمان نشیمن" {...field} />
                          </FormControl>
                          <FormMessage className="vazir text-right" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addForm.control}
                      name="nameEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="vazir">نام دسته‌بندی (انگلیسی)</FormLabel>
                          <FormControl>
                            <Input className="latin" placeholder="Example: Living Room" {...field} />
                          </FormControl>
                          <FormMessage className="vazir text-right" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addForm.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="vazir">آدرس تصویر</FormLabel>
                          <FormControl>
                            <Input 
                              className="latin" 
                              dir="ltr"
                              placeholder="https://example.com/image.jpg" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="vazir text-right" />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        className="vazir bg-primary"
                        disabled={addCategoryMutation.isPending}
                      >
                        {addCategoryMutation.isPending ? "در حال ثبت..." : "ثبت دسته‌بندی"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingCategories ? (
            // Skeleton loading
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white h-52 rounded-lg shadow">
                  <div className="h-32 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))
          ) : categories && categories.length > 0 ? (
            // Display categories
            categories.map(category => (
              <Card key={category.id}>
                <div className="h-40 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="vazir">{category.name}</CardTitle>
                  <CardDescription className="latin">{category.nameEn}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2">
                  <Dialog open={isEditDialogOpen && selectedCategory?.id === category.id} onOpenChange={(open) => {
                    setIsEditDialogOpen(open);
                    if (!open) setSelectedCategory(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="vazir"
                        onClick={() => setSelectedCategory(category)}
                      >
                        <Edit className="ml-1 h-4 w-4" />
                        ویرایش
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="vazir">
                      <DialogHeader>
                        <DialogTitle className="vazir text-right">ویرایش دسته‌بندی</DialogTitle>
                        <DialogDescription className="vazir text-right">
                          مشخصات دسته‌بندی را ویرایش کنید
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                          <FormField
                            control={editForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="vazir">نام دسته‌بندی (فارسی)</FormLabel>
                                <FormControl>
                                  <Input className="vazir" {...field} />
                                </FormControl>
                                <FormMessage className="vazir text-right" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={editForm.control}
                            name="nameEn"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="vazir">نام دسته‌بندی (انگلیسی)</FormLabel>
                                <FormControl>
                                  <Input className="latin" {...field} />
                                </FormControl>
                                <FormMessage className="vazir text-right" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={editForm.control}
                            name="image"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="vazir">آدرس تصویر</FormLabel>
                                <FormControl>
                                  <Input 
                                    className="latin" 
                                    dir="ltr"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage className="vazir text-right" />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button 
                              type="submit" 
                              className="vazir bg-primary"
                              disabled={editCategoryMutation.isPending}
                            >
                              {editCategoryMutation.isPending ? "در حال ثبت..." : "ثبت تغییرات"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="vazir text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setCategoryToDelete(category)}
                      >
                        <Trash className="ml-1 h-4 w-4" />
                        حذف
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="vazir">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="vazir text-right">
                          تأیید حذف دسته‌بندی
                        </AlertDialogTitle>
                        <AlertDialogDescription className="vazir text-right">
                          آیا از حذف دسته‌بندی "{categoryToDelete?.name}" اطمینان دارید؟ 
                          با حذف این دسته‌بندی، محصولات مرتبط با آن بدون دسته‌بندی خواهند شد.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="vazir">انصراف</AlertDialogCancel>
                        <AlertDialogAction 
                          className="vazir bg-red-500 hover:bg-red-600"
                          onClick={handleDeleteCategory}
                        >
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 vazir mb-4">هیچ دسته‌بندی ثبت نشده است</p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-white vazir">
                    <Plus className="ml-2 h-4 w-4" />
                    افزودن دسته‌بندی جدید
                  </Button>
                </DialogTrigger>
                {/* Dialog content is the same as above */}
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManage;
