import mongoose, { Document, Schema } from "mongoose";

// 1. Define an interface for Inventory fields
export interface IInventory extends Document {
  name: string;
  price: number;
  available_units: number;
  display_image_url: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Create schema with type safety
const InventorySchema: Schema<IInventory> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    available_units: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    display_image_url: {
      type: String,
      default: "http://example.com/images/default.jpg",
    },
  },
  {
    timestamps: true,
  }
);

// 3. Export model
const Inventory = mongoose.model<IInventory>("Inventory", InventorySchema);
export default Inventory;
