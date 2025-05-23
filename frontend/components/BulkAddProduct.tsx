"use client";

import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BulkProduct } from "@/interface";

interface BulkAddProductsProps {
  onAddProducts: (products: BulkProduct[]) => Promise<void>; // Make this async
}

export const BulkAddProducts = ({ onAddProducts }: BulkAddProductsProps) => {
  const [products, setProducts] = useState<BulkProduct[]>([
    { name: "", price: "", quantity: "", image: null },
  ]);
  const [isUploading, setIsUploading] = useState(false);

  // Create refs for file inputs to reset them
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const addProduct = () => {
    setProducts([
      ...products,
      { name: "", price: "", quantity: "", image: null },
    ]);
    // Add a new ref for the new product
    fileInputRefs.current.push(null);
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
      // Remove the corresponding ref
      fileInputRefs.current = fileInputRefs.current.filter(
        (_, i) => i !== index
      );
    }
  };

  const updateProduct = (
    index: number,
    field: keyof BulkProduct,
    value: string | File | null
  ) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const handleImageChange = (index: number, file: File | null) => {
    updateProduct(index, "image", file);
  };

  // Reset form to initial state
  const resetForm = () => {
    setProducts([{ name: "", price: "", quantity: "", image: null }]);

    // Reset all file inputs
    fileInputRefs.current.forEach((input) => {
      if (input) {
        input.value = "";
      }
    });

    // Reset refs array
    fileInputRefs.current = [null];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate products
    const validProducts = products.filter(
      (p) => p.name.trim() && p.price.trim() && p.quantity.trim()
    );

    if (validProducts.length === 0) {
      toast.error("Please add at least one valid product");
      return;
    }

    // Check for invalid prices or quantities
    for (const product of validProducts) {
      if (isNaN(Number(product.price)) || Number(product.price) <= 0) {
        toast.error("Please enter valid prices");
        return;
      }
      if (isNaN(Number(product.quantity)) || Number(product.quantity) < 0) {
        toast.error("Please enter valid quantities");
        return;
      }
    }

    setIsUploading(true);
    try {
      // Only call the parent function, don't show toast here
      // The parent will handle success/error toasts
      await onAddProducts(validProducts);

      // Reset form only on successful submission
      resetForm();
    } catch (error) {
      // Parent function will handle error toasts
      console.error("Failed to add products:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Bulk Add Products
          <Badge variant="secondary">{products.length} products</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {products.map((product, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Product {index + 1}</h4>
                {products.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeProduct(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${index}`}>Product Name</Label>
                  <Input
                    id={`name-${index}`}
                    value={product.name}
                    onChange={(e) =>
                      updateProduct(index, "name", e.target.value)
                    }
                    placeholder="Enter product name"
                    disabled={isUploading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`price-${index}`}>Price (Rs)</Label>
                  <Input
                    id={`price-${index}`}
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      updateProduct(index, "price", e.target.value)
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isUploading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                  <Input
                    id={`quantity-${index}`}
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      updateProduct(index, "quantity", e.target.value)
                    }
                    placeholder="0"
                    min="0"
                    disabled={isUploading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`image-${index}`}>Product Image</Label>
                  <Input
                    ref={(el) => {
                      fileInputRefs.current[index] =
                        el as HTMLInputElement | null;
                    }}
                    id={`image-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(
                        index,
                        e.target.files && e.target.files[0]
                          ? e.target.files[0]
                          : null
                      )
                    }
                    disabled={isUploading}
                  />
                  {product.image && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Selected: {product.image.name}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          updateProduct(index, "image", null);
                          if (fileInputRefs.current[index]) {
                            fileInputRefs.current[index]!.value = "";
                          }
                        }}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={addProduct}
              className="flex items-center space-x-2"
              disabled={isUploading}
            >
              <Plus className="h-4 w-4" />
              <span>Add Another Product</span>
            </Button>

            <Button
              type="submit"
              className="flex items-center space-x-2"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload Products</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
