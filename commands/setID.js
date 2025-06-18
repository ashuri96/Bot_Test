const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// 保存先ファイル
const filePath = path.join(__dirname, '../data/userGameData.json');

// 既存データの読み込み（なければ空）
let userGameData = new Map();
if (fs.existsSync(filePath)) {
	const raw = fs.readFileSync(filePath, 'utf8');
	const json = JSON.parse(raw);
	userGameData = new Map(Object.entries(json));
}

// 保存処理
function saveUserData(map) {
	const obj = Object.fromEntries(map);
	fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
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

		userGameData.set(userID, {
			gameName,
			gameID,
			username: interaction.user.username, // 任意：表示名も保存
		});

		saveUserData(userGameData); // 🔁 保存！

		await interaction.reply({
			content: `ゲーム「${gameName}」のID「${gameID}」を保存しました！`,
			ephemeral: true
		});
	},
};
