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

## getAvailableSkills
Retrieve the full list of your capabilities and tool definitions from the system. Use this if you are unsure of the correct syntax or available tools for a task.
- Input: `{}` (No parameters required)
- Output: The content of the SKILLS.md file.

## searchMemory
Search your long-term memory for specific keywords or categories to recall facts about the user or past interactions.
- Input: `query` (string — keyword to search for, or empty string "" to see all recent memories)
- Output: Matching lines from MEMORY.md or "No relevant memories found."

## sendEmail
Send an email to a specified recipient using the Resend service.
- Input: `to` (string — recipient email address), `subject` (string — subject line), `body` (string — the main message text)
- Output: `success` (boolean), `messageId` (string)
- Note: Only use this if the user explicitly asks to "email" or "send a message to [email address]".

## processMedia
Execute raw FFmpeg commands on a user's media file.
- Input: 
    - `fileId` (string — from user message)
    - `commandString` (string — the flags/filters ONLY. Do NOT include 'ffmpeg' or '-i'. Example: "-vf scale=1280:-1 -c:v libx264 -crf 23")
    - `outputExt` (string — e.g., "mp4", "mp3", "gif", "wav")
- Output: `success` (boolean), `path` (string)
- Note: You are responsible for writing valid FFmpeg syntax. Use this for complex tasks like overlays, custom encoding, or rare formats.