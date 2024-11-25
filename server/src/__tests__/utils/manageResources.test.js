import { jest } from "@jest/globals";
import fs from "fs";
import path from "path";
import {
    findOriginalResources,
    deleteOriginalResources,
    createOriginalResources,
} from "../../utils/manageResources.mjs";

jest.mock("fs", () => ({
    promises: {
        realpath: jest.fn(),
        readdir: jest.fn(),
    },
    existsSync: jest.fn(),
    rmSync: jest.fn(),
    mkdirSync: jest.fn(),
    copyFileSync: jest.fn(),
    unlinkSync: jest.fn(),
}));
jest.spyOn(process, "cwd").mockReturnValue("/app");

describe("manageResources", () => {
    const id = 123;
    const createdPath = path.join("document_resources", id.toString(), "original_resources");
    const folderPath = path.join("/app", createdPath);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("findOriginalResources", () => {
        it("should throw error for invalid path", async () => {
            fs.promises.realpath.mockResolvedValue("/invalid/path");
            await expect(findOriginalResources(id)).rejects.toThrow("Invalid path");
        });

        it("should return files if folder exists", async () => {
            const files = ["file1.txt", "file2.txt"];
            fs.promises.realpath.mockResolvedValue(folderPath);
            fs.promises.readdir.mockResolvedValue(files);

            const result = await findOriginalResources(id);
            expect(result).toEqual(files);
        });

        it("should return empty array if folder does not exist", async () => {
            fs.promises.realpath.mockRejectedValue({ code: "ENOENT" });

            const result = await findOriginalResources(id);
            expect(result).toEqual([]);
        });

        it("should throw error for other errors", async () => {
            const error = new Error("Some error");
            fs.promises.realpath.mockRejectedValue(error);

            await expect(findOriginalResources(id)).rejects.toThrow(error);
        });
    });

    describe("deleteOriginalResources", () => {
        it("should delete folder if it exists", async () => {
            fs.promises.realpath.mockResolvedValue(folderPath);
            fs.existsSync.mockReturnValue(true);

            await deleteOriginalResources(id);
            expect(fs.rmSync).toHaveBeenCalledWith(folderPath, { recursive: true });
        });

        it("should not delete folder if it does not exist", async () => {
            fs.promises.realpath.mockResolvedValue(folderPath);
            fs.existsSync.mockReturnValue(false);

            await deleteOriginalResources(id);
            expect(fs.rmSync).not.toHaveBeenCalled();
        });

        it("should throw error for invalid path", async () => {
            fs.promises.realpath.mockResolvedValue("/invalid/path");

            await expect(deleteOriginalResources(id)).rejects.toThrow("Invalid path");
        });
    });

    describe("createOriginalResources", () => {
        const files = [
            { originalname: "file1.txt", path: "/tmp/file1.txt" },
            { originalname: "file2.txt", path: "/tmp/file2.txt" },
        ];

        it("should create folder and move files", async () => {
            fs.promises.realpath.mockResolvedValue(folderPath);
            fs.existsSync.mockReturnValue(false);

            await createOriginalResources(id, files);
            expect(fs.mkdirSync).toHaveBeenCalledWith(folderPath, { recursive: true });
            files.forEach((file) => {
                const targetPath = path.join(folderPath, file.originalname);
                expect(fs.copyFileSync).toHaveBeenCalledWith(file.path, targetPath);
                expect(fs.unlinkSync).toHaveBeenCalledWith(file.path);
            });
        });

        it("should not create folder if it already exists", async () => {
            fs.promises.realpath.mockResolvedValue(folderPath);
            fs.existsSync.mockReturnValue(true);

            await createOriginalResources(id, files);
            expect(fs.mkdirSync).not.toHaveBeenCalled();
            files.forEach((file) => {
                const targetPath = path.join(folderPath, file.originalname);
                expect(fs.copyFileSync).toHaveBeenCalledWith(file.path, targetPath);
                expect(fs.unlinkSync).toHaveBeenCalledWith(file.path);
            });
        });

        it("should throw error for invalid path", async () => {
            fs.promises.realpath.mockResolvedValue("/invalid/path");

            await expect(createOriginalResources(id, files)).rejects.toThrow("Invalid path");
        });
    });
});
