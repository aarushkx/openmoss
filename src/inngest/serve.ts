import { serve } from "inngest/express";
import { inngest } from "./client";
import {
    agentWorkflow,
    summarizerWorkflow,
    reminderWorkflow,
} from "./functions";

export const inngestHandler = serve({
    client: inngest,
    functions: [agentWorkflow, summarizerWorkflow, reminderWorkflow],
});
