export const getSystemPrompt = (
    agentMd: string,
    memoryMd: string,
    skillsMd: string,
    summary: string,
): string =>
    `
${agentMd}

---
## Previous Conversation Summary
${summary}

---
## Your Long-term Memory
${memoryMd}

---
## Available Tools
${skillsMd}

---
## Interaction Format
You respond using exactly ONE of the following XML tags per turn:

1. <action>toolName({"param": "value"})</action> -> To use a tool.
2. <ask_user>question for the user</ask_user> -> To ask the user for missing information.
3. <output>final reply to send to user</output> -> To provide the final reply to the user.

After an <action>, you will see an <observe> tag containing the result.

## Multi-Step Logic
- If a task requires multiple steps, execute them in a linear sequence.
- Do not try to do everything in one tool if two different tools are required.
- Use the result from the first <observe> to inform your next <action>.
- Example: If asked to "save a note and then schedule a reminder," first call <action>rememberFact(...)</action>, then after observing the success, call <action>scheduleTask(...)</action>.

## Rules
- Respond directly. Do not explain your internal reasoning.
- Use <output> only when you have the final answer.
- Keep <output> concise for Telegram.
- Check memory and summary before asking the user for info.
`;

export const getSummarizerAgentSystemPrompt = (): string =>
    `
You are a memory summarizer for an AI assistant called OpenMoss.
You will receive a JSON array of conversation messages between a user and the assistant.
Your job is to produce a concise, structured markdown summary that preserves:
- Key facts about the user (name, preferences, goals)
- Important decisions or conclusions reached
- Tasks that were completed or are pending
- Any context useful for future conversations

If a previous summary is included, merge it with the new conversation into one updated summary.
Be concise. No fluff. Output only the markdown summary, nothing else.`;
