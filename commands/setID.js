const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// JSONファイルの保存先
const DATA_FILE_PATH = path.join(__dirname, '../data/data.json');

// データを読み込む（なければ空のオブジェクト）
let userGameData = {};
if (fs.existsSync(DATA_FILE_PATH)) {
	try {
		userGameData = JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf-8'));
	} catch (error) {
		console.error('データの読み込みに失敗しました:', error);
	}
}

// データ保存関数
function saveData() {
	fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(userGameData, null, 2), 'utf-8');
}

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
					{ name: 'EpicGames', value: 'EpicGames' },
					{ name: 'ubisoft', value: 'ubisoft' },
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

		// ユーザーが初めてなら空のオブジェクトを作る
		if (!userGameData[userID]) {
			userGameData[userID] = {};
		}

		// ゲーム名に対応したIDを保存
		userGameData[userID][gameName] = gameID;

		// 保存
		saveData();

		await interaction.reply({
			content: `ゲーム「${gameName}」のID「${gameID}」を保存しました！`,
			ephemeral: true
		});
	},

	// 他のコマンドから読み込めるように
	userGameData
};
