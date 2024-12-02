import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const baseDir = path.join(process.cwd(), "document_resources/temp");
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir, { recursive: true });
        }
        cb(null, baseDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 8000000, // Compliant: 8MB
    },
});
