import fs from "fs/promises";
import path from "path";
import type { IHistoryEntry, IMessage } from "../types";

const HISTORY_FILE = path.join(process.cwd(), "src", "bucket", "HISTORY.json");
const MAX_HISTORY = 10;

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
): Promise<void> => {
    const history = await readHistory();
    history.push({ role, content, timestamp: new Date().toISOString() });

    // Keep only the last MAX_HISTORY entries
    const trimmed = history.slice(-MAX_HISTORY);
    await fs.writeFile(HISTORY_FILE, JSON.stringify(trimmed, null, 2), "utf-8");
};

export const clearHistory = async (): Promise<void> => {
    await fs.writeFile(HISTORY_FILE, JSON.stringify([]), "utf-8");
};

// Convert history entries to LLM message format
export const historyToMessages = (history: IHistoryEntry[]): IMessage[] => {
    return history.map(({ role, content }) => ({ role, content }));
};
