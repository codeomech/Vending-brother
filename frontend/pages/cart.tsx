// pages/cart.tsx or app/cart/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { buyItems } from "@/service/api";
import OrderSummary from "@/components/OrderSummary";
import CartItemsList from "@/components/CartItemList";
import WhyChooseUsCard from "@/components/WhyChooseUsCard";
import EmptyCartState from "@/components/EmptyCartState";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setError(null);
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    setError(null);
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    if (
      window.confirm("Are you sure you want to clear all items from your cart?")
    ) {
      clearCart();
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      const purchaseData = {
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await buyItems(purchaseData);

      if (response.success) {
        clearCart();
        router.push("/success");
      } else {
        setError(response.message || "Purchase failed");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Checkout failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center w-fit"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Continue Shopping</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Review your items before checkout
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="text-sm md:text-lg px-3 md:px-4 py-1 md:py-2 bg-blue-50 border-blue-200 w-fit"
          >
            {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
          </Badge>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-200 bg-red-50 mb-6">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Mobile Order Summary - Sticky at top */}
        <div className="lg:hidden mb-6">
          <OrderSummary
            cartItems={cartItems}
            getTotalPrice={getTotalPrice}
            getTotalItems={getTotalItems}
            handleCheckout={handleCheckout}
            isProcessing={isProcessing}
            error={error}
            isMobile={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <CartItemsList
              cartItems={cartItems}
              handleQuantityChange={handleQuantityChange}
              handleRemoveItem={handleRemoveItem}
              handleClearCart={handleClearCart}
            />
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block space-y-6">
            <OrderSummary
              cartItems={cartItems}
              getTotalPrice={getTotalPrice}
              getTotalItems={getTotalItems}
              handleCheckout={handleCheckout}
              isProcessing={isProcessing}
              error={error}
              isMobile={false}
            />
            <WhyChooseUsCard />
          </div>
        </div>

        {/* Mobile Additional Cards */}
        <div className="lg:hidden mt-6 space-y-6">
          <WhyChooseUsCard />
        </div>
      </div>
    </div>
  );
}
