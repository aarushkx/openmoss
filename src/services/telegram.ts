import TelegramBot from "node-telegram-bot-api";
import { runAgent } from "../agent/agent";
import { DEBUG } from "../config";

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
        // sendMessage(chatId, "Recieved your message");

        try {
            const result = await runAgent(text);
            await sendMessage(chatId, result.answer);

            if (DEBUG) {
                console.log("Agent steps:", result.steps);
            }
        } catch (error: any) {
            console.error("Agent error:", error?.message || "Unknown error");
            console.error(
                "Error metadata:",
                error?.error?.metadata?.raw || "No metadata available",
            );
            await sendMessage(chatId, "Something went wrong.");
        }
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
