import OpenAI from "openai";
import type { IMessage } from "../types";
import { CONFIG } from "../config";

const provider = process.env.LLM_PROVIDER;

// OpenRouter client
const openrouter = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: process.env.OPENROUTER_BASE_URL,
    defaultHeaders: {
        "HTTP-Referer": process.env.API_URL,
        "X-Title": "OpenMoss",
    },
});

// Ollama client
const ollama = new OpenAI({
    baseURL: `${process.env.OLLAMA_BASE_URL}/v1`,
    apiKey: "ollama",
});

export const callLLM = async (messages: IMessage[]): Promise<string> => {
    if (provider === "ollama") {
        const res = await ollama.chat.completions.create({
            model: process.env.OLLAMA_MODEL!,
            messages,
        });

        return res.choices[0]?.message.content || "";
    }

    // Default OpenRouter
    const res = await openrouter.chat.completions.create({
        model: CONFIG.llm.openrouter.model,
        messages,
    });

    console.log(`LLM RESPONSE: ${res.choices[0]?.message.content}`);

    return res.choices[0]?.message.content || "";
};
