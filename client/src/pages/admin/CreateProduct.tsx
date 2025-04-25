import { useEffect } from "react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { type Category } from "@shared/schema";

// Form validation schema
const productSchema = z.object({
  name: z.string().min(2, { message: "نام محصول باید حداقل 2 کاراکتر باشد" }),
  nameEn: z.string().optional(),
  description: z.string().min(10, { message: "توضیحات محصول باید حداقل 10 کاراکتر باشد" }),
  image: z.string().url({ message: "آدرس تصویر معتبر نیست" }),
  categoryId: z.string().min(1, { message: "انتخاب دسته‌بندی الزامی است" }),
  featured: z.boolean().default(false),
  specifications: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const CreateProduct = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);
  
  useEffect(() => {
    document.title = "افزودن محصول جدید - مبلمان پاشا";
  }, []);
  
  // Fetch categories for select dropdown
  const { 
    data: categories,
    isLoading: isLoadingCategories
  } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Form setup
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      nameEn: "",
      description: "",
      image: "",
      categoryId: "",
      featured: false,
      specifications: "",
    },
  });
  
  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      // Convert categoryId from string to number
      const productData = {
        ...data,
        categoryId: parseInt(data.categoryId),
      };
      
      const res = await apiRequest("POST", "/api/products", productData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "افزودن محصول",
        description: "محصول با موفقیت اضافه شد",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      navigate("/admin/products");
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "مشکلی در افزودن محصول رخ داد",
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const onSubmit = (data: ProductFormValues) => {
    addProductMutation.mutate(data);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary vazir">افزودن محصول جدید</h1>
            <p className="text-gray-600 vazir mt-1">
              اطلاعات محصول جدید را وارد کنید
            </p>
          </div>
          
          <Link href="/admin/products">
            <Button variant="outline" className="vazir">
              <ArrowLeft className="ml-2 h-4 w-4" />
              بازگشت به لیست محصولات
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="vazir">فرم افزودن محصول</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="vazir">نام محصول (فارسی)</FormLabel>
                        <FormControl>
                          <Input className="vazir" placeholder="مثال: مبل راحتی مدرن" {...field} />
                        </FormControl>
                        <FormMessage className="vazir text-right" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="nameEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="vazir">نام محصول (انگلیسی - اختیاری)</FormLabel>
                        <FormControl>
                          <Input className="latin" placeholder="Example: Modern Sofa" {...field} />
                        </FormControl>
                        <FormMessage className="vazir text-right" />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="vazir">آدرس تصویر محصول</FormLabel>
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
                
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="vazir">دسته‌بندی</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="vazir">
                            <SelectValue placeholder="انتخاب دسته‌بندی" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingCategories ? (
                            <SelectItem value="loading" disabled className="vazir">
                              در حال بارگذاری...
                            </SelectItem>
                          ) : categories && categories.length > 0 ? (
                            categories.map(category => (
                              <SelectItem 
                                key={category.id} 
                                value={category.id.toString()}
                                className="vazir"
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty" disabled className="vazir">
                              دسته‌بندی‌ای یافت نشد
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="vazir text-right" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="vazir">توضیحات محصول</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="vazir" 
                          placeholder="توضیحات محصول را وارد کنید..."
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="vazir text-right" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="specifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="vazir">مشخصات فنی</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="vazir" 
                          placeholder="مشخصات فنی محصول را وارد کنید..."
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="vazir text-right">
                        مشخصات را با علامت ، (کاما) از هم جدا کنید. مثال: ابعاد: 80×120 سانتی‌متر، جنس: چوب راش، رنگ: قهوه‌ای
                      </FormDescription>
                      <FormMessage className="vazir text-right" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="vazir">
                          نمایش در محصولات ویژه صفحه اصلی
                        </FormLabel>
                        <FormDescription className="vazir text-right">
                          با انتخاب این گزینه، محصول در بخش محصولات ویژه صفحه اصلی نمایش داده می‌شود.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-primary vazir text-white min-w-32"
                    disabled={addProductMutation.isPending}
                  >
                    {addProductMutation.isPending ? "در حال ثبت..." : "ثبت محصول"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProduct;
