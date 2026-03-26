import { callLLM } from "./llm.js";
import { callTool } from "../tools/index.js";
import { readAgentPrompt, readMemory, readSkills } from "../utils/files.js";
import { getSystemPrompt } from "../utils/prompts.js";
import {
    readHistory,
    appendHistory,
    historyToMessages,
} from "../utils/history.js";
import type { IAgentOutput, IAgentStep, IMessage } from "../types/index.js";

const MAX_STEPS = 8;

const parseAgentStep = (raw: string): IAgentStep => {
    const res = raw.trim();

    const think = res.match(/<think>([\s\S]*?)<\/think>/);
    if (think) return { step: "think", content: think[1]?.trim() ?? "" };

    const action = res.match(/<action>([\s\S]*?)<\/action>/);
    if (action) {
        const body = action[1]?.trim();
        const match = body?.match(/^(\w+)\(([\s\S]*)\)$/);
        if (match) {
            const tool = match[1];
            let input: any = {};
            try {
                input = JSON.parse(match[2]?.trim() ?? "{}");
            } catch {
                input = {};
            }
            return { step: "action", tool, input };
        }
        return { step: "think", content: `Malformed action: ${body}` };
    }

    const ask = res.match(/<ask_user>([\s\S]*?)<\/ask_user>/);
    if (ask) return { step: "ask_user", content: ask[1]?.trim() ?? "" };

    const output = res.match(/<output>([\s\S]*?)<\/output>/);
    if (output) return { step: "output", content: output[1]?.trim() ?? "" };

    return { step: "think", content: res };
};

export const runAgent = async (userMessage: string): Promise<IAgentOutput> => {
    console.log(userMessage);

    const [agentMd, memoryMd, skillsMd, history] = await Promise.all([
        readAgentPrompt(),
        readMemory(),
        readSkills(),
        readHistory(),
    ]);

    const SYSTEM_PROMPT = getSystemPrompt(agentMd, memoryMd, skillsMd);

    const messages: IMessage[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...historyToMessages(history),
        { role: "user", content: `<start>${userMessage}</start>` },
    ];

    // Save the user message to history
    await appendHistory("user", userMessage);

    const steps: IAgentStep[] = [];

    for (let i = 0; i < MAX_STEPS; i++) {
        const rawResponse = await callLLM(messages);
        const parsed = parseAgentStep(rawResponse);

        steps.push(parsed);
        messages.push({ role: "assistant", content: rawResponse });

        switch (parsed.step) {
            case "think": {
                console.log(`\n<think>\n${parsed.content}\n</think>\n`);
                messages.push({ role: "user", content: "Continue." });
                break;
            }

            case "action": {
                console.log(
                    `\n<action>\n${parsed.tool}(${JSON.stringify(parsed.input)})\n</action>\n`,
                );

                const toolResult = await callTool(
                    parsed.tool!,
                    parsed.input ?? {},
                );

                console.log(`\n<observe>\n${toolResult}\n</observe>\n`);

                steps.push({ step: "observe", content: toolResult });

                messages.push({
                    role: "user",
                    content: `<observe>${toolResult}</observe>`,
                });

                break;
            }

            case "ask_user": {
                console.log(`\n<ask_user>\n${parsed.content}\n</ask_user>\n`);

                await appendHistory("assistant", parsed.content ?? "");

                return {
                    answer: parsed.content ?? "I need more info.",
                    steps,
                    isUserInputRequired: true,
                };
            }

            case "output": {
                console.log(`\n<output>\n${parsed.content}\n</output>\n`);

                await appendHistory("assistant", parsed.content ?? "");

                return {
                    answer: parsed.content ?? "Done.",
                    steps,
                    isUserInputRequired: false,
                };
            }

            default: {
                console.log(`Unknown step:\n${parsed.step}`);
                break;
            }
        }
    }

    return {
        answer: "I hit my thinking limit. Please try a simpler request.",
        steps,
        isUserInputRequired: false,
    };
};
