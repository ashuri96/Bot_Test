const { SlashCommandBuilder } = require('discord.js');

// メモリ内のデータ管理（再起動で消えます）
const userGameData = new Map();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setid')
		.setDescription('あなたのゲーム名とゲームIDを保存するよ')
		.addStringOption(option =>
			option.setName('gamename')
				.setDescription('保存するゲーム名を選んでください')
				.setRequired(true)
				.addChoices(
					{ name: 'RiotID', value: 'RiotID' },
					{ name: 'Steam', value: 'Steam' },
					{ name: '原神', value: '原神' },
					{ name: 'XBox', value: 'XBox' },
					{ name: 'Switch', value: 'Swicth' }
				)
		)
		.addStringOption(option =>
			option.setName('gameid')
				.setDescription('あなたのゲーム内IDを入力してください')
				.setRequired(true)
		),

	async execute(client, interaction) {
		const gameName = interaction.options.getString('gamename');
		const gameID = interaction.options.getString('gameid');
		const userID = interaction.user.id;

		if (!userGameData.has(userID)) {
			userGameData.set(userID, {});
		}

		const gameIDs = userGameData.get(userID);
		gameIDs[gameName] = gameID;

		await interaction.reply({
			content: `🎮 ゲーム「${gameName}」のID「${gameID}」を保存しました！`,
			ephemeral: true,
		});
	},

	userGameData,
};
