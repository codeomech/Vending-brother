// components/cart/QuickActionsCard.tsx
import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export default function QuickActionsCard() {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-4 md:pt-6">
        <div className="space-y-3">
          <Link href="/" className="block">
            <Button variant="outline" className="w-full" size="lg">
              <Package className="h-4 w-4 mr-2" />
              Add More Items
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
