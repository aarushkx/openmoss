import path from "path";
import fs from "fs";
import { bot } from "../services/telegram.js";

export const handleMediaResponse = async (
    chatId: number,
    toolResultRaw: string,
): Promise<string | null> => {
    try {
        const result = JSON.parse(toolResultRaw);
        if (!result.success || !result.path) return null;

        const filePath = result.path;
        const ext = path.extname(filePath).toLowerCase();

        if ([".mp3", ".wav", ".m4a", ".ogg"].includes(ext)) {
            await bot.sendAudio(chatId, filePath, {
                caption: "Here is your audio! 🎵",
            });
        } else if (ext === ".gif") {
            await bot.sendAnimation(chatId, filePath, {
                caption: "Here is your GIF! 👾",
            });
        } else if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
            await bot.sendPhoto(chatId, filePath, {
                caption: "Here is your image! 🖼️",
            });
        } else if ([".mp4", ".mov", ".mkv", ".webm"].includes(ext)) {
            await bot.sendVideo(chatId, filePath, {
                caption: "Here is your video! 🎥",
            });
        } else {
            await bot.sendDocument(chatId, filePath, {
                caption: "Here is your file! 📄",
            });
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return JSON.stringify({ status: "Success", message: `Sent as ${ext}` });
    } catch (error: any) {
        console.log(`\nMedia Handler Error: ${error.message}\n`);
        return JSON.stringify({
            status: "Error",
            message: "Tool did not output a valid JSON",
        });
    }
};
