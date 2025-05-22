// components/cart/CartItemsList.tsx
import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";
import QuickActionsCard from "./QuickActionCard";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  available_units: number;
  display_image_url?: string;
}

interface CartItemsListProps {
  cartItems: CartItem[];
  handleQuantityChange: (productId: string, newQuantity: number) => void;
  handleRemoveItem: (productId: string) => void;
  handleClearCart: () => void;
}

export default function CartItemsList({
  cartItems,
  handleQuantityChange,
  handleRemoveItem,
  handleClearCart,
}: CartItemsListProps) {
  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 space-y-2 sm:space-y-0">
          <CardTitle className="text-lg md:text-xl">Cart Items</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 w-fit"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 md:space-y-6">
          {cartItems.map((item, index) => (
            <div key={item.id}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-3 md:p-4 bg-white rounded-lg border border-gray-100">
                {/* Product Image and Details Container */}
                <div className="flex items-start space-x-3 sm:space-x-4 flex-1 w-full sm:w-auto">
                  {/* Product Image */}
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.display_image_url || "/images/default.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/default.jpg";
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base md:text-lg text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <div className="mt-1 space-y-1">
                      <p className="text-green-600 font-medium text-sm md:text-base">
                        {item.price.toFixed(2)} Rs each
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {item.available_units} available in stock
                      </p>
                      {item.quantity > item.available_units && (
                        <p className="text-xs text-red-600 font-medium">
                          ⚠️ Only {item.available_units} available
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls and Total - Mobile Layout */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-center sm:space-y-3">
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-1 border border-gray-200 rounded-lg bg-white">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <Minus className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>

                    <div className="px-2 md:px-3 py-1 min-w-[2.5rem] md:min-w-[3rem] text-center">
                      <span className="font-semibold text-base md:text-lg">
                        {item.quantity}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.available_units}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <Plus className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>

                  {/* Item Total - Mobile */}
                  <div className="text-right sm:hidden">
                    <p className="font-bold text-lg text-green-600">
                      {(item.price * item.quantity).toFixed(2)}Rs
                    </p>
                  </div>
                </div>

                {/* Desktop Item Total and Remove Button */}
                <div className="hidden sm:flex sm:flex-col sm:items-center sm:space-y-2 sm:min-w-[100px]">
                  <div className="text-right">
                    <p className="font-bold text-lg md:text-xl text-green-600">
                      {(item.price * item.quantity).toFixed(2)} Rs
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      {item.quantity} × {item.price.toFixed(2)}Rs
                    </p>
                  </div>
                </div>

                {/* Remove Button - Full Width on Mobile */}
                <div className="w-full sm:w-auto flex justify-center sm:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2 w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>

              {index < cartItems.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </CardContent>
      </Card>
      <QuickActionsCard />
    </>
  );
}
