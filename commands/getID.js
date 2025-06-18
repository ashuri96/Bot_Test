const { SlashCommandBuilder } = require('discord.js');
const { userGameIDs } = require('./setID');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getid')
		.setDescription('あなたの保存されたゲームIDを取得します'),

	async execute(client, interaction) {
		const userID = interaction.user.id;
		const savedID = userGameIDs.get(userID);

		if (savedID) {
			await interaction.reply({ content: `あなたの保存されたゲームIDは「${savedID}」です！`, ephemeral: true });
		} else {
			await interaction.reply({ content: 'まだゲームIDが保存されていません。まずは `/setid` で登録してください。', ephemeral: true });
		}
	},
};
