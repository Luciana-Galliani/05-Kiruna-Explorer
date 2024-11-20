import fs from "fs";
import path from "path";

export async function findOriginalResources(id) {
    const folderPath = path.join("document_resources", id.toString(), "original_resources");

    try {
        const files = await fs.promises.readdir(folderPath);
        return files;
    } catch (err) {
        if (err.code === "ENOENT") {
            // Folder does not exist
            return [];
        } else {
            // Other errors
            throw err;
        }
    }
}

export function deleteOriginalResources(id) {
    const folderPath = path.join("document_resources", id.toString(), "original_resources");

    if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true });
    }
}

export function createOriginalResources(id, files) {
    // Create directory for document resources
    const documentDir = path.join(process.cwd(), `document_resources/${id}/original_resources`);
    if (!fs.existsSync(documentDir)) {
        fs.mkdirSync(documentDir, { recursive: true });
    }

    // Move uploaded files to document directory
    files.forEach((file) => {
        const targetPath = path.join(documentDir, file.originalname);
        fs.copyFileSync(file.path, targetPath);
        fs.unlinkSync(file.path);
    });
}
