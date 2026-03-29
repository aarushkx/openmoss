import TelegramBot from "node-telegram-bot-api";
import { inngest } from "../inngest/client";

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
    polling: true,
});

export const startBot = async (): Promise<void> => {
    console.log("Bot started - polling for messages...");

    bot.on("message", async (msg) => {
        if (!msg.text) return; // TODO: handle non-text data later

        const chatId = msg.chat.id;
        const text = msg.text;
        const userId = msg.from?.id;

        console.log(`chatId=${chatId} | userId=${userId} | text="${text}"`);

        // Fire Inngest event to run the agent
        await inngest.send({
            name: "telegram/message.received",
            data: { chatId, text, messageId: msg.message_id, userId },
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
