const { Client, Intents, Collection } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS ]});



client.message = new Collection();
client.messageCreate = new Collection();
// client.categories = new Collection();
client.interactions = new Collection();

['event', 'slashCommand'].forEach(handler => require(`./handlers/${handler}`)(client));

client.login(process.env.TOKEN);