// components/cart/WhyChooseUsCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Package, Shield } from "lucide-react";

export default function WhyChooseUsCard() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base md:text-lg">Why Choose Us?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Instant Delivery</p>
              <p className="text-gray-600 text-xs md:text-sm">
                Get your items immediately from our vending machine
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Fresh Products</p>
              <p className="text-gray-600 text-xs md:text-sm">
                All items are regularly restocked and fresh
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Secure Payment</p>
              <p className="text-gray-600 text-xs md:text-sm">
                Advanced encryption protects your transactions
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
