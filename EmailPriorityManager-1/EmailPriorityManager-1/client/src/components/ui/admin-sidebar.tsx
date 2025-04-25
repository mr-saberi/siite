import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Image,
  LogOut,
  ChevronLeft,
  Menu,
  X
} from "lucide-react";

const AdminSidebar = () => {
  const [location] = useLocation();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const sidebarItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "داشبورد",
      href: "/admin",
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      label: "محصولات",
      href: "/admin/products",
    },
    {
      icon: <Layers className="h-5 w-5" />,
      label: "دسته‌بندی‌ها",
      href: "/admin/categories",
    },
    {
      icon: <Image className="h-5 w-5" />,
      label: "گالری",
      href: "/admin/gallery",
    },
    {
      icon: <ChevronLeft className="h-5 w-5" />,
      label: "بازگشت به سایت",
      href: "/",
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on small screens */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileMenu}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        >
          {isMobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar - Full version for desktop, collapsible */}
      <div
        className={cn(
          "bg-primary text-white h-screen flex-shrink-0 transition-all duration-300 hidden md:block",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h1 className={cn("font-bold text-xl vazir", isCollapsed && "hidden")}>
            پنل مدیریت
          </h1>
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-secondary"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronLeft className="h-5 w-5 rotate-180" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="py-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <a
                    className={cn(
                      "flex items-center py-2 px-4 text-white hover:bg-primary-dark transition-colors",
                      location === item.href && "bg-slate-700",
                      isCollapsed ? "justify-center" : "justify-start"
                    )}
                  >
                    <span className="ml-3">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="vazir text-sm">{item.label}</span>
                    )}
                  </a>
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={logout}
                className={cn(
                  "flex items-center py-2 px-4 text-white hover:bg-primary-dark transition-colors w-full",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
              >
                <span className="ml-3">
                  <LogOut className="h-5 w-5" />
                </span>
                {!isCollapsed && (
                  <span className="vazir text-sm">خروج</span>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar - Full screen overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-primary text-white z-40 md:hidden transition-transform duration-300 transform",
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-16">
          <div className="p-4 border-b border-slate-700">
            <h1 className="font-bold text-xl vazir">پنل مدیریت</h1>
          </div>

          <nav className="py-4 flex-grow">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a
                      className={cn(
                        "flex items-center py-3 px-4 text-white hover:bg-slate-700 transition-colors",
                        location === item.href && "bg-slate-700"
                      )}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <span className="ml-3">{item.icon}</span>
                      <span className="vazir">{item.label}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-700">
            <button
              onClick={() => {
                logout();
                setIsMobileOpen(false);
              }}
              className="flex items-center py-3 px-4 text-white hover:bg-slate-700 transition-colors w-full"
            >
              <LogOut className="ml-3 h-5 w-5" />
              <span className="vazir">خروج</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
