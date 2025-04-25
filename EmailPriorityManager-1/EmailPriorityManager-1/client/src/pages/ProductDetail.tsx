import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Product, type Category } from "@shared/schema";

const ProductDetail = () => {
  const [, params] = useRoute<{ id: string }>("/products/:id");
  const productId = params?.id;

  // Set document title based on product name
  useEffect(() => {
    document.title = `جزئیات محصول - مبلمان پاشا`;
  }, []);

  // Fetch the product details
  const {
    data: product,
    isLoading: isLoadingProduct,
    error,
  } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  // Fetch the category
  const {
    data: category,
    isLoading: isLoadingCategory,
  } = useQuery<Category>({
    queryKey: [`/api/categories/${product?.categoryId}`],
    enabled: !!product?.categoryId,
  });

  // If loading, show skeleton UI
  if (isLoadingProduct) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div>
            <Skeleton className="h-10 w-2/3 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-4/5 mb-6" />
            <Skeleton className="h-40 w-full mb-6" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  // If there's an error or no product found
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-center vazir text-primary mb-4">
              محصول یافت نشد
            </h2>
            <p className="text-center vazir mb-6">
              متأسفانه محصول مورد نظر در سیستم موجود نیست.
            </p>
            <div className="flex justify-center">
              <Link href="/products">
                <Button className="vazir">
                  <ChevronRight className="ml-2 h-4 w-4" />
                  بازگشت به صفحه محصولات
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const specifications = product.specifications ? product.specifications.split(/\s*،\s*/) : [];

  return (
    <div className="bg-light py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm mb-6">
          <Link href="/">
            <a className="text-gray-500 hover:text-primary vazir">خانه</a>
          </Link>
          <ChevronLeft className="mx-2 h-4 w-4 text-gray-500" />
          <Link href="/products">
            <a className="text-gray-500 hover:text-primary vazir">محصولات</a>
          </Link>
          <ChevronLeft className="mx-2 h-4 w-4 text-gray-500" />
          <Link href={`/products?category=${product.categoryId}`}>
            <a className="text-gray-500 hover:text-primary vazir">
              {isLoadingCategory ? "..." : category?.name}
            </a>
          </Link>
          <ChevronLeft className="mx-2 h-4 w-4 text-gray-500" />
          <span className="text-primary font-semibold vazir">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <AspectRatio ratio={4/3}>
              <img
                src={product.image}
                alt={product.name}
                className="rounded-md object-cover w-full h-full"
              />
            </AspectRatio>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-primary vazir mb-2">{product.name}</h1>
            {product.nameEn && (
              <h2 className="text-xl text-gray-600 latin mb-4">{product.nameEn}</h2>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-primary vazir mb-2">توضیحات محصول</h3>
              <p className="text-gray-700 vazir leading-relaxed">{product.description}</p>
            </div>
            
            {specifications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-primary vazir mb-2">مشخصات</h3>
                <ul className="list-disc list-inside space-y-1 vazir text-gray-700">
                  {specifications.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <Link href="/contact">
              <Button className="bg-secondary text-primary hover:bg-opacity-90 vazir">
                برای اطلاع از قیمت و خرید با ما تماس بگیرید
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
