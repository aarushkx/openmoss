import ffmpeg from "fluent-ffmpeg";
import { bot } from "../services/telegram.js";
import fs from "fs";
import path from "path";

interface MediaInput {
    fileId: string;
    commandString: string;
    outputExt?: string;
}

export const processMedia = async ({
    fileId,
    commandString,
    outputExt,
}: MediaInput) => {
    const tempDir = path.join(process.cwd(), "bucket", "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const fileLink = await bot.getFileLink(fileId);
    const outputPath = path.join(tempDir, `output_${fileId}.${outputExt}`);

    console.log(
        `\nProcessing media with FFmpeg: fileId=${fileId}, command="${commandString}", outputExt="${outputExt}"\n`,
    );

    return new Promise((resolve, reject) => {
        let ff = ffmpeg(fileLink);
        const options = commandString.split(" ");

        ff.outputOptions(options)
            .on("end", () => resolve({ success: true, path: outputPath }))
            .on("error", (err: any) =>
                reject(new Error(`FFmpeg Execution Error: ${err.message}`)),
            )
            .save(outputPath);
    });
};
