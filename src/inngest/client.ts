import { Inngest } from "inngest";

export const inngest = new Inngest({
    id: "openmoss",
    eventKey: process.env.INNGEST_EVENT_KEY ?? "local",
});
