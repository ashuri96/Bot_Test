const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('todayluck')
		.setDescription('今日の運勢を教えるよ')
		.addStringOption(option =>
			option
				.setName('type')
				.setDescription('運勢のジャンルを選んでね')
				.setRequired(false)
				.addChoices(
					{ name: '日常運', value: 'normal' },
					{ name: 'ゲーマー運', value: 'gamer' },
					{ name: 'パチンコ運', value: 'pachinko' }
				)
		),

	async execute(client, interaction) {
		// 運勢ランクごとの各種コメント（normal: 日常 / gamer: ゲーマー / pachinko: パチンカス）
		const fortunes = [
			{
				rank: "✨ 大吉 ✨",
				comments: {
					normal: [
						"今日は何をしてもツイてる！思いきって挑戦してみよう！",
						"運命が味方してくれる日！思い切って動こう！",
						"全てが順調に進むはず！"
					],
					gamer: [
						"勝率爆上がり！エイムも立ち回りも神がかってるぞ！",
						"味方ガチャ大成功！無双できる予感！",
						"ランクもガチャも全部神引き！"
					],
					pachinko: [
						"万枚コース！今日は朝から閉店まで行くべき日！",
						"右打ちが止まらない！今日の主役は君だ！",
						"全回転演出を引けるかも！？行くしかない！"
					]
				}
			},
			{
				rank: "😊 中吉 😊",
				comments: {
					normal: [
						"少しだけいいことがありそう。気楽に楽しもう！",
						"意外な嬉しいことがあるかも。",
						"人の優しさに触れる日かも！"
					],
					gamer: [
						"味方運そこそこ！自分の腕次第で勝てる！",
						"今日の立ち回りは安定感抜群！",
						"報酬も良い感じに稼げそう！"
					],
					pachinko: [
						"今日はプラス域！深追いせず逃げ切れ！",
						"波に乗れれば勝てる！引き際が重要！",
						"2万勝ちくらいで帰れたら上出来！"
					]
				}
			},
			{
				rank: "😌 小吉 😌",
				comments: {
					normal: [
						"穏やかな一日。無理せずマイペースにいこう。",
						"リラックスして過ごせる日。",
						"コーヒーでも飲んでほっと一息。"
					],
					gamer: [
						"ソロプレイでまったりが吉。",
						"デイリーミッションだけ済ませよう。",
						"今は練習に集中すると良いかも。"
					],
					pachinko: [
						"今日は遊び打ちで！負けてもストレス少なめ。",
						"打ちに行くより家でアニメが正解かも。",
						"甘デジで気楽に過ごすのが◎。"
					]
				}
			},
			{
				rank: "😐 末吉 😐",
				comments: {
					normal: [
						"何も起きないのが幸せ。平凡を楽しもう。",
						"小さなことに感謝する日かも。",
						"悪くはないけど期待しすぎないで。"
					],
					gamer: [
						"今日は練習日和。ランクはお休みしよう。",
						"味方は当てにしないで立ち回ろう。",
						"ログボだけ取っておくのも手。"
					],
					pachinko: [
						"行っても行かなくても変わらんかもな…。",
						"今日打つなら軽く様子見程度で。",
						"ノーヒットで帰る可能性アリ。"
					]
				}
			},
			{
				rank: "😅 凶 😅",
				comments: {
					normal: [
						"小さなトラブルに注意。余裕を持って行動しよう。",
						"焦ると悪循環。深呼吸を忘れずに。",
						"出かけるなら念入りに準備して。"
					],
					gamer: [
						"味方ガチャ地獄注意！ソロランクは避けて！",
						"ラグに悩まされるかも…回線チェック推奨。",
						"武器運が悪い日。構成変えてみては？"
					],
					pachinko: [
						"ハマり地獄の始まりかも…回す手が震える！",
						"今日は投資が止まらない…冷静さを忘れずに。",
						"STスルー3連発とかありそう。"
					]
				}
			},
			{
				rank: "💀 大凶 💀",
				comments: {
					normal: [
						"今日は静かに過ごすのが吉。無理しないでね。",
						"寝て過ごせ。外出は非推奨。",
						"余計なことはせず現状維持！"
					],
					gamer: [
						"バグ・ラグ・味方地雷の三重苦…！",
						"今日のランクマは地獄！",
						"エイムが迷子になる日。感度もズレてる気がする…"
					],
					pachinko: [
						"天井一直線。財布と心のHPを大切に。",
						"確変即落ち。何を引いても伸びない！",
						"帰る頃には財布が空っぽかも…。"
					]
				}
			}
		];

		// 選択されたジャンルを取得（なければランダム）
		const selectedType = interaction.options.getString('type') ||
			['normal', 'gamer', 'pachinko'][Math.floor(Math.random() * 3)];

		// ランダムに運勢を選ぶ
		const result = fortunes[Math.floor(Math.random() * fortunes.length)];

		// ランダムにコメントを選ぶ
		const comments = result.comments[selectedType];
		const comment = comments[Math.floor(Math.random() * comments.length)];

		const username = interaction.user.username;

		const typeNameMap = {
			normal: "日常運",
			gamer: "ゲーマー運",
			pachinko: "パチンコ運"
		};

		await interaction.reply({
			content: `🔮 ${username}さんの**${typeNameMap[selectedType]}**は...\n**${result.rank}**\n${comment}`,
			ephemeral: false
		});
	},
};
