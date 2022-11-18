const { WebClient } = require('@slack/web-api');

const web = new WebClient(process.env.SLACK_CONF_BOT_TOKEN);

const currentTime = new Date().toTimeString();

// async function postMessage () {

//     try {
//       // Use the `chat.postMessage` method to send a message from this app
//       await web.chat.postMessage({
//         channel: '#general',
//         text: `The current time is ${currentTime}, Dog :dog`,
//       });
//       console.log('Message posted!');
//     } catch (error) {
//       console.log(error);
//     }
  
// }

// postMessage()

async function getChannels () {

    try {
      const list = await web.conversations.list({types:'public_channel,private_channel,mpim,im'});
      console.log('List of channels, and direct messages!');
      console.log(list)
    } catch (error) {
      console.log(error);
    }
  
}

getChannels()

// async function getChannelHistory() {

//     try {
//       const list = await web.conversations.history({channel:'C04B60VT3TR'});
//       console.log('Convo or Message Events');
//       console.log(list)
//     } catch (error) {
//       console.log(error.data);
//     }
  
// }

// getChannelHistory()



// generally:
// I  want to send a request to an api (the one I created) that recieves information on my 
// get the slack Conversation ID of the Conversation the command was called in.
// get the slack conversation from start to end date/time
// 
