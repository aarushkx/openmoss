import { inngest } from "./client";
import { runAgent } from "../agent/agent";
import { sendMessage } from "../services/telegram";
import { clearHistory, readHistory } from "../utils/history";
import { readSummary, writeSummary } from "../utils/summary";
import { summarizeConversation } from "../agent/summarizer";

export const agentWorkflow: any = inngest.createFunction(
    {
        id: "agent-workflow",
        name: "Agent: Process Telegram Message",
        retries: 3,
        triggers: { event: "telegram/message.received" },
    },
    async ({ event, step }) => {
        const { chatId, text } = event.data;

        console.log(`\nInngest workflow started...\n`);

        // Run the agent
        const result = await step.run("run-agent", async () => {
            return runAgent(text);
        });

        // Send the reply to Telegram
        await step.run("send-telegram-reply", async () => {
            console.log(`\nSending reply to chatId=${chatId}...\n`);
            await sendMessage(chatId, result.answer);
        });

        // Trigger Maintenance (Summarizer)
        await step.sendEvent("check-history-maintenance", {
            name: "history/maintenance.check",
            data: { chatId },
        });

        console.log(
            `\nWorkflow done - ${result.steps.length} steps, isUserInputRequired=${result.isUserInputRequired}\n`,
        );
        return { success: true, stepsCount: result.steps.length };
    },
);

export const summarizerWorkflow: any = inngest.createFunction(
    {
        id: "summarizer-workflow",
        name: "Maintenance: Summarize History",
        triggers: { event: "history/maintenance.check" },
    },
    async ({ step }) => {
        await step.run("summarize-if-needed", async () => {
            const history = await readHistory();
            if (history.length >= 10) {
                // Your MAX_HISTORY
                const existingSummary = await readSummary();
                const messages = [
                    {
                        role: "assistant" as const,
                        content: `Previous summary: ${existingSummary}`,
                    },
                    ...history,
                ];
                const newSummary = await summarizeConversation(messages);
                await writeSummary(newSummary);
                await clearHistory();
                return "Summarized";
            }
            return "No summary needed";
        });
    },
);
