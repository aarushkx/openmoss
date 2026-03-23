const DEBUG = process.env.DEBUG === "true";
const LLM_PROVIDER = process.env.LLM_PROVIDER!;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL!;
const API_URL = process.env.API_URL!;

export { DEBUG, LLM_PROVIDER, OPENROUTER_MODEL, API_URL };
