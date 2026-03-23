import express from "express";
import {
    DEBUG,
    LLM_PROVIDER,
    OPENROUTER_MODEL,
    API_URL,
} from "./utils/constants.js";
import { startBot } from "./services/telegram.js";

const app = express();

const PORT = process.env.PORT ?? 8000;

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        llmProvider: LLM_PROVIDER,
        model: OPENROUTER_MODEL,
        debug: DEBUG,
    });
});

app.listen(PORT, () => {
    console.log(`
🌿 OpenMoss  running on ${API_URL}

  LLM      ${LLM_PROVIDER} / ${OPENROUTER_MODEL}
  Debug    ${DEBUG ? "ON — AI steps will be sent to your Telegram" : "OFF"}
`);

    // Start the Telegram bot with polling
    startBot();
});
