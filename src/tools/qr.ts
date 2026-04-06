import QRCode from "qrcode";
import path from "path";
import fs from "fs";

interface QRInput {
    text: string;
    fileName?: string;
}

export const generateQR = async ({ text }: QRInput) => {
    const tempDir = path.join(process.cwd(), "src", "bucket", "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const fileName = `qr_${Date.now()}.png`;
    const outputPath = path.join(tempDir, fileName);

    try {
        await QRCode.toFile(outputPath, text, {
            color: {
                dark: "#000000",
                light: "#FFFFFF",
            },
            width: 1024,
        });

        return {
            success: true,
            path: outputPath,
            details: `QR Code generated for: ${text}`,
        };
    } catch (error: any) {
        return {
            success: false,
            error: `QR Generation Failed: ${error.message}`,
        };
    }
};
