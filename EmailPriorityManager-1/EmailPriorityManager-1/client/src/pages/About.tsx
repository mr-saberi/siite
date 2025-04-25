import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const About = () => {
  useEffect(() => {
    document.title = "درباره ما - مبلمان پاشا";
  }, []);

  return (
    <div className="bg-light py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary vazir text-center mb-12">
            درباره مبلمان پاشا
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative order-1 md:order-1">
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-full h-full border-2 border-secondary rounded-lg"></div>
                <img 
                  src="https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="نمایشگاه مبلمان پاشا" 
                  className="rounded-lg w-full h-auto relative z-10"
                />
              </div>
            </div>
            
            <div className="order-2 md:order-2">
              <h2 className="text-2xl font-bold text-primary vazir mb-4">
                داستان ما
              </h2>
              <p className="text-gray-700 vazir leading-relaxed mb-4">
                مبلمان پاشا با بیش از ۲۰ سال سابقه درخشان، یکی از برترین ارائه دهندگان مبلمان لوکس و مدرن در ایران است. ما فعالیت خود را از یک کارگاه کوچک در سال ۱۳۸۰ آغاز کردیم و امروز به یکی از معتبرترین برندهای صنعت مبلمان کشور تبدیل شده‌ایم.
              </p>
              <p className="text-gray-700 vazir leading-relaxed">
                در طول این سال‌ها، ما همواره به اصول اولیه خود پایبند بوده‌ایم: کیفیت بی‌نظیر، طراحی منحصر به فرد، و ارائه خدمات برتر به مشتریان.
              </p>
            </div>
          </div>
          
          <div className="bg-cream p-8 rounded-lg shadow-md mb-16">
            <h2 className="text-2xl font-bold text-primary vazir mb-6 text-center">
              ارزش‌های ما
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary vazir mb-2">کیفیت</h3>
                <p className="text-gray-700 vazir">استفاده از مرغوب‌ترین مواد اولیه و دقت در تمام مراحل تولید</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary vazir mb-2">خلاقیت</h3>
                <p className="text-gray-700 vazir">نوآوری در طراحی و توجه به جزئیات برای خلق محصولات منحصر به فرد</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary vazir mb-2">مشتری‌مداری</h3>
                <p className="text-gray-700 vazir">ارائه خدمات ویژه و توجه به نیازهای مشتریان برای جلب رضایت آن‌ها</p>
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-primary vazir mb-6 text-center">
              تیم ما
            </h2>
            <p className="text-gray-700 vazir leading-relaxed mb-8 text-center">
              تیم مبلمان پاشا متشکل از طراحان خلاق، صنعتگران ماهر و کارشناسان متخصص است که با عشق و تعهد برای ارائه بهترین محصولات تلاش می‌کنند.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80" 
                  alt="محمد پاشایی - مدیر عامل" 
                  className="w-24 h-24 rounded-full object-cover ml-6"
                />
                <div>
                  <h3 className="text-xl font-bold text-primary vazir">محمد پاشایی</h3>
                  <p className="text-gray-600 vazir mb-2">مدیر عامل و بنیانگذار</p>
                  <p className="text-gray-700 vazir text-sm">با بیش از ۲۵ سال تجربه در صنعت مبلمان و طراحی داخلی</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80" 
                  alt="سارا محمدی - مدیر طراحی" 
                  className="w-24 h-24 rounded-full object-cover ml-6"
                />
                <div>
                  <h3 className="text-xl font-bold text-primary vazir">سارا محمدی</h3>
                  <p className="text-gray-600 vazir mb-2">مدیر طراحی</p>
                  <p className="text-gray-700 vazir text-sm">فارغ‌التحصیل طراحی صنعتی از دانشگاه تهران با ۱۵ سال سابقه</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary text-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold vazir mb-4">
              از نمایشگاه ما دیدن کنید
            </h2>
            <p className="vazir mb-6 opacity-90">
              برای مشاهده نزدیک محصولات، دریافت مشاوره تخصصی و آشنایی با جدیدترین طرح‌ها، به نمایشگاه مبلمان پاشا مراجعه کنید.
            </p>
            <Link href="/contact">
              <Button className="bg-secondary text-primary hover:bg-opacity-90 vazir">
                اطلاعات تماس و آدرس
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
