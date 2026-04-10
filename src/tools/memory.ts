import { addToMemory, readMemory } from "../utils/files";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/ollama";

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

export const readFullMemory = async () => {
    const memory = await readMemory();
    if (!memory || memory.trim().length === 0) {
        return "The long-term memory is currently empty";
    }
    return memory;
};

export const searchMemory = async ({ query }: SearchMemoryInput) => {
    const memoryText = await readMemory();

    if (!memoryText || memoryText.trim().length === 0) {
        return "No memories stored";
    }

    const docs = [
        new Document({
            pageContent: memoryText,
        }),
    ];

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 400,
        chunkOverlap: 50,
    });

    const splitDocs = await splitter.splitDocuments(docs);

    const embeddings = new OllamaEmbeddings({
        model: "nomic-embed-text",
    });

    const vectorStore = await MemoryVectorStore.fromDocuments(
        splitDocs,
        embeddings,
    );

    const retriever = vectorStore.asRetriever({ k: 5 });

    const results = await retriever.invoke(query);

    if (!results.length) {
        return "No matching memories found";
    }

    return results.map((doc) => doc.pageContent).join("\n\n");
};
