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

// export async function deleteOriginalResources(id) {
//     const folderPath = path.join("document_resources", id.toString(), "original_resources");
//     try {
//         if (fs.existsSync(folderPath)) {
//             await fs.promises.rm(folderPath, { recursive: true, force: true });
//             console.log("Folder deleted successfully:", folderPath);
//         } else {
//             console.log("Folder does not exist:", folderPath);
//         }
//     } catch (error) {
//         console.error("Error deleting folder:", error);
//         throw error;
//     }
// }
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
