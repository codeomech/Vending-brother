import { Request, Response } from "express";
import mongoose from "mongoose";
import Inventory, { IInventory } from "../models/inventory.model";
import cloudinary from "../utils/cloudinary";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_IMAGE_URL = "http://example.com/images/default.jpg";
// Get all available inventory items
export const getAllInventory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const inventory = await Inventory.find({ available_units: { $gt: 0 } });
    res.json(inventory);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Buy inventory item
export const buyItem = async (req: Request, res: Response): Promise<void> => {
  const { items } = req.body;
  console.log(items, "items");
  console.log(!Array.isArray(items));
  console.log(items.length);

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: "Please provide items to purchase" });
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("Inside try block");
    const purchaseResults: any[] = [];
    let totalCost = 0;

    for (const item of items) {
      const { id, quantity } = item;

      if (!id || !quantity || quantity <= 0) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: "Invalid purchase data" });
        return;
      }

      const inventoryItem = await Inventory.findById(id).session(session);

      if (!inventoryItem) {
        await session.abortTransaction();
        session.endSession();
        res.status(404).json({ message: `Item with ID ${id} not found` });
        return;
      }

      if (inventoryItem.available_units < quantity) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({
          message: `Not enough ${inventoryItem.name} available. Requested: ${quantity}, Available: ${inventoryItem.available_units}`,
        });
        return;
      }

      inventoryItem.available_units -= quantity;
      await inventoryItem.save({ session });

      const itemCost = inventoryItem.price * quantity;
      totalCost += itemCost;

      purchaseResults.push({
        id: inventoryItem._id,
        name: inventoryItem.name,
        quantity,
        price: inventoryItem.price,
        cost: itemCost,
      });
    }

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: "Purchase successful",
      items: purchaseResults,
      totalCost,
    });
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(err.message);
    res.status(500).json({ message: "Server error during purchase" });
  }
};

// Create inventory items in bulk (admin only)
export const createBulkInventory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("⏩ Incoming files:", req.files);
    console.log("⏩ Incoming body.items:", req.body.items);

    const files = req.files as Express.Multer.File[];
    const items = JSON.parse(req.body.items);

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "Please provide items to create" });
      return;
    }

    const uploadedItems = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const file = files[i];

      let imageUrl = DEFAULT_IMAGE_URL; // set default by default

      if (file) {
        try {
          const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  folder: "vending-machine",
                  public_id: uuidv4(),
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              )
              .end(file.buffer);
          });

          imageUrl = uploadResult.secure_url || DEFAULT_IMAGE_URL;
        } catch (err) {
          console.error(`❌ Upload error for file[${i}]:`, err);
          // fallback to default URL automatically
        }
      }

      const newItem = {
        ...item,
        display_image_url: imageUrl,
      };

      uploadedItems.push(newItem);
    }

    const savedItems = await Inventory.insertMany(uploadedItems);

    res.status(201).json(savedItems);
  } catch (err: any) {
    console.error("❌ Bulk Inventory Upload Error:", err.message, err);
    res
      .status(500)
      .json({ message: "Server error during bulk inventory upload" });
  }
};

// Update inventory item (admin only)
export const updateInventory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, price, available_units } = req.body;

  const updateFields: Partial<IInventory> = {};
  if (name !== undefined) updateFields.name = name;
  if (price !== undefined) updateFields.price = price;
  if (available_units !== undefined)
    updateFields.available_units = available_units;

  try {
    // Check if file is uploaded
    const file = (req.file as Express.Multer.File) || null;

    if (file) {
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "vending-machine",
              public_id: uuidv4(),
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(file.buffer);
      });

      updateFields.display_image_url = uploadResult.secure_url;
    }

    const updatedInventoryItem = await Inventory.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedInventoryItem) {
      res.status(404).json({ message: "Inventory item not found" });
      return;
    }

    res.json(updatedInventoryItem);
  } catch (err: any) {
    console.error("❌ Inventory Update Error:", err.message, err);
    res.status(500).json({ message: "Server error" });
  }
};
