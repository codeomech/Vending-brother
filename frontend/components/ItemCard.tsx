// components/ProductCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { useCart } from "@/contexts/CartContext";
import { Product } from "@/interface";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cartItems, updateQuantity } = useCart();

  // Check if product is already in cart
  const cartItem = cartItems.find((item) => item.id === product._id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(product, 1); // Always add 1 item initially
  };

  const handleIncrement = () => {
    if (isInCart && cartItem) {
      updateQuantity(product._id, cartQuantity + 1);
    }
  };

  const handleDecrement = () => {
    if (isInCart && cartItem) {
      if (cartQuantity > 1) {
        updateQuantity(product._id, cartQuantity - 1);
      } else {
        updateQuantity(product._id, 0);
      }
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        {/* Product Image */}
        <div className="relative aspect-[3/2] md:aspect-[3/3] mb-4 overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.display_image_url || "/images/default.svg"}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/default.jpg";
            }}
          />

          {/* Availability Badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant={product.available_units > 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {product.available_units > 0
                ? `${product.available_units} left`
                : "Out of Stock"}
            </Badge>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">
              {product.price.toFixed(2)} Rs
            </span>
          </div>

          {/* Add to Cart Controls */}
          <div className="mt-4">
            {product.available_units === 0 ? (
              <Button disabled className="w-full">
                Out of Stock
              </Button>
            ) : isInCart ? (
              // Show quantity controls for items in cart
              <div className="flex items-center justify-center border rounded-lg bg-gray-50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDecrement}
                  className="h-10 w-10 p-0 hover:bg-gray-200"
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span className="px-4 py-2 font-semibold text-lg min-w-[3rem] text-center">
                  {cartQuantity}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleIncrement}
                  disabled={cartQuantity >= product.available_units}
                  className="h-10 w-10 p-0 hover:bg-gray-200"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              // Show add to cart button for new items
              <Button onClick={handleAddToCart} className="w-full" size="lg">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
