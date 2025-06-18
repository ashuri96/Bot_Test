const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// 保存データファイルのパス
const DATA_FILE_PATH = path.join(__dirname, '../data/data.json');

// JSONデータの読み込み関数
function loadUserGameData() {
	if (fs.existsSync(DATA_FILE_PATH)) {
		try {
			return JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf-8'));
		} catch (error) {
			console.error('データの読み込みに失敗しました:', error);
			return {};
		}
	} else {
		return {};
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getid')
		.setDescription('他のユーザーのゲームIDを取得します')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('ゲームIDを知りたいユーザーを選んでください')
				.setRequired(true)
		)
		.addStringOption(option =>
			option.setName('gamename')
				.setDescription('取得したいゲーム名を選んでください')
				.setRequired(true)
				.addChoices(
					{ name: 'RiotID', value: 'RiotID' },
					{ name: 'Steam', value: 'Steam' },
					{ name: '原神', value: '原神' },
					{ name: 'EpicGames', value: 'EpicGames' },
					{ name: 'ubisoft', value: 'ubisoft' },
				)
		),

	async execute(client, interaction) {
		const targetUser = interaction.options.getUser('user');
		const gameName = interaction.options.getString('gamename');

		const userGameData = loadUserGameData();

		const userID = targetUser.id;

		// 該当データの存在確認
		if (
			userGameData[userID] &&
			userGameData[userID][gameName]
		) {
			const gameID = userGameData[userID][gameName];
			await interaction.reply({
				content: `${targetUser.username}さんの「${gameName}」のIDは「${gameID}」です！`,
				ephemeral: false
			});
		} else {
			await interaction.reply({
				content: `${targetUser.username}さんは「${gameName}」のIDをまだ登録していません。`,
				ephemeral: true
			});
		}
	}
};
