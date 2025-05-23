/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/interface";

interface ProductTableProps {
  products: Product[];
  onUpdateProduct: (
    id: string,
    updates: Partial<Product>,
    imageFile?: File | null
  ) => void;
  onRefetchData?: () => void; // Add this prop for refetching data
}

export const ProductTable = ({
  products,
  onUpdateProduct,
  onRefetchData,
}: ProductTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDataMap, setEditDataMap] = useState<
    Record<
      string,
      Partial<Product> & { imageFile?: File | null; removeImage?: boolean }
    >
  >({});

  // Helper function to get the product ID regardless of the field name
  const getProductId = (product: Product) => {
    return product._id || product.id;
  };

  const handleEdit = (product: Product) => {
    const productId = getProductId(product);
    if (!productId) {
      toast.error("Product ID not found");
      return;
    }
    setEditingId(productId as string);
    // Store the edit data specifically for this product ID
    setEditDataMap((prev) => ({
      ...prev,
      [productId as string]: {
        name: product.name,
        price: product.price,
        available_units: product.available_units,
        display_image_url: product.display_image_url,
        imageFile: null,
        removeImage: false,
      },
    }));
  };

  const handleSave = async (id: string) => {
    const editData = editDataMap[id];

    if (
      !editData ||
      !editData.name ||
      editData.price === undefined ||
      editData.available_units === undefined
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // Prepare the update data (exclude imageFile and removeImage from the main update)
      console.log(editData);
      const updateData = {
        name: editData.name,
        price: editData.price,
        available_units: editData.available_units,
        ...(editData.removeImage && {
          display_image_url: "",
        }),
      };

      // Call the update function with image file if provided
      await onUpdateProduct(id, updateData, editData.imageFile);

      setEditingId(null);
      // Remove the edit data for this specific product
      setEditDataMap((prev) => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });

      // Refetch data to show updated values
      if (onRefetchData) {
        onRefetchData();
      }
    } catch (error) {
      toast.error("Failed to update product");
      console.error("Update error:", error);
    }
  };

  const handleCancel = () => {
    if (editingId) {
      // Remove the edit data for the currently editing product
      setEditDataMap((prev) => {
        const newMap = { ...prev };
        delete newMap[editingId];
        return newMap;
      });
    }
    setEditingId(null);
  };

  // Helper function to update edit data for a specific product
  const updateEditData = (
    productId: string,
    field: keyof Product | "imageFile" | "removeImage",
    value: any
  ) => {
    setEditDataMap((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  // Helper function to get edit data for a specific product
  const getEditData = (productId: string) => {
    return editDataMap[productId] || {};
  };

  // Handle image file selection
  const handleImageChange = (productId: string, file: File | null) => {
    updateEditData(productId, "imageFile", file);
    updateEditData(productId, "removeImage", false);

    // Create preview URL for the selected file
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      updateEditData(productId, "display_image_url", previewUrl);
    }
  };

  // Handle image removal
  const handleRemoveImage = (productId: string) => {
    updateEditData(productId, "imageFile", null);
    updateEditData(productId, "removeImage", true);
    updateEditData(productId, "display_image_url", null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const productId = getProductId(product);
              if (!productId) {
                toast.error("Product ID not found");
                return null;
              }
              const currentEditData = getEditData(productId);
              const isEditing = editingId === productId;

              return (
                <TableRow key={productId}>
                  <TableCell className="w-24">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="relative">
                          {currentEditData.display_image_url &&
                          !currentEditData.removeImage ? (
                            <div className="relative">
                              <img
                                src={currentEditData.display_image_url}
                                alt={currentEditData.name || "Product"}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                                onClick={() => handleRemoveImage(productId)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                              No Image
                            </div>
                          )}
                        </div>
                        <div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              handleImageChange(productId, file);
                            }}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        {product.display_image_url ? (
                          <img
                            src={product.display_image_url}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : null}
                        <div
                          className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500"
                          style={{
                            display: product.display_image_url
                              ? "none"
                              : "flex",
                          }}
                        >
                          No Image
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={currentEditData.name || ""}
                        onChange={(e) =>
                          updateEditData(productId, "name", e.target.value)
                        }
                        className="w-full"
                      />
                    ) : (
                      product.name
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentEditData.price || 0}
                        onChange={(e) =>
                          updateEditData(
                            productId,
                            "price",
                            Number(e.target.value)
                          )
                        }
                        className="w-20"
                        min="0"
                        step="0.01"
                      />
                    ) : (
                      `${product.price.toFixed(2)} Rs`
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentEditData.available_units || 0}
                        onChange={(e) =>
                          updateEditData(
                            productId,
                            "available_units",
                            Number(e.target.value)
                          )
                        }
                        className="w-20"
                        min="0"
                      />
                    ) : (
                      product.available_units
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.available_units > 0 ? "default" : "destructive"
                      }
                    >
                      {product.available_units > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSave(productId)}
                            className="h-8 w-8 p-0"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
