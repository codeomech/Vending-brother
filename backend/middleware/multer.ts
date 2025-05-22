// middleware/multer.ts
import multer from "multer";

// store in memory for uploading to cloudinary later
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // max 5MB per file
  },
});

export default upload;
