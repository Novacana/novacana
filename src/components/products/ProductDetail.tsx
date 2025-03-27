
import React, { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingCart, Plus, Minus, Info, Box, Leaf, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    });
  };

  // Format price to EUR
  const formattedPrice = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(product.price);

  // Total price based on quantity
  const totalPrice = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(product.price * quantity);

  return (
    <div className="container-content py-8">
      <div className="mb-6">
        <Link to="/products" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-nova-600 dark:hover:text-nova-400 text-sm">
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              {product.shortDescription}
            </p>
            <div className="flex space-x-3 mb-4">
              {product.thcContent && (
                <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-sm font-medium text-amber-800 dark:text-amber-300">
                  THC: {product.thcContent}
                </span>
              )}
              {product.cbdContent && (
                <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300">
                  CBD: {product.cbdContent}
                </span>
              )}
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formattedPrice}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                excl. VAT
              </span>
            </div>
          </div>

          <Separator />

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus size={16} />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
                className="h-10 w-10"
              >
                <Plus size={16} />
                <span className="sr-only">Increase quantity</span>
              </Button>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                ({product.stock} available)
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Total: <span className="font-semibold">{totalPrice}</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button 
            size="lg" 
            className="w-full" 
            onClick={addToCart}
          >
            <ShoppingCart size={18} className="mr-2" />
            Add to Cart
          </Button>

          {/* Product Details */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Product Details
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-nova-600 dark:hover:text-nova-400"
              >
                {isExpanded ? "Show Less" : "Show More"}
                <ArrowDown size={16} className={`ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </Button>
            </div>
            
            <Card className="bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800">
              <CardContent className="p-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Info size={16} className="mr-2" />
                      Category
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </span>
                  </li>
                  {product.weight && (
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Box size={16} className="mr-2" />
                        Weight/Volume
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {product.weight}
                      </span>
                    </li>
                  )}
                  {product.manufacturer && (
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Leaf size={16} className="mr-2" />
                        Manufacturer
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {product.manufacturer}
                      </span>
                    </li>
                  )}
                  {isExpanded && (
                    <>
                      {product.countryOfOrigin && (
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Country of Origin</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {product.countryOfOrigin}
                          </span>
                        </li>
                      )}
                      {product.recommendedDosage && (
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Recommended Dosage</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {product.recommendedDosage}
                          </span>
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Product Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
