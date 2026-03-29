import { serve } from "inngest/express";
import { inngest } from "./client";
import { agentWorkflow } from "./functions";

export const inngestHandler = serve({
    client: inngest,
    functions: [agentWorkflow],
});
