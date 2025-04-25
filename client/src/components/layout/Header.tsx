import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Menu } from "lucide-react";

const Header = () => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="bg-primary text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold vazir ml-2">مبلمان پاشا</h1>
            <span className="latin playfair text-xl md:text-2xl font-light text-secondary">Pasha Furniture</span>
          </div>
          <button 
            onClick={toggleMenu}
            className="md:hidden text-white"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <nav className={cn(
          "md:flex flex-col md:flex-row w-full md:w-auto mt-4 md:mt-0",
          isMenuOpen ? "flex" : "hidden"
        )}>
          <Link href="/">
            <a className="block md:inline-block py-2 px-4 text-white hover:text-secondary transition duration-200 vazir text-lg">
              خانه
            </a>
          </Link>
          <Link href="/products">
            <a className="block md:inline-block py-2 px-4 text-white hover:text-secondary transition duration-200 vazir text-lg">
              محصولات
            </a>
          </Link>
          <Link href="/#gallery">
            <a className="block md:inline-block py-2 px-4 text-white hover:text-secondary transition duration-200 vazir text-lg">
              گالری
            </a>
          </Link>
          <Link href="/about">
            <a className="block md:inline-block py-2 px-4 text-white hover:text-secondary transition duration-200 vazir text-lg">
              درباره ما
            </a>
          </Link>
          <Link href="/contact">
            <a className="block md:inline-block py-2 px-4 text-white hover:text-secondary transition duration-200 vazir text-lg">
              تماس
            </a>
          </Link>
          
          {user ? (
            <div className="block md:inline-block py-2 px-4 md:mr-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 vazir text-secondary hover:text-white hover:bg-transparent">
                    <User className="ml-2 h-4 w-4" />
                    {user.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="vazir text-right w-48" align="end">
                  <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <a className="w-full cursor-pointer">مدیریت</a>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                    <LogOut className="ml-2 h-4 w-4" />
                    خروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/login">
              <a className="block md:inline-block py-2 px-4 md:mr-2 text-secondary hover:text-white transition duration-200 vazir text-lg">
                ورود مدیریت
              </a>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
