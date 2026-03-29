import fs from "fs/promises";
import path from "path";
import type { IHistoryEntry, IMessage } from "../types";
import { readSummary, writeSummary } from "./summary";
import { summarizeConversation } from "../agent/summarizer";

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

// export const appendHistory = async (
//     role: "user" | "assistant",
//     content: string,
// ): Promise<void> => {
//     const history = await readHistory();
//     history.push({ role, content, timestamp: new Date().toISOString() });

//     if (history.length >= MAX_HISTORY) {
//         console.log("\nHistory full - running conversation summarizer...");

//         // Pass existing summary along with the new history to summarizer
//         const existingSummary = await readSummary();
//         const messages = [
//             {
//                 role: "assistant" as const,
//                 content: `Previous conversation summary:\n${existingSummary}`,
//             },
//             ...history.map(({ role, content }) => ({ role, content })),
//         ];

//         const newSumary = await summarizeConversation(messages);
//         await writeSummary(newSumary);
//         await clearHistory();
//         return;
//     }

//     await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2), "utf-8");
// };

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
