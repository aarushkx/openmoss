import { addToMemory, readMemory } from "../utils/files";

interface RememberFactInput {
    category: string;
    fact: string;
}

interface SearchMemoryInput {
    query: string;
}

export const rememberFact = async (input: RememberFactInput) => {
    const { category, fact } = input;
    await addToMemory(category, fact);
    return { success: true, message: "Fact added to MEMORY.md" };
};

export const searchMemory = async ({ query }: SearchMemoryInput) => {
    const memory = await readMemory();
    // TODO: integrate vector search
    const relevantFacts = memory
        .split("\n")
        .filter(
            (line) =>
                line.toLowerCase().includes(query.toLowerCase()) ||
                line.startsWith("##"),
        );
    return relevantFacts.join("\n") || "No matching memories found.";
};
