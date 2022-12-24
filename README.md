# Slack to Confluence Slack app

A Slack slash command to save messages by date to confluence. Request URL: https://slack-handler.onrender.com.

This program is written in Express.js. The Express app recieves and responds to POST requests sent from the slash command.

Slack slash command:

```
/save-convo [from_date; to_date]
/save-convo [date_ref]
/save-convo [single_date]

# Ex: /save-convo 01/18/2022 12:11:09; 01/18/2022 13:08:15
```

| input     | Description                                                              |
| --------- | ------------------------------------------------------------------------ |
| from_date | (string) messages after this datetime will be included in results.  |
| to_date   | (string) messages before this datetime will be included in results. |
| single_date   | (string) messages on this date will be included in results. |
| date_ref | (string) messages from this date ref ('today', 'yesterday') will be included in results |


## Setup 

The Slack to Confluence Slack app is not configured for collaboration and is controlled by the "**test-slack-to-confluence**" workspace

Once the app is availabled for others, invite the  bot into your workspace
```
/invite Slack to Confluence
```


## AWS Lambda
<!-- https://travis.media/developing-aws-lambda-functions-locally-vscode/ -->
Local Lambda - /Users/stefonsimmons/eng/projects/my-lambdas/ping-slack-handler

Remote Lambda - arn:aws:lambda:us-east-1:629961528593:function:ping-slack-handler-pingSlackHandler-O3qF5wpdJC38

AWS Serverless Application Model (SAM) - A serverless framework for building serverless applications
- sam build: builds dependencies into a `.aws-sam` dir
- sam deploy: deploys app to via CloudFormation
