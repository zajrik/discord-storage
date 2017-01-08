# discord-storage

discord-storage is a revolutionary way to horribly store your data! Written using [discord.js](http://github.com/hydrabolt/discord.js), discord-storage allows data to be stored within a Discord server text channel. This project was written as a joke partially inspired by a conversation with @bdistin about storing data on discord, and by [this project](https://github.com/rossem/RedditStorage).

## Advantages:
- None!

## Disadvantages:
- Slow (very!)
- Reliant on the Discord API (ratelimits!)
- Requires setting up your own Discord bot
- Stupid!

# Getting started
It's pretty simple to use:
```js
const Discord = require('discord.js');
const Storage = require('discord-storage').Storage;

const client = new Discord.Client();
client.login('discord bot token');

client.once('ready', () => {
	client.storage = new Storage(client, 'storageChannelIDGoesHere');
	client.storage.sync().then(() => {
		// Do whatever you want with storage after syncing is complete
	});
});
```

I honestly don't want to bother with documenting the methods so just check the source. Not like you're going to use this anyway!