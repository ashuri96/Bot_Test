require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const config = require('./config.json');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
	],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log('ギルドにコマンドを登録中...');
		await rest.put(
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{ body: commands }
		);
		console.log('コマンド登録完了！');
	} catch (error) {
		console.error(error);
	}
})();

client.once('ready', async () => {
	console.log(`${client.user.tag} でログインしました`);

	const guild = client.guilds.cache.get(config.guildId);
	if (guild) {
		await guild.members.fetch();
		console.log('ギルドメンバーをキャッシュに読み込みました');
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(client, interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
	}
});

client.login(process.env.DISCORD_TOKEN);
