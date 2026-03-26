import OpenAI from "openai";
import { OPENROUTER_MODEL } from "../utils/constants.js";
import type { IMessage } from "../types";

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: process.env.OPENROUTER_BASE_URL,
    defaultHeaders: {
        "HTTP-Referer": process.env.API_URL,
        "X-Title": "OpenMoss",
    },
});

export const callLLM = async (messages: IMessage[]): Promise<string> => {
    const completion = await client.chat.completions.create({
        model: OPENROUTER_MODEL,
        messages,
    });
    return completion.choices[0]?.message.content as string;
};
