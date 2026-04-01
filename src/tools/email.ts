import { Resend } from "resend";

interface SendEmailInput {
    to: string;
    subject: string;
    body: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (input: SendEmailInput) => {
    const { data, error } = await resend.emails.send({
        from: `OpenMoss <${process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"}>`,
        to: input.to,
        subject: input.subject,
        text: input.body,
    });

    if (error) {
        return {
            success: false,
            messageId: null,
            error: error.message,
        };
    }
    return { success: true, messageId: data?.id };
};
