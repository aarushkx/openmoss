import express from "express";
import { DEBUG, CONFIG } from "./config";
import { startBot } from "./services/telegram.js";

const app = express();

const PORT = process.env.PORT ?? 8000;

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        llmProvider: CONFIG.llm.provider,
        model:
            CONFIG.llm.provider === "ollama"
                ? CONFIG.llm.ollama.model
                : CONFIG.llm.openrouter.model,
        debug: DEBUG,
    });
});

app.listen(PORT, () => {
    console.log(`
🌿 OpenMoss  running on ${CONFIG.llm.provider}

  LLM      ${CONFIG.llm.provider} / ${CONFIG.llm.provider === "ollama" ? CONFIG.llm.ollama.model : CONFIG.llm.openrouter.model}
  Debug    ${DEBUG ? "ON — AI steps will be sent to your Telegram" : "OFF"}
`);

    // Start the Telegram bot with polling
    startBot();
});
