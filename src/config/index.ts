interface IConfig {
    app: {
        apiUrl: string;
    };
    llm: {
        provider: string;
        openrouter: {
            model: string;
            apiKey: string;
            baseUrl: string;
        };
        ollama: {
            model: string;
            baseUrl: string;
        };
    };
}

export const DEBUG: boolean = true;

export const CONFIG: IConfig = {
    app: {
        apiUrl: process.env.API_URL!,
    },
    llm: {
        provider: "openrouter",

        openrouter: {
            model: "stepfun/step-3.5-flash:free",
            apiKey: process.env.OPENROUTER_API_KEY!,
            baseUrl: process.env.OPENROUTER_BASE_URL!,
        },

        ollama: {
            model: "mistral",
            baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
        },
    },
};
