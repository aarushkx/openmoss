import express from "express";

const app = express();

const PORT = process.env.PORT ?? 8000;
const DEBUG = process.env.DEBUG === "true";
const LLM_PROVIDER = process.env.LLM_PROVIDER!;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL!;
const API_URL = `http://localhost:${PORT}`;

app.use(express.json());

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
});
