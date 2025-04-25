import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ui/product-card";
import CategoryCard from "@/components/ui/category-card";
import GallerySlider from "@/components/ui/gallery-slider";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { type Product, type Category, type GalleryImage } from "@shared/schema";

const Home = () => {
  // Fetch featured products
  const { 
    data: featuredProducts, 
    isLoading: isLoadingProducts 
  } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  // Fetch categories
  const { 
    data: categories, 
    isLoading: isLoadingCategories 
  } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch gallery images
  const { 
    data: gallery, 
    isLoading: isLoadingGallery 
  } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });
  
  useEffect(() => {
    // Set document title
    document.title = "مبلمان پاشا - Pasha Furniture";
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
            alt="نمایشگاه مبلمان لوکس" 
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl bg-black bg-opacity-50 p-8 rounded-lg">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white vazir">زیبایی و کیفیت، انتخاب شما</h2>
            <p className="text-xl md:text-2xl mb-8 text-cream vazir">مبلمان پاشا، ارائه دهنده بهترین و با کیفیت‌ترین مبلمان خانگی و اداری</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button className="bg-secondary text-primary hover:bg-opacity-90 transition duration-300 text-lg font-bold vazir px-6 py-6">
                  مشاهده محصولات
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:bg-opacity-10 transition duration-300 text-lg font-bold vazir px-6 py-6">
                  تماس با ما
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary vazir">محصولات برگزیده</h2>
            <p className="text-lg text-charcoal max-w-3xl mx-auto vazir">مجموعه‌ای از بهترین و محبوب‌ترین محصولات مبلمان پاشا</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingProducts ? (
              // Show skeleton while loading
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-80 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))
            ) : featuredProducts && featuredProducts.length > 0 ? (
              // Show featured products
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="vazir text-gray-500">محصولی یافت نشد</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button className="bg-primary text-white px-8 py-6 rounded-lg hover:bg-opacity-90 transition duration-300 text-lg font-bold vazir">
                مشاهده همه محصولات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary vazir">دسته‌بندی محصولات</h2>
            <p className="text-lg text-charcoal max-w-3xl mx-auto vazir">محصولات متنوع ما در دسته‌بندی‌های مختلف</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingCategories ? (
              // Show skeleton while loading
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))
            ) : categories && categories.length > 0 ? (
              // Show categories
              categories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="vazir text-gray-500">دسته‌بندی یافت نشد</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 vazir">نمایشگاه مبلمان پاشا</h2>
            <p className="text-lg max-w-3xl mx-auto opacity-90 vazir">از نمایشگاه بزرگ و مدرن ما دیدن کنید و با طراحی‌های منحصر به فرد ما آشنا شوید</p>
          </div>
          
          {isLoadingGallery ? (
            // Show skeleton while loading
            <div className="animate-pulse">
              <div className="bg-gray-700 h-[500px] rounded-lg"></div>
            </div>
          ) : gallery && gallery.length > 0 ? (
            // Show gallery slider
            <GallerySlider images={gallery} />
          ) : (
            <div className="text-center py-8">
              <p className="vazir text-gray-300">تصویری در گالری یافت نشد</p>
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link href="/contact">
              <Button className="bg-secondary text-primary px-8 py-6 rounded-lg hover:bg-opacity-90 transition duration-300 text-lg font-bold vazir">
                بازدید از نمایشگاه
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary vazir">درباره مبلمان پاشا</h2>
              <div className="prose prose-lg max-w-none">
                <p className="mb-4 text-charcoal vazir">مبلمان پاشا با بیش از ۲۰ سال سابقه درخشان، یکی از برترین ارائه دهندگان مبلمان لوکس و مدرن در ایران است. ما با تمرکز بر کیفیت و طراحی منحصر به فرد، همواره سعی در ارائه بهترین محصولات به مشتریان خود داشته‌ایم.</p>
                <p className="mb-4 text-charcoal vazir">تیم طراحی ما با الهام از جدیدترین روندهای جهانی و با حفظ اصالت ایرانی، محصولاتی را ارائه می‌دهد که ترکیبی از زیبایی، راحتی و کیفیت هستند.</p>
                <p className="text-charcoal vazir">در مبلمان پاشا، ما به مشتریان خود مشاوره تخصصی ارائه می‌دهیم تا بهترین انتخاب را برای فضای زندگی یا کار خود داشته باشند.</p>
              </div>
              <div className="mt-8">
                <Link href="/contact">
                  <Button className="bg-primary text-white px-6 py-3 rounded hover:bg-opacity-90 transition duration-300 vazir">
                    تماس با ما
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-full h-full border-2 border-secondary rounded-lg"></div>
                <img 
                  src="https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="نمایشگاه مبلمان پاشا" 
                  className="rounded-lg w-full h-auto relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
