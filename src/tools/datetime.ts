export const getDateTime = (input: { timezone?: string } = {}) => {
    const tz =
        input.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    const now = new Date();

    return {
        date: now.toLocaleDateString("en-IN", {
            timeZone: tz,
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
        time: now.toLocaleTimeString("en-IN", {
            timeZone: tz,
            hour: "2-digit",
            minute: "2-digit",
        }),
        timezone: tz,
    };
};
