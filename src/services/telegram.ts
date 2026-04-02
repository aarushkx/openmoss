import TelegramBot from "node-telegram-bot-api";
import { inngest } from "../inngest/client";

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
    polling: true,
});

export const startBot = async (): Promise<void> => {
    console.log("Bot started - polling for messages...");

    bot.on("message", async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from?.id;

        const text = msg.text;
        const caption = msg.caption;
        const photo = msg.photo ? msg.photo[msg.photo.length - 1] : null;
        const video = msg.video || null;
        const document = msg.document || null;

        const media = photo || video || document;

        await inngest.send({
            name: "telegram/message.received",
            data: {
                chatId,
                text: text || caption || "",
                messageId: msg.message_id,
                userId,
                media: media
                    ? {
                          fileId: media.file_id,
                          type: photo ? "photo" : video ? "video" : "document",
                          fileName: msg.document?.file_name || "media",
                      }
                    : null,
            },
        });
    });

    bot.on("polling_error", (err) => {
        console.log("Telegram polling error", err.message);
    });
};

export const sendMessage = async (
    chatId: number,
    text: string,
): Promise<void> => {
    await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
};
