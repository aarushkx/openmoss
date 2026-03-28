# 🌿 OpenMoss Skills

These are the capabilities available to the agent.

## getDateTime
Get the current date, time, and timezone.
- Input: `timezone` (string, optional)
- Output: `date` (string), `time` (string), `timezone` (string)

## rememberFact
Save a persistent fact to memory under a given category.
- Input: `category` (string), `fact` (string)
- Output: `success` (boolean), `message` (string)