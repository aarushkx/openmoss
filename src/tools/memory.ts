import { addToMemory } from "../utils/files";

interface Input {
    category: string;
    fact: string;
}

export const rememberFact = async (input: Input) => {
    const { category, fact } = input;
    await addToMemory(category, fact);
    return { success: true, message: "Fact added to MEMORY.md" };
};
