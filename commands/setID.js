const { SlashCommandBuilder } = require('discord.js');

// ユーザーID → ゲームIDを保存するMap（グローバル共有用）
const userGameIDs = new Map();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setid')
		.setDescription('あなたのゲームIDを保存します')
		.addStringOption(option =>
			option.setName('gameid')
				.setDescription('保存するゲームIDを入力してください')
				.setRequired(true)),

	async execute(client, interaction) {
		const gameID = interaction.options.getString('gameid');
		const userID = interaction.user.id;

		userGameIDs.set(userID, gameID);

		await interaction.reply({ content: `あなたのゲームID「${gameID}」を保存しました！`, ephemeral: true });
	},

	// 外部からMapにアクセスできるようにexport
	userGameIDs,
};
