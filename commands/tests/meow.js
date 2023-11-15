const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meow')
    .setDescription('Replies to a meow'),
  async execute(interaction) {
    await interaction.reply('MEOW!');
  }
};

