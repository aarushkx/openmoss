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
        const { chatId, text, media } = event.data;

        console.log(`\nInngest workflow started...\n`);

        const result = await step.run("run-agent", async () => {
            return await runAgent(text, chatId, media);
        });

        await step.run("send-telegram-reply", async () => {
            console.log(`\nSending reply...\n`);
            await sendMessage(chatId, result.answer);
        });

        await step.sendEvent("check-history-maintenance", {
            name: "history/maintenance.check",
            data: { chatId },
        });

        console.log(`\nWorkflow done - ${result.steps.length} steps\n`);
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

            const MAX_HISTORY = 10;
            if (history.length >= MAX_HISTORY) {
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

export const reminderWorkflow: any = inngest.createFunction(
    {
        id: "reminder-workflow",
        name: "Scheduler: Schedule Task Reminder",
        triggers: { event: "scheduler/reminder.scheduled" },
    },
    async ({ event, step }) => {
        const { chatId, task, remindAt, label } = event.data;
        await step.sleep("wait-until-reminder-time", remindAt);
        await step.run("send-reminder", async () => {
            await sendMessage(chatId, `⏰ *REMINDER — ${label}*\n\n${task}`);
        });
        return { success: true, label };
    },
);
