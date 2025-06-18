const { SlashCommandBuilder } = require('discord.js');
const { userGameData } = require('./setID.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getid')
		.setDescription('指定したユーザーとゲームからゲームIDを表示します')
		.addUserOption(option =>
			option.setName('target')
				.setDescription('ゲームIDを確認したいユーザーを選んでください')
				.setRequired(true)
		)
		.addStringOption(option =>
			option.setName('gamename')
				.setDescription('対象のゲームを選んでください')
				.setRequired(true)
				.addChoices(
					{ name: 'RiotID', value: 'RiotID' },
					{ name: 'Steam', value: 'Steam' },
					{ name: '原神', value: '原神' },
					{ name: 'XBox', value: 'XBox' }
				)
		),

	async execute(client, interaction) {
		const targetUser = interaction.options.getUser('target');
		const gameName = interaction.options.getString('gamename');
		const userID = targetUser.id;

		if (!userGameData.has(userID)) {
			await interaction.reply({
				content: `❌ ユーザー <@${userID}> はまだIDを登録していません。`,
				ephemeral: false,
			});
			return;
		}

		const gameIDs = userGameData.get(userID);
		const gameID = gameIDs[gameName];

		if (!gameID) {
			await interaction.reply({
				content: `❌ ユーザー <@${userID}> はゲーム「${gameName}」のIDを登録していません。`,
				ephemeral: false,
			});
			return;
		}

		await interaction.reply({
			content: `✅ ユーザー <@${userID}> のゲーム「${gameName}」のIDは「${gameID}」です！`,
			ephemeral: false,
		});
	},
};
