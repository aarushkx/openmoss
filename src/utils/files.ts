import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", ".openmoss");

export const readAgentPrompt = async (): Promise<string> => {
    return fs.readFile(path.join(DATA_DIR, "AGENT.md"), "utf-8");
};

export const readMemory = (): Promise<string> => {
    return fs.readFile(path.join(DATA_DIR, "MEMORY.md"), "utf-8");
};

export const readSkills = async (): Promise<string> => {
    return fs.readFile(path.join(DATA_DIR, "SKILLS.md"), "utf-8");
};

// Appends a new fact to MEMORY.md under the right category
export const addToMemory = async (
    category: string,
    fact: string,
): Promise<void> => {
    const current = await readMemory();

    // Look for the category header and add under it
    const header = `## ${category}`;

    let updated: string;

    if (current.includes(header)) {
        // Add fact under the existing category
        updated = current.replace(header, `${header}\n- ${fact}`);
    } else {
        // Add a new category at the end
        updated = current.trimEnd() + `\n\n## ${category}\n- ${fact}\n`;
    }

    // Remove placeholder "(empty)" lines if we just added something
    updated = updated.replace(/^- \(empty\)\n?/gm, "");

    await fs.writeFile(path.join(DATA_DIR, "MEMORY.md"), updated, "utf-8");
};
