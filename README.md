# Slack to JIRA Slack app

A Slack slash command to save messages by date to confluence. Request URL: https://slack-handler.onrender.com.

This program is written in Express.js. The Express app recieves and responds to POST requests sent from the slash command.

Slack slash command:

```
/save-convo [from_date; to_date]
/save-convo [date_ref]
/save-convo [single_date]

# Ex: /save-convo 01/18/2022 12:11:09; 01/22/2022 13:08:15
# Ex: /save-convo 01/18/2022; 01/22/2022
# Ex: /save-convo yesterday
# Ex: /save-convo 01/22/2022
```

| input       | Description                                                                             |
| ----------- | --------------------------------------------------------------------------------------- |
| from_date   | (string) messages after this datetime will be included in results.                      |
| to_date     | (string) messages before this datetime will be included in results.                     |
| single_date | (string) messages on this date will be included in results.                             |
| date_ref    | (string) messages from this date ref ('today', 'yesterday') will be included in results |

## Story
This app uses the Slack Web API https://api.slack.com/methods

## Info
the request object: https://api.slack.com/interactivity/slash-commands#app_command_handling
## Setup

The Slack to Confluence Slack app is not configured for collaboration and is controlled by the "**test-slack-to-confluence**" workspace

Once the app is availabled for others, invite the bot into your workspace

**Location**
Sign into the "**test-slack-to-confluence**" workspace at `https://api.slack.com/`.
Go to "Your Apps"
or go to https://testslacktoco-rzi8358.slack.com/apps/A04BLHB7MPC-slack-to-confluence?tab=more_info

```
/invite Slack to Confluence
```

### Local Development
We are passing the OAuth Tokens for Your Workspace into the The `WebClient`. Tokens are automatically generated when you install the app to a team. 


**Locate and Use**
https://api.slack.com/
under the `Slack To Confluence` app, select **OAuth & Permissions** 
the bot token is under **Bot User OAuth Token**
set **SLACK_CONF_BOT_TOKEN** to the token and add as an environment variables.

## AWS Lambda

I've created an AWS lambda with a cron job that pings the slack handler to keep the server awake.

<!-- https://travis.media/developing-aws-lambda-functions-locally-vscode/ -->

Local Lambda - /Users/stefonsimmons/eng/projects/my-lambdas/ping-slack-handler

Remote Lambda - arn:aws:lambda:us-east-1:629961528593:function:ping-slack-handler-pingSlackHandler-O3qF5wpdJC38

AWS Serverless Application Model (SAM) - A serverless framework for building serverless applications

- sam build: builds dependencies into a `.aws-sam` dir
- sam deploy: deploys app to via CloudFormation


## Change log
I pivotted to use Jira instead of Confluence for this app. 
