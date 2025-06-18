const { SlashCommandBuilder } = require('discord.js');
const { userGameData } = require('./setID.js'); // setidからMapをインポート

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getid')
		.setDescription('指定したユーザーのゲームIDを表示します')
		.addUserOption(option =>
			option.setName('target')
				.setDescription('ゲームIDを確認したいユーザーを選んでください')
				.setRequired(true)
		),

	async execute(client, interaction) {
		const targetUser = interaction.options.getUser('target');
		const targetTag = targetUser.tag;

		const data = userGameData.get(targetTag);

		if (data) {
			await interaction.reply({
				content: `🎮 ユーザー: **${targetTag}**\nゲーム名: **${data.gameName}**\nゲームID: **${data.gameID}**`,
				ephemeral: false
			});
		} else {
			await interaction.reply({
				content: `❌ ユーザー「${targetTag}」のゲーム情報は登録されていません。`,
				ephemeral: false
			});
		}
	},
};
