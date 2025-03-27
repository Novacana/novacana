
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyCart: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <ShoppingCart size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        Your cart is empty
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Add products to your cart from our catalog.
      </p>
      <div className="mt-6">
        <Button onClick={() => navigate("/products")}>Browse Products</Button>
      </div>
    </div>
  );
};

export default EmptyCart;
