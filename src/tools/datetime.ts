export function getDateTime(_input: Record<string, never> = {}) {
    const now = new Date();
    return {
        date: now.toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
        time: now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        }),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
}
