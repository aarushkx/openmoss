import { inngest } from "../inngest/client";

interface ScheduleInput {
    chatId: number;
    task: string;
    remindAt: string;
    label: string;
}

export const scheduleTask = async ({
    chatId,
    task,
    remindAt,
    label,
}: ScheduleInput) => {
    const date = new Date(remindAt);
    if (isNaN(date.getTime())) {
        return {
            success: false,
            message: `Invalid remindAt value: "${remindAt}". Use ISO 8601 format e.g. "2025-06-18T09:00:00+05:30"`,
        };
    }

    await inngest.send({
        name: "scheduler/reminder.scheduled",
        data: { chatId, task, remindAt, label },
    });

    return `Reminder "${label}" scheduled for ${date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;
};
