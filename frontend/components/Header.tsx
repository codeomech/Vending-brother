// components/Header.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Store } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface HeaderProps {
  productsCount?: number;
}

export default function Header({ productsCount = 0 }: HeaderProps) {
  const { getTotalItems, setIsCartOpen } = useCart();
  const totalItems = getTotalItems();

  const handleCartClick = () => {
    if (totalItems > 0) {
      setIsCartOpen(true);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      {/* Top Navigation Bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2 md:space-x-3">
            <div className="relative w-8 h-8 md:w-10 md:h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Store className="h-5 w-5 md:h-6 md:w-6 text-white" />
              {/* Alternative: Use actual logo image */}
              {/* <Image 
                src="/logo.png" 
                alt="Wendor Logo" 
                width={40} 
                height={40} 
                className="rounded-lg"
              /> */}
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                Vending Brothers
              </span>
              <span className="text-xs md:text-sm text-gray-500 hidden sm:block">
                Snack it up!!
              </span>
            </div>
          </Link>

          {/* Cart Button & Mobile Menu */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Products Count Badge */}
            {productsCount > 0 && (
              <div className="items-center space-x-2 bg-green-100 text-green-800 px-1 py-1 md:px-4 md:py-2 rounded-full border border-green-200 hidden lg:inline-flex">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-sm md:text-base">
                  {productsCount} fresh{" "}
                  {productsCount === 1 ? "product" : "products"} available
                </span>
              </div>
            )}
            {/* Cart Button */}
            <Button
              variant="outline"
              onClick={handleCartClick}
              className="relative p-2 md:px-4 md:py-2 border-gray-300 hover:border-green-500 hover:text-green-600 transition-colors"
              disabled={totalItems === 0}
            >
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline ml-2 text-sm md:text-base">
                Cart
              </span>
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 md:h-6 md:w-6 flex items-center justify-center p-0 text-xs bg-green-600 hover:bg-green-600 animate-pulse">
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-6xl font-bold text-gray-900 mb-2 md:mb-4">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Vending
              </span>{" "}
              <span className="block sm:inline">Brothers</span>
            </h1>

            {/* Quick Stats */}
            <div className="mt-4 md:mt-6 flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <span>Always Fresh</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
