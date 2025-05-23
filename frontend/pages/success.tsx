"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, ShoppingCart, Gift } from "lucide-react";

export default function SuccessPage() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      // Use window.location.replace() to prevent going back to this page
      window.location.replace('/');
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, []);

  const handleGoHome = () => {
    // Use window.location.replace() here as well
    window.location.replace('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl border-green-200">
        <CardContent className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Gift className="w-8 h-8 text-yellow-500 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-green-600">
              Purchase Successful!
            </h1>
            <p className="text-gray-600 text-lg">Thank you for your purchase</p>
          </div>

          {/* Success Details */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">
                Payment processed successfully
              </span>
            </div>
            <p className="text-sm text-green-600 mt-2">
              Your items will be dispensed shortly
            </p>
          </div>

          {/* Countdown */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="text-gray-600 text-sm">Redirecting to home page in</p>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {countdown} seconds
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGoHome}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <Link href="/cart" className="block">
              <Button variant="outline" className="w-full" size="lg">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shop More Items
              </Button>
            </Link>
          </div>

          {/* Additional Message */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">Enjoy your snacks! 🍿🥤</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
