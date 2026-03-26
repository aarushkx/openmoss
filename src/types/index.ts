export interface IMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface IAgentStep {
    step: "think" | "action" | "observe" | "ask_user" | "output";
    content?: string;
    tool?: string | undefined;
    input?: any;
}

export interface IAgentOutput {
    answer: string;
    steps: IAgentStep[];
    isUserInputRequired: boolean;
}

export interface IHistoryEntry {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
}
