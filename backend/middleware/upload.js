import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Ensure uploads folder exists
const uploadPath = path.join("uploads/avatars");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// ✅ File filter for images only
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
