import { Router } from "express";
import {
  getAllInventory,
  buyItem,
  createBulkInventory,
  updateInventory,
} from "../controllers/inventory.controller";
import { verifyAdmin } from "../middleware/auth.middleware";
import upload from "../middleware/multer";

const router = Router();
// Public routes
// GET /api/inventory - Get all available inventory
router.get("/", getAllInventory);

// POST /api/inventory/buy - Buy inventory item
router.post("/buy", buyItem);

// Protected admin routes
// POST /api/inventory/bulk - Create inventory items in bulk
router.post("/bulk", verifyAdmin, upload.array("images"), createBulkInventory);

// PUT /api/inventory/:id - Update inventory item
router.put("/:id", verifyAdmin, upload.single("image"), updateInventory);

export default router;
