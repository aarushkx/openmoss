import fs from "fs/promises";
import path from "path";

const BUCKET_DIR = path.join(process.cwd(), "src", "bucket");
const SUMMARY_FILE = path.join(BUCKET_DIR, "SUMMARY.md");

export const readSummary = async (): Promise<string> => {
    try {
        return await fs.readFile(SUMMARY_FILE, "utf-8");
    } catch {
        return "(no previous conversation summary)";
    }
};

export const writeSummary = async (summary: string): Promise<void> => {
    await fs.writeFile(SUMMARY_FILE, summary, "utf-8");
    console.log("\n---------- Summary updated ----------\n");
};
