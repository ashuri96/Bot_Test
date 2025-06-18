const { SlashCommandBuilder } = require('discord.js');

// ユーザーID → ゲーム名 → ゲームID を保存
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
					{ name: 'XBox', value: 'XBox' }
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

		// ユーザーが未登録なら新しく作る
		if (!userGameData.has(userID)) {
			userGameData.set(userID, {});
		}

		// 既存のゲームIDリストを取得し、該当ゲームに上書き
		const gameIDs = userGameData.get(userID);
		gameIDs[gameName] = gameID;

		await interaction.reply({
			content: `🎮 ゲーム「${gameName}」のID「${gameID}」を保存しました！`,
			ephemeral: true
		});
	},

	userGameData,
};
