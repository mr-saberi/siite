import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Dashboard from "@/pages/admin/Dashboard";
import ProductsManage from "@/pages/admin/ProductsManage";
import CategoryManage from "@/pages/admin/CategoryManage";
import CreateProduct from "@/pages/admin/CreateProduct";
import EditProduct from "@/pages/admin/EditProduct";
import { AuthProvider } from "@/contexts/AuthContext";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/login" component={Login} />
          <Route path="/admin" component={Dashboard} />
          <Route path="/admin/products" component={ProductsManage} />
          <Route path="/admin/categories" component={CategoryManage} />
          <Route path="/admin/products/create" component={CreateProduct} />
          <Route path="/admin/products/edit/:id" component={EditProduct} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
