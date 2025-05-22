// components/cart/OrderSummary.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, Loader2, AlertCircle } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  getTotalPrice: () => number;
  getTotalItems: () => number;
  handleCheckout: () => void;
  isProcessing: boolean;
  error: string | null;
  isMobile: boolean;
}

export default function OrderSummary({
  cartItems,
  getTotalPrice,
  getTotalItems,
  handleCheckout,
  isProcessing,
  error,
  isMobile,
}: OrderSummaryProps) {
  return (
    <Card className={`shadow-sm ${!isMobile ? "top-4" : ""}`}>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl text-center">
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 md:space-y-6">
        {/* Items Breakdown - Hidden on mobile for space */}
        {!isMobile && (
          <>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 border-b pb-2">
                Items in your cart:
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-700 truncate block">
                        {item.name}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {item.price.toFixed(2)} Rs × {item.quantity}
                      </span>
                    </div>
                    <span className="font-medium text-green-600 ml-2">
                      {(item.price * item.quantity).toFixed(2)} Rs
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Subtotal and Total */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              Subtotal ({getTotalItems()} items):
            </span>
            <span className="font-medium">{getTotalPrice().toFixed(2)} Rs</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tax & Fees:</span>
            <span className="font-medium text-green-600">0.00 Rs</span>
          </div>
        </div>

        <Separator />

        {/* Grand Total */}
        <div className="flex justify-between items-center text-lg md:text-xl font-bold bg-green-50 p-3 rounded-lg">
          <span className="text-gray-900">Total:</span>
          <span className="text-green-600">
            {getTotalPrice().toFixed(2)} Rs
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Checkout Button */}
        <Button
          onClick={handleCheckout}
          disabled={isProcessing || cartItems.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 md:h-5 md:w-5 mr-2 animate-spin" />
              <span className="text-sm md:text-base">
                Processing Payment...
              </span>
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              <span className="text-sm md:text-base">Proceed to Checkout</span>
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          🔒 Your payment information is secure and encrypted
        </p>
      </CardContent>
    </Card>
  );
}
