import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Instagram, Send, MessageSquare } from "lucide-react";
import MapComponent from "@/components/ui/map";

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(3, { message: "نام باید حداقل ۳ حرف باشد" }),
  email: z.string().email({ message: "ایمیل نامعتبر است" }),
  phone: z.string().min(10, { message: "شماره تلفن نامعتبر است" }),
  subject: z.string().min(3, { message: "موضوع باید حداقل ۳ حرف باشد" }),
  message: z.string().min(10, { message: "پیام باید حداقل ۱۰ حرف باشد" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    document.title = "تماس با ما - مبلمان پاشا";
  }, []);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });
  
  const onSubmit = (values: ContactFormValues) => {
    setIsSubmitting(true);
    // In a real application, this would send the data to a server
    setTimeout(() => {
      toast({
        title: "پیام شما با موفقیت ارسال شد",
        description: "کارشناسان ما به زودی با شما تماس خواهند گرفت.",
      });
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <div className="bg-light py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary vazir">تماس با ما</h1>
          <p className="text-lg text-charcoal max-w-3xl mx-auto vazir">
            برای دریافت مشاوره، قیمت‌ها و اطلاعات بیشتر با ما در تماس باشید
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <div className="bg-cream p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-primary vazir">اطلاعات تماس</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="text-secondary mt-1 ml-3 h-5 w-5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary vazir">آدرس:</h3>
                    <p className="text-charcoal vazir">تهران، خیابان ولیعصر، بالاتر از میدان ونک، شماره ۲۵۶</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-secondary mt-1 ml-3 h-5 w-5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary vazir">تلفن:</h3>
                    <p className="text-charcoal vazir ltr">+98 21 8877 6655</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="text-secondary mt-1 ml-3 h-5 w-5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary vazir">ایمیل:</h3>
                    <p className="text-charcoal vazir">info@pashafurniture.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="text-secondary mt-1 ml-3 h-5 w-5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary vazir">ساعات کاری:</h3>
                    <p className="text-charcoal vazir">شنبه تا پنجشنبه: ۱۰ صبح تا ۸ شب</p>
                    <p className="text-charcoal vazir">جمعه: ۱۱ صبح تا ۶ عصر</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-bold text-primary mb-3 vazir">ما را در شبکه‌های اجتماعی دنبال کنید:</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-primary hover:text-secondary transition duration-300">
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-primary hover:text-secondary transition duration-300">
                    <Send className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-primary hover:text-secondary transition duration-300">
                    <MessageSquare className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 h-64 rounded-lg overflow-hidden">
              <MapComponent 
                position={[35.7219, 51.3347]} 
                zoom={15} 
                popupText="مبلمان پاشا"
              />
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <div className="bg-cream p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-primary vazir">ارسال پیام</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="vazir">نام و نام خانوادگی</FormLabel>
                        <FormControl>
                          <Input className="vazir" placeholder="نام خود را وارد کنید" {...field} />
                        </FormControl>
                        <FormMessage className="vazir text-right" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="vazir">ایمیل</FormLabel>
                        <FormControl>
                          <Input className="vazir" type="email" placeholder="ایمیل خود را وارد کنید" {...field} />
                        </FormControl>
                        <FormMessage className="vazir text-right" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="vazir">شماره تماس</FormLabel>
                        <FormControl>
                          <Input className="vazir" type="tel" placeholder="شماره تماس خود را وارد کنید" {...field} />
                        </FormControl>
                        <FormMessage className="vazir text-right" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="vazir">موضوع</FormLabel>
                        <FormControl>
                          <Input className="vazir" placeholder="موضوع پیام خود را وارد کنید" {...field} />
                        </FormControl>
                        <FormMessage className="vazir text-right" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="vazir">پیام</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="vazir" 
                            placeholder="پیام خود را بنویسید" 
                            rows={5} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="vazir text-right" />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-secondary text-primary font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-300 vazir"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "در حال ارسال..." : "ارسال پیام"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
