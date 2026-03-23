import TelegramBot from "node-telegram-bot-api";

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
    polling: true,
});

export const startBot = (): void => {
    console.log("Bot started - polling for messages...");

    bot.on("message", (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, "Received your message");
    });
};
