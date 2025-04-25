import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { MapPin, Phone, Mail, Instagram, Send, MessageSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 vazir">مبلمان پاشا</h3>
            <p className="text-gray-300 mb-4 vazir">ارائه دهنده برترین و با کیفیت‌ترین مبلمان خانگی و اداری</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-secondary transition duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-secondary transition duration-300">
                <Send className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-secondary transition duration-300">
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 vazir">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-secondary transition duration-300 vazir">صفحه اصلی</a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-gray-300 hover:text-secondary transition duration-300 vazir">محصولات</a>
                </Link>
              </li>
              <li>
                <Link href="/#gallery">
                  <a className="text-gray-300 hover:text-secondary transition duration-300 vazir">گالری</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-300 hover:text-secondary transition duration-300 vazir">درباره ما</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-300 hover:text-secondary transition duration-300 vazir">تماس با ما</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 vazir">خدمات</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-secondary transition duration-300 vazir">مشاوره دکوراسیون</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-secondary transition duration-300 vazir">طراحی سفارشی</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-secondary transition duration-300 vazir">تحویل و نصب</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-secondary transition duration-300 vazir">گارانتی محصولات</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 vazir">تماس با ما</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="text-secondary mt-1 ml-2 h-4 w-4 flex-shrink-0" />
                <span className="text-gray-300 vazir">تهران، خیابان ولیعصر، بالاتر از میدان ونک، شماره ۲۵۶</span>
              </li>
              <li className="flex items-start">
                <Phone className="text-secondary mt-1 ml-2 h-4 w-4 flex-shrink-0" />
                <span className="text-gray-300 vazir ltr">+98 21 8877 6655</span>
              </li>
              <li className="flex items-start">
                <Mail className="text-secondary mt-1 ml-2 h-4 w-4 flex-shrink-0" />
                <span className="text-gray-300 vazir">info@pashafurniture.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-700 my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 vazir">© ۱۴۰۲ مبلمان پاشا. تمامی حقوق محفوظ است.</p>
          <div className="mt-4 md:mt-0">
            <span className="text-gray-400 vazir">طراحی و توسعه توسط گروه طراحی پاشا</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
