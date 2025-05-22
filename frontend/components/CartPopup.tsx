// components/CartPopup.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, X, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CartPopup() {
  const { cartItems, getTotalItems, getTotalPrice, isCartOpen, setIsCartOpen } =
    useCart();
  const router = useRouter();

  if (!isCartOpen || cartItems.length === 0) {
    return null;
  }

  const handleViewCart = () => {
    setIsCartOpen(false);
    router.push("/cart");
  };

  const handleClose = () => {
    setIsCartOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-2 border-green-200 animate-in slide-in-from-bottom-2 bg-white">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-green-600">
                  {getTotalItems()}
                </Badge>
              </div>
              <span className="font-semibold text-green-600">
                Added to Cart!
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Cart Items Preview */}
          <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
            {cartItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <Badge
                    variant="outline"
                    className="text-xs px-1 bg-green-100"
                  >
                    {item.quantity}x
                  </Badge>
                  <span className="truncate text-gray-700 font-medium">
                    {item.name}
                  </span>
                </div>
                <span className="font-semibold text-green-600 ml-2">
                  {(item.price * item.quantity).toFixed(2)} Rs
                </span>
              </div>
            ))}

            {cartItems.length > 3 && (
              <div className="text-xs text-gray-500 text-center py-1">
                +{cartItems.length - 3} more items
              </div>
            )}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between py-2 border-t border-gray-200 mb-3">
            <span className="font-semibold text-gray-900">Cart Total:</span>
            <span className="font-bold text-lg text-green-600">
              {getTotalPrice().toFixed(2)} Rs
            </span>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleViewCart}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Cart & Checkout ({getTotalItems()})
            </Button>

            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
