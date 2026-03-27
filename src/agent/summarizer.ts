import { callLLM } from "./llm";
import type { IMessage } from "../types";
import { getSummarizerAgentSystemPrompt } from "../utils/prompts";

export const summarizeConversation = async (
    messages: IMessage[],
): Promise<string> => {
    const SYSTEM_PROMPT = getSummarizerAgentSystemPrompt();
    const prompt: IMessage[] = [
        {
            role: "system",
            content: SYSTEM_PROMPT,
        },
        {
            role: "user",
            content: JSON.stringify(messages),
        },
    ];

    const res = await callLLM(prompt);
    return res.trim();
};
