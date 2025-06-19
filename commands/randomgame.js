const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('randomgame')
		.setDescription('今日やるゲームをランダムに決めます'),

	async execute(client, interaction) {
		// ゲームの候補一覧
		const games = [
			'Valorant',
			'スト6',
			'REPO',
			'Lethal Company',
			'原神',
			'Apex',
			'Six Siege'
		];

		// ランダムに選択
		const randomIndex = Math.floor(Math.random() * games.length);
		const selectedGame = games[randomIndex];

		// 最初に「選択中...」を表示
		await interaction.reply({
			content: `🎲 今日やるゲームを選んでいます...`,
			//ephemeral: true,
		});

		// 1秒後に結果を表示
		setTimeout(() => {
			interaction.editReply({
				content: `🎮 今日やるゲームは... **${selectedGame}** に決定！`,
				//ephemeral: true,
			});
		}, 1000);
	},
};
