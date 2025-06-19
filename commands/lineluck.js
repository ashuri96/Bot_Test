const { SlashCommandBuilder } = require('discord.js');

const urls = {
  おひつじ座: 'https://fortune.line.me/horoscope/aries/',
  おうし座: 'https://fortune.line.me/horoscope/taurus/',
  ふたご座: 'https://fortune.line.me/horoscope/gemini/',
  かに座: 'https://fortune.line.me/horoscope/cancer/',
  しし座: 'https://fortune.line.me/horoscope/leo/',
  おとめ座: 'https://fortune.line.me/horoscope/virgo/',
  てんびん座: 'https://fortune.line.me/horoscope/libra/',
  さそり座: 'https://fortune.line.me/horoscope/scorpio/',
  いて座: 'https://fortune.line.me/horoscope/sagittarius/',
  やぎ座: 'https://fortune.line.me/horoscope/capricorn/',
  みずがめ座: 'https://fortune.line.me/horoscope/aquarius/',
  うお座: 'https://fortune.line.me/horoscope/pisces/',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lineluck')
    .setDescription('星座占いの結果を教えるよ')
    .addStringOption(option =>
      option
        .setName('constellation')
        .setDescription('星座を選んでね')
        .setRequired(true)
        .addChoices(
          { name: 'おひつじ座', value: 'おひつじ座' },
          { name: 'おうし座', value: 'おうし座' },
          { name: 'ふたご座', value: 'ふたご座' },
          { name: 'かに座', value: 'かに座' },
          { name: 'しし座', value: 'しし座' },
          { name: 'おとめ座', value: 'おとめ座' },
          { name: 'てんびん座', value: 'てんびん座' },
          { name: 'さそり座', value: 'さそり座' },
          { name: 'いて座', value: 'いて座' },
          { name: 'やぎ座', value: 'やぎ座' },
          { name: 'みずがめ座', value: 'みずがめ座' },
          { name: 'うお座', value: 'うお座' }
        )
    ),

  async execute(client, interaction) {
    const constellation = interaction.options.getString('constellation');
    const url = urls[constellation];

    if (!url) {
      await interaction.reply({ content: '申し訳ありません、その星座のURLが設定されていません。', ephemeral: true });
      return;
    }

    await interaction.reply({
      content: `${constellation}の占い結果はこちらからどうぞ！\n${url}`,
      ephemeral: false,
    });
  },
};
