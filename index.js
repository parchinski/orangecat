// Imports
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// Local Imports
const { token } = require('./config.json');

// create a client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// create a collection of commands
client.commands = new Collection();
const foldersPath = path.join(__dirname, './commands/');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

    // check for data and execute properties
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
    else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// event listener for when the client is ready
client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
  // check if the interaction is a command
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

  // check if the command exists
	if (!command) return;

  // execute the command catching any errors
	try {
		await command.execute(interaction);
	}
  catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
    else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// login to discord
client.login(token);

