const { SlashCommandBuilder } = require('discord.js');

const backlogData = {};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('backlog')
		.setDescription('積みゲー管理コマンド')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('積みゲーを追加します')
				.addStringOption(option =>
					option.setName('game')
						.setDescription('ゲーム名を入力してください')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('積みゲー一覧を表示します'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('random')
				.setDescription('積みゲーからランダムに1本おすすめします'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('delete')
				.setDescription('積みゲーを削除します')
				.addStringOption(option =>
					option.setName('game')
						.setDescription('削除したいゲーム名を入力してください')
						.setRequired(true))),
	async execute(client, interaction) {
		const guildId = interaction.guildId;
		if (!guildId) {
			await interaction.reply({ content: 'サーバー専用コマンドです。', ephemeral: true });
			return;
		}

		if (!backlogData[guildId]) backlogData[guildId] = [];

		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'add') {
			const game = interaction.options.getString('game');
			backlogData[guildId].push(game);
			await interaction.reply(`✅ 「${game}」を積みゲーに追加しました！`);
		}
		else if (subcommand === 'list') {
			const list = backlogData[guildId];
			if (list.length === 0) {
				await interaction.reply('積みゲーリストは空です。まずは /backlog add で追加してください。');
			} else {
				const formattedList = list.map((g, i) => `${i + 1}. ${g}`).join('\n');
				await interaction.reply(`📚 積みゲー一覧:\n${formattedList}`);
			}
		}
		else if (subcommand === 'random') {
			const list = backlogData[guildId];
			if (list.length === 0) {
				await interaction.reply('積みゲーリストは空です。まずは /backlog add で追加してください。');
			} else {
				const game = list[Math.floor(Math.random() * list.length)];
				await interaction.reply(`🎲 今日やる積みゲーはこちら！\n**${game}**`);
			}
		}
		else if (subcommand === 'delete') {
			const game = interaction.options.getString('game');
			const list = backlogData[guildId];
			const index = list.findIndex(g => g.toLowerCase() === game.toLowerCase());
			if (index === -1) {
				await interaction.reply(`❌ 「${game}」は積みゲーリストに存在しません。`);
			} else {
				list.splice(index, 1);
				await interaction.reply(`✅ 「${game}」を積みゲーリストから削除しました。`);
			}
		}
	},
};
