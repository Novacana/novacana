
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Info, Flower } from "lucide-react";
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

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <div className="relative">
        <div className="aspect-square w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 h-10">
            {shortDescription}
          </p>
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex flex-wrap gap-2">
              {thcContent && (
                <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300">
                  THC: {thcContent}
                </span>
              )}
              {cbdContent && (
                <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                  CBD: {cbdContent}
                </span>
              )}
              {terpenes && terpenes[0] && (
                <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:text-purple-300">
                  <Flower className="h-3 w-3 mr-1" />
                  {terpenes[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-col gap-3">
        <div className="w-full flex justify-between items-center">
          <span className="font-bold text-lg text-gray-900 dark:text-white">
            {formattedPrice}
          </span>
          <Link to={`/products/${id}`}>
            <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
              <Info size={16} />
              <span className="sr-only">{language === "de" ? "Details anzeigen" : "View details"}</span>
            </Button>
          </Link>
        </div>
        
        <Button className="w-full gap-1">
          <ShoppingCart size={16} />
          <span>{language === "de" ? "In den Warenkorb" : "Add to Cart"}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
