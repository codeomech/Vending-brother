// components/cart/EmptyCartState.tsx
import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Package } from "lucide-react";

export default function EmptyCartState() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header for empty cart */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-6 md:p-8 max-w-md w-full mx-4 text-center shadow-lg">
            <CardContent className="space-y-6">
              <div className="relative">
                <ShoppingCart className="h-16 md:h-20 w-16 md:w-20 text-gray-300 mx-auto" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-sm">0</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Looks like you haven't added any items to your cart yet.
                </p>
              </div>

              <div className="space-y-3">
                <Link href="/">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Start Shopping
                  </Button>
                </Link>
              </div>

              <div className="text-sm text-gray-500">
                <p>💡 Browse our fresh selection of snacks and drinks!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
