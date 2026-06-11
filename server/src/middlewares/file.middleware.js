import multer from "multer";
import { CONFIG } from "../configs/app.config.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: CONFIG.upload.MAX_FILE_SIZE_BYTES,
  },
});

export default upload;
