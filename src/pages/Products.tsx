import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Product } from "@/types";
import { products as mockProducts } from "@/data/products";

const Products = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 300] as [number, number],
    thcContent: "all",
    cbdContent: "all",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch products
  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProducts(mockProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products when filters or search query changes
  useEffect(() => {
    if (!products.length) return;

    let result = [...products];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter((product) => product.category === filters.category);
    }

    // Apply price range filter
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Apply THC content filter
    if (filters.thcContent !== "all") {
      if (filters.thcContent === "high") {
        result = result.filter((product) => {
          const thc = parseFloat(product.thcContent?.replace('%', '') || "0");
          return thc >= 15;
        });
      } else if (filters.thcContent === "medium") {
        result = result.filter((product) => {
          const thc = parseFloat(product.thcContent?.replace('%', '') || "0");
          return thc >= 5 && thc < 15;
        });
      } else if (filters.thcContent === "low") {
        result = result.filter((product) => {
          const thc = parseFloat(product.thcContent?.replace('%', '') || "0");
          return thc > 0 && thc < 5;
        });
      } else if (filters.thcContent === "none") {
        result = result.filter((product) => {
          const thc = parseFloat(product.thcContent?.replace('%', '') || "0");
          return thc === 0;
        });
      }
    }

    // Apply CBD content filter
    if (filters.cbdContent !== "all") {
      if (filters.cbdContent === "high") {
        result = result.filter((product) => {
          const cbd = parseFloat(product.cbdContent?.replace('%', '') || "0");
          return cbd >= 10;
        });
      } else if (filters.cbdContent === "medium") {
        result = result.filter((product) => {
          const cbd = parseFloat(product.cbdContent?.replace('%', '') || "0");
          return cbd >= 5 && cbd < 10;
        });
      } else if (filters.cbdContent === "low") {
        result = result.filter((product) => {
          const cbd = parseFloat(product.cbdContent?.replace('%', '') || "0");
          return cbd > 0 && cbd < 5;
        });
      } else if (filters.cbdContent === "none") {
        result = result.filter((product) => {
          const cbd = parseFloat(product.cbdContent?.replace('%', '') || "0");
          return cbd === 0;
        });
      }
    }

    setFilteredProducts(result);
  }, [products, searchQuery, filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (
    name: keyof typeof filters,
    value: string | number[]
  ) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const resetFilters = () => {
    setFilters({
      category: "all",
      priceRange: [0, 300],
      thcContent: "all",
      cbdContent: "all",
    });
    setSearchQuery("");
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container-content">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Medical Cannabis Products
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Browse our selection of high-quality medical cannabis products available for pharmacy order.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="glass-card p-5 rounded-lg sticky top-24">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                      Filters
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="w-full justify-start text-sm"
                    >
                      <X size={14} className="mr-2" />
                      Reset Filters
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => handleFilterChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="flower">Flower</SelectItem>
                        <SelectItem value="extract">Extract</SelectItem>
                        <SelectItem value="oil">Oil</SelectItem>
                        <SelectItem value="capsule">Capsule</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Price Range</Label>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        €{filters.priceRange[0]} - €{filters.priceRange[1]}
                      </span>
                    </div>
                    <Slider
                      defaultValue={filters.priceRange}
                      min={0}
                      max={300}
                      step={5}
                      value={filters.priceRange}
                      onValueChange={(value) => handleFilterChange("priceRange", value)}
                      className="my-4"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thcContent">THC Content</Label>
                    <Select
                      value={filters.thcContent}
                      onValueChange={(value) => handleFilterChange("thcContent", value)}
                    >
                      <SelectTrigger id="thcContent">
                        <SelectValue placeholder="Select THC Content" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="high">High (15%+)</SelectItem>
                        <SelectItem value="medium">Medium (5-15%)</SelectItem>
                        <SelectItem value="low">Low (0-5%)</SelectItem>
                        <SelectItem value="none">None (0%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cbdContent">CBD Content</Label>
                    <Select
                      value={filters.cbdContent}
                      onValueChange={(value) => handleFilterChange("cbdContent", value)}
                    >
                      <SelectTrigger id="cbdContent">
                        <SelectValue placeholder="Select CBD Content" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="high">High (10%+)</SelectItem>
                        <SelectItem value="medium">Medium (5-10%)</SelectItem>
                        <SelectItem value="low">Low (0-5%)</SelectItem>
                        <SelectItem value="none">None (0%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Filter Bar */}
              <div className="mb-6 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Search size={18} />
                  </div>
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10"
                  />
                </div>
                
                {/* Mobile filter button */}
                <Button
                  variant="outline"
                  onClick={toggleFilters}
                  className="lg:hidden flex items-center"
                >
                  <SlidersHorizontal size={16} className="mr-2" />
                  Filters
                </Button>
              </div>
              
              {/* Mobile Filters */}
              {isFilterOpen && (
                <div className="lg:hidden mb-6">
                  <div className="glass-card p-5 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Filters
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleFilters}
                        className="p-1 h-auto"
                      >
                        <X size={18} />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="mobile-category">Category</Label>
                        <Select
                          value={filters.category}
                          onValueChange={(value) => handleFilterChange("category", value)}
                        >
                          <SelectTrigger id="mobile-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="flower">Flower</SelectItem>
                            <SelectItem value="extract">Extract</SelectItem>
                            <SelectItem value="oil">Oil</SelectItem>
                            <SelectItem value="capsule">Capsule</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Price Range</Label>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            €{filters.priceRange[0]} - €{filters.priceRange[1]}
                          </span>
                        </div>
                        <Slider
                          defaultValue={filters.priceRange}
                          min={0}
                          max={300}
                          step={5}
                          value={filters.priceRange}
                          onValueChange={(value) => handleFilterChange("priceRange", value)}
                          className="my-4"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="mobile-thcContent">THC Content</Label>
                          <Select
                            value={filters.thcContent}
                            onValueChange={(value) => handleFilterChange("thcContent", value)}
                          >
                            <SelectTrigger id="mobile-thcContent">
                              <SelectValue placeholder="Select THC" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="high">High (15%+)</SelectItem>
                              <SelectItem value="medium">Medium (5-15%)</SelectItem>
                              <SelectItem value="low">Low (0-5%)</SelectItem>
                              <SelectItem value="none">None (0%)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="mobile-cbdContent">CBD Content</Label>
                          <Select
                            value={filters.cbdContent}
                            onValueChange={(value) => handleFilterChange("cbdContent", value)}
                          >
                            <SelectTrigger id="mobile-cbdContent">
                              <SelectValue placeholder="Select CBD" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="high">High (10%+)</SelectItem>
                              <SelectItem value="medium">Medium (5-10%)</SelectItem>
                              <SelectItem value="low">Low (0-5%)</SelectItem>
                              <SelectItem value="none">None (0%)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          onClick={resetFilters}
                          className="w-full"
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Results info */}
              <div className="mb-6 flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isLoading
                    ? "Loading products..."
                    : `Showing ${filteredProducts.length} of ${products.length} products`}
                </p>
              </div>
              
              {/* Product Grid */}
              <ProductGrid products={filteredProducts} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
