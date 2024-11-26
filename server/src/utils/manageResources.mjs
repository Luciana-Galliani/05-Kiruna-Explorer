import fs from "fs";
import path from "path";

export async function findOriginalResources(id) {
    try {
        const createdPath = path.join("document_resources", id.toString(), "original_resources");
        const folderPath = await fs.promises.realpath(createdPath);
        if (!folderPath.startsWith(path.join(process.cwd(), "document_resources"))) {
            throw new Error("Invalid path");
        }
        const files = await fs.promises.readdir(folderPath);
        return files;
    } catch (err) {
        if (err.code === "ENOENT") {
            // Folder does not exist
            return [];
        } else {
            throw err;
        }
    }
}

export async function deleteOriginalResources(id) {
    const createdPath = path.join("document_resources", id.toString(), "original_resources");
    try {
        const folderPath = await fs.promises.realpath(createdPath);
        if (!folderPath.startsWith(path.join(process.cwd(), "document_resources"))) {
            throw new Error("Invalid path");
        }

        fs.rmSync(folderPath, { recursive: true });
    } catch (err) {
        if (err.code === "ENOENT") {
            // Folder does not exist
            return;
        } else {
            throw err;
        }
    }
}

export async function createOriginalResources(id, files) {
    const baseDir = path.join(process.cwd(), "document_resources");

    const createdPath = path.join(baseDir, id.toString(), "original_resources");

    const baseRealPath = await fs.promises.realpath(baseDir);

    const targetRealPath = path.resolve(createdPath);
    if (!targetRealPath.startsWith(baseRealPath)) {
        throw new Error("Invalid path");
    }

    if (!fs.existsSync(targetRealPath)) {
        fs.mkdirSync(targetRealPath, { recursive: true });
    }

    files.forEach((file) => {
        const targetPath = path.join(targetRealPath, file.originalname);
        fs.copyFileSync(file.path, targetPath);
        fs.unlinkSync(file.path);
    });
}
