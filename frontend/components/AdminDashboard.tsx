"use client";

import { useState, useEffect } from "react";

import { ProductTable } from "./ProductTable";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
import {
  getInventory,
  updateInventoryItem,
  createBulkInventory,
} from "@/service/api";
import { toast } from "sonner";
import { BulkProduct, Product } from "@/interface";
import { BulkAddProducts } from "./BulkAddProduct";
import { AdminNavbar } from "./AdminHeader";

export const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products from API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await getInventory(); // Transform API response to match our Product interface
      const transformedProducts: Product[] =
        response?.map((item: Product) => ({
          id: item._id || item.id,
          name: item.name,
          price: item.price,
          available_units: item.available_units,
          display_image_url:
            item.display_image_url ||
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
        })) || [];

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await updateInventoryItem(id, updates);

      setProducts(
        products.map((product) =>
          product._id === id
            ? { ...product, ...updates, updatedAt: new Date().toISOString() }
            : product
        )
      );

      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  const handleAddProducts = async (newProducts: BulkProduct[]) => {
    try {
      // Transform BulkProduct to API format
      const itemsToAdd = newProducts.map((product) => ({
        name: product.name,
        price: Number(product.price),
        available_units: Number(product.quantity),
        image: product.image,
      }));

      const response = await createBulkInventory(itemsToAdd);

      if (response) {
        // Reload products to get the updated list from server
        await loadProducts();
        toast.success(`Successfully added ${newProducts.length} products`);
      } else {
        throw new Error(response.message || "Failed to add products");
      }
    } catch (error) {
      console.error("Error adding products:", error);
      toast.error("Failed to add products");
      throw error; // Re-throw the error so the component knows it failed
    }
  };

  // Calculate stats
  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.available_units,
    0
  );
  const outOfStock = products.filter(
    (product) => product.available_units === 0
  ).length;
  const lowStock = products.filter(
    (product) => product.available_units > 0 && product.available_units <= 5
  ).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalValue.toFixed(2)} Rs
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Out of Stock
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {outOfStock}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {lowStock}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Management */}
        <ProductTable
          products={products}
          onUpdateProduct={handleUpdateProduct}
          onRefetchData={loadProducts}
        />

        {/* Bulk Add Products */}
        <BulkAddProducts onAddProducts={handleAddProducts} />
      </div>
    </div>
  );
};
