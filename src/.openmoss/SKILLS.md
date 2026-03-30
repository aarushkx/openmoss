# 🌿 OpenMoss Skills

These are the capabilities available to the agent.

## getDateTime
Get the current date, time, and timezone.
- Input: `timezone` (string, optional)
- Output: `date` (string), `time` (string), `timezone` (string)

## getWeather
Get the current weather information for a specific city.
- Input: `city` (string — the name of the city, e.g., "Ranchi" or "London")
- Output: `city` (string), `region` (string), `country` (string), `temp_c` (number), `temp_f` (number), `condition` (string)
- Note: If the API returns an error, the output will contain the error details provided by the weather service.

## rememberFact
Save a persistent fact to memory under a given category.
- Input: `category` (string), `fact` (string)
- Output: `success` (boolean), `message` (string)

## scheduleTask
Schedule a one-time reminder for the user at a specific date and time. Use when the user wants to be reminded about something later.
- Input: `chatId` (number — always inject automatically), `task` (string — the reminder message to send), `remindAt` (string — ISO 8601 datetime e.g. "2025-06-18T09:00:00+05:30"), `label` (string — short unique name e.g. "Feed the dog")
- Output: `success` (boolean), `message` (string)
- Note: Always use Asia/Kolkata timezone offset (+05:30) unless the user specifies otherwise.