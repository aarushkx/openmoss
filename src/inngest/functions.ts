import { inngest } from "./client";
import { runAgent } from "../agent/agent";
import { sendMessage } from "../services/telegram";

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
            console.log(`\nSending reply to chatId=${chatId}..."\n`);
            await sendMessage(chatId, result.answer);
        });

        console.log(
            `\nWorkflow done - ${result.steps.length} steps, isUserInputRequired=${result.isUserInputRequired}\n`,
        );
        return { success: true, stepsCount: result.steps.length };
    },
);
