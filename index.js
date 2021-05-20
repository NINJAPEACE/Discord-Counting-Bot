const Discord = require('discord.js');
const client = new Discord.Client();
const data = require('./data.json');

client.on('ready', () => {
    console.log('Bot is Ready');
});

const countingChannel = client.channels.resolve(data.countingChannel);

setInterval(async () => {
    await countingChannel.messages.fetch({ limit: 1 }).then(e => {
	let lastMsg = e.first();

	if (!lastMsg.author.bot && parseInt(lastMsg.content) + 1 !== parseInt(countingChannel.topic.replace('Next count is ', ''))) {
	    countingChannel.setTopic('Next count is ' + (parseInt(lastMsg.content) + 1) + '\nMaybe not sync because Rate-Limited');
	}
     });
}, 1000);

let lastMsgAuthor;

client.on('message', async message => {
	if (message.channel.id === data.countingChannel) {
	  if (message.author.bot) return;
		let next_count = parseInt(countingChannel.topic.replace('Next count is ', ''));

		if (parseInt(message.content) !== next_count) {
			message.delete();
		} else if (message.author.id === lastMsgAuthor) {
			message.delete();
		} else {
		        countingChannel.setTopic('Next count is ' + (next_count + 1) + '\nMaybe not sync because Rate-Limited');

		        lastMsgAuthor = message.author.id;
	        }

	}
});

client.login(data.token);
