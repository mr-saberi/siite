import { Link } from "wouter";
import { ChevronLeft, Star } from "lucide-react";
import { formatPrice, truncateText } from "@/lib/utils";
import { type Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group relative bg-card rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden border border-border hover:border-primary/30">
      {/* Special badges */}
      {product.featured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-secondary text-white vazir font-bold shadow-md">
            محصول ویژه
          </Badge>
        </div>
      )}
      
      {/* Image container with hover effect */}
      <div className="relative overflow-hidden h-72">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent transition-opacity opacity-0 group-hover:opacity-100" />
      </div>
      
      {/* Content area */}
      <div className="relative p-5">
        {/* Title and rating */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold text-foreground vazir line-clamp-1">{product.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 ml-1" />
            <span className="text-sm font-medium vazir">۴.۸</span>
          </div>
        </div>
        
        {/* Category ID badge (would be better to fetch category name) */}
        <div className="mb-3">
          <Badge variant="outline" className="vazir text-xs">
            دسته‌بندی {product.categoryId}
          </Badge>
        </div>
        
        {/* Description */}
        <p className="text-muted-foreground mb-4 vazir text-sm h-12 line-clamp-2">
          {truncateText(product.description, 100)}
        </p>
        
        {/* Price and action row */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="font-bold text-primary vazir">
            {product.price ? formatPrice(product.price) : '۰'} تومان
          </span>
          
          <Link href={`/products/${product.id}`} className="text-secondary font-bold hover:text-secondary/90 transition-colors duration-200 vazir flex items-center text-sm">
            مشاهده جزئیات
            <ChevronLeft className="mr-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
