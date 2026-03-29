import { serve } from "inngest/express";
import { inngest } from "./client";
import { agentWorkflow, summarizerWorkflow } from "./functions";

export const inngestHandler = serve({
    client: inngest,
    functions: [agentWorkflow, summarizerWorkflow],
});
