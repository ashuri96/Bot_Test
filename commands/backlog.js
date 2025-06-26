const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

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
				.setDescription('積みゲーを削除します（選択式）')),
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
			const list = backlogData[guildId];
			if (list.length === 0) {
				await interaction.reply({ content: '積みゲーリストは空です。削除できるゲームがありません。', ephemeral: true });
				return;
			}

			// セレクトメニュー用の選択肢作成（最大25個まで）
			const options = list.slice(0, 25).map((game, index) => ({
				label: game.length > 25 ? game.slice(0, 22) + '...' : game,
				description: `No.${index + 1}`,
				value: game, // 選択時にこれが返る
			}));

			const row = new ActionRowBuilder()
				.addComponents(
					new StringSelectMenuBuilder()
						.setCustomId('backlog_delete_select')
						.setPlaceholder('削除するゲームを選択してください')
						.addOptions(options)
				);

			await interaction.reply({ content: '削除したい積みゲーを選んでください。', components: [row], ephemeral: true });
		}
	},

	// セレクトメニュー選択時の処理を追加で実装してください
	async handleSelectMenu(interaction) {
		if (interaction.customId !== 'backlog_delete_select') return;

		const guildId = interaction.guildId;
		if (!guildId) {
			await interaction.reply({ content: 'サーバー専用です。', ephemeral: true });
			return;
		}

		const selectedGame = interaction.values[0];
		const list = backlogData[guildId];
		const index = list.findIndex(g => g === selectedGame);
		if (index === -1) {
			await interaction.update({ content: `❌ 「${selectedGame}」は積みゲーリストに存在しません。`, components: [] });
			return;
		}

		list.splice(index, 1);
		await interaction.update({ content: `✅ 「${selectedGame}」を積みゲーリストから削除しました。`, components: [] });
	},
};
