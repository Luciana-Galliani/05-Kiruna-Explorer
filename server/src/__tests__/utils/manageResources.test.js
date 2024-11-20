import fs from "fs";
import path from "path";
import {
    findOriginalResources,
    deleteOriginalResources,
    createOriginalResources,
} from "../../utils/manageResources.mjs";

jest.mock("fs", () => ({
    promises: {
        readdir: jest.fn(),
    },
    existsSync: jest.fn(),
    rmSync: jest.fn(),
    mkdirSync: jest.fn(),
    copyFileSync: jest.fn(),
    unlinkSync: jest.fn(),
}));

describe("findOriginalResources", () => {
    it("should return a list of files if the folder exists", async () => {
        const mockFiles = ["file1.txt", "file2.txt"];
        fs.promises.readdir.mockResolvedValue(mockFiles);

        const result = await findOriginalResources(123);
        expect(result).toEqual(mockFiles);
        expect(fs.promises.readdir).toHaveBeenCalledWith(
            path.join("document_resources", "123", "original_resources")
        );
    });

    it("should return an empty array if the folder does not exist (ENOENT)", async () => {
        const error = new Error("Folder not found");
        error.code = "ENOENT";
        fs.promises.readdir.mockRejectedValue(error);

        const result = await findOriginalResources(123);
        expect(result).toEqual([]);
    });

    it("should throw an error for other exceptions", async () => {
        const error = new Error("Unexpected error");
        fs.promises.readdir.mockRejectedValue(error);

        await expect(findOriginalResources(123)).rejects.toThrow("Unexpected error");
    });
});

describe("deleteOriginalResources", () => {
    it("should delete the folder if it exists", () => {
        fs.existsSync.mockReturnValue(true);

        deleteOriginalResources(123);
        expect(fs.existsSync).toHaveBeenCalledWith(
            path.join("document_resources", "123", "original_resources")
        );
        expect(fs.rmSync).toHaveBeenCalledWith(
            path.join("document_resources", "123", "original_resources"),
            { recursive: true }
        );
    });

    it("should do nothing if the folder does not exist", () => {
        fs.existsSync.mockReturnValue(false);

        deleteOriginalResources(123);
        expect(fs.existsSync).toHaveBeenCalledWith(
            path.join("document_resources", "123", "original_resources")
        );
        expect(fs.rmSync).not.toHaveBeenCalled();
    });
});

describe("createOriginalResources", () => {
    it("should create the folder if it does not exist and move files", () => {
        fs.existsSync.mockReturnValue(false);
        const mockFiles = [
            { originalname: "file1.txt", path: "/tmp/file1.txt" },
            { originalname: "file2.txt", path: "/tmp/file2.txt" },
        ];

        createOriginalResources(123, mockFiles);

        const expectedDir = path.join(process.cwd(), "document_resources/123/original_resources");
        expect(fs.existsSync).toHaveBeenCalledWith(expectedDir);
        expect(fs.mkdirSync).toHaveBeenCalledWith(expectedDir, { recursive: true });

        mockFiles.forEach((file) => {
            const targetPath = path.join(expectedDir, file.originalname);
            expect(fs.copyFileSync).toHaveBeenCalledWith(file.path, targetPath);
            expect(fs.unlinkSync).toHaveBeenCalledWith(file.path);
        });
    });

    it("should not create the folder if it already exists but should move files", () => {
        fs.existsSync.mockReturnValue(true);
        const mockFiles = [
            { originalname: "file1.txt", path: "/tmp/file1.txt" },
            { originalname: "file2.txt", path: "/tmp/file2.txt" },
        ];

        createOriginalResources(123, mockFiles);

        const expectedDir = path.join(process.cwd(), "document_resources/123/original_resources");
        expect(fs.existsSync).toHaveBeenCalledWith(expectedDir);
        expect(fs.mkdirSync).not.toHaveBeenCalled();

        mockFiles.forEach((file) => {
            const targetPath = path.join(expectedDir, file.originalname);
            expect(fs.copyFileSync).toHaveBeenCalledWith(file.path, targetPath);
            expect(fs.unlinkSync).toHaveBeenCalledWith(file.path);
        });
    });
});
