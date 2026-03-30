import fs from "fs/promises";
import path from "path";
import type { IHistoryEntry } from "../types";

const HISTORY_FILE = path.join(process.cwd(), "src", "bucket", "HISTORY.json");

export const readHistory = async (): Promise<IHistoryEntry[]> => {
    try {
        const raw = await fs.readFile(HISTORY_FILE, "utf-8");
        return JSON.parse(raw);
    } catch {
        return [];
    }
};

export const appendHistory = async (
    role: "user" | "assistant",
    content: string,
) => {
    const history = await readHistory();
    history.push({ role, content, timestamp: new Date().toISOString() });
    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2), "utf-8");
};

export const clearHistory = async (): Promise<void> => {
    await fs.writeFile(HISTORY_FILE, JSON.stringify([]), "utf-8");
};
