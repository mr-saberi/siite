import { Link } from "wouter";
import { type Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link href={`/products?category=${category.id}`}>
      <a className="bg-cream rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:-translate-y-2 block">
        <div className="h-48 overflow-hidden">
          <img 
            src={category.image} 
            alt={category.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="text-xl font-bold text-primary vazir">{category.name}</h3>
          <p className="text-sm text-charcoal mt-2 vazir">{category.nameEn}</p>
          <span className="inline-block mt-3 text-secondary vazir hover:underline">مشاهده محصولات</span>
        </div>
      </a>
    </Link>
  );
};

export default CategoryCard;
