# Slack to Confluence Slack app

A Slack slash command to save messages by date to confluence. Request URL: https://slack-handler.onrender.com.

This program is written in Express.js. The Express app recieves and responds to POST requests sent from the slash command.

Slack slash command:

```
/send-message [from_date; to_date]

# Ex: /slack-message 11/18/2022 12:11:09; 11/18/2022 13:08:15
```

| input     | Description                                                              |
| --------- | ------------------------------------------------------------------------ |
| from_date | (string) messages after this datetime will be included in results.  |
| to_date   | (string) messages before this datetime will be included in results. |


## Setup 

The Slack to Confluence Slack app is not configured for collaboration and is controlled by the "**test-slack-to-confluence**" workspace

Once the app is availabled for others, invite the  bot into your workspace
```
/invite Slack to Confluence
```