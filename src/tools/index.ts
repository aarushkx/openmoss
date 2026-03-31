import { getDateTime } from "./datetime.js";
import { rememberFact, searchMemory } from "./memory.js";
import { scheduleTask } from "./schedule.js";
import { getAvailableSkills } from "./skills.js";
import { getWeather } from "./weather.js";

// Record<key = tool_name (string), value = tool (function)>
// Each value must be a function that takes an input
// and returns either a Promise (async tool) or a normal value (sync tool)
export const TOOLS: Record<string, (input: any) => Promise<any> | any> = {
    getDateTime,
    getWeather,
    rememberFact,
    scheduleTask,
    getAvailableSkills,
    searchMemory,
};

// Call a tool by name with a given input object
export const callTool = async (name: string, input: any): Promise<string> => {
    const tool = TOOLS[name];
    if (!tool) {
        return `Error: Unknown tool "${name}". Available tools: ${Object.keys(TOOLS).join(", ")}`;
    }

    try {
        const result = await tool(input);
        return JSON.stringify(result);
    } catch (error: any) {
        return `Error calling ${name}: ${error.message}`;
    }
};
