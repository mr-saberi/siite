import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Form schema for login
const loginSchema = z.object({
  username: z.string().min(3, { message: "نام کاربری باید حداقل 3 کاراکتر باشد" }),
  password: z.string().min(6, { message: "رمز عبور باید حداقل 6 کاراکتر باشد" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [, navigate] = useLocation();
  const { login, user } = useAuth();
  const { toast } = useToast();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.isAdmin ? "/admin" : "/");
    }
  }, [user, navigate]);
  
  useEffect(() => {
    document.title = "ورود مدیریت - مبلمان پاشا";
  }, []);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.username, values.password);
      toast({
        title: "ورود موفقیت‌آمیز",
        description: "به پنل مدیریت مبلمان پاشا خوش آمدید",
      });
      navigate("/admin");
    } catch (error) {
      toast({
        title: "خطا در ورود",
        description: "نام کاربری یا رمز عبور اشتباه است",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="bg-light min-h-screen flex items-center justify-center py-16">
      <div className="container max-w-md">
        <Card className="mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary vazir">
              ورود به پنل مدیریت
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="vazir">نام کاربری</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="نام کاربری خود را وارد کنید" 
                          className="vazir"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="vazir text-right" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="vazir">رمز عبور</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="رمز عبور خود را وارد کنید" 
                          className="vazir"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="vazir text-right" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white vazir"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "در حال ورود..." : "ورود"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center">
              <p className="text-gray-600 vazir text-sm">
                نام کاربری: admin | رمز عبور: admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
