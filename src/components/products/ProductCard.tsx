
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Info, Flower, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t, language } = useLanguage();
  
  const {
    id,
    name,
    shortDescription,
    price,
    imageUrl,
    category,
    thcContent,
    cbdContent,
    terpenes,
  } = product;

  // Format price to EUR
  const formattedPrice = new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", {
    style: "currency",
    currency: "EUR",
  }).format(price);

  // Custom properties that might not exist in all products
  const isNew = false; // Default to false since it's not in the Product type
  const rating = null; // Default to null since it's not in the Product type

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl group">
      <div className="relative">
        <div className="aspect-square w-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 w-full">
              <Link to={`/products/${id}`} className="w-full">
                <Button variant="secondary" size="sm" className="w-full rounded-xl">
                  <Info size={16} className="mr-2" />
                  <span>{language === "de" ? "Details anzeigen" : "View details"}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs rounded-full px-3 shadow-sm">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
          {isNew && (
            <Badge className="bg-primary text-white text-xs rounded-full px-3 shadow-sm">
              {language === "de" ? "Neu" : "New"}
            </Badge>
          )}
        </div>
        {rating && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-medium shadow-sm">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{rating}</span>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-5">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 h-10 leading-5">
            {shortDescription}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {thcContent && (
              <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:text-purple-300">
                THC: {thcContent}
              </span>
            )}
            {cbdContent && (
              <span className="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900/30 px-2.5 py-0.5 text-xs font-medium text-teal-800 dark:text-teal-300">
                CBD: {cbdContent}
              </span>
            )}
            {terpenes && terpenes[0] && (
              <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300">
                <Flower className="h-3 w-3 mr-1" />
                {terpenes[0]}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-5 pb-5 pt-0 flex flex-col gap-3">
        <div className="w-full flex justify-between items-center">
          <span className="font-bold text-lg text-gray-900 dark:text-white">
            {formattedPrice}
          </span>
        </div>
        
        <Button className="w-full gap-1 rounded-xl bg-primary hover:bg-primary/90 text-white">
          <ShoppingCart size={16} />
          <span>{language === "de" ? "In den Warenkorb" : "Add to Cart"}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
