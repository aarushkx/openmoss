import ffmpeg from "fluent-ffmpeg";
import { bot } from "../services/telegram.js";
import fs from "fs";
import path from "path";

interface MediaInput {
    fileId: string;
    commandString: string;
    outputExt?: string;
}

const shellSplit = (cmd: string): string[] => {
    const args: string[] = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";

    for (const char of cmd) {
        if (inQuotes) {
            if (char === quoteChar) inQuotes = false;
            else current += char;
        } else if (char === '"' || char === "'") {
            inQuotes = true;
            quoteChar = char;
        } else if (char === " " && current) {
            args.push(current);
            current = "";
        } else if (char !== " ") {
            current += char;
        }
    }

    if (current) args.push(current);
    return args;
};

export const processMedia = async ({
    fileId,
    commandString,
    outputExt,
}: MediaInput) => {
    const tempDir = path.join(process.cwd(), "src", "bucket", "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const fileLink = await bot.getFileLink(fileId);
    const outputPath = path.join(tempDir, `output_${fileId}.${outputExt}`);

    console.log(`\nProcessing media with FFmpeg...
fileId=${fileId}
command="${commandString}"
outputExt="${outputExt}"\n`);

    return new Promise((resolve, reject) => {
        let ff = ffmpeg(fileLink);
        const options = shellSplit(commandString);

        ff.outputOptions(options)
            .on("end", () => resolve({ success: true, path: outputPath }))
            .on("error", (err: any) =>
                reject(new Error(`FFmpeg Execution Error: ${err.message}`)),
            )
            .save(outputPath);
    });
};
