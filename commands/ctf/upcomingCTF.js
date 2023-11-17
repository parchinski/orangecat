const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const moment = require("moment");
const logger = require("../../utils/logger");
const ctftimeApi = require("../../utils/ctftime-api");

// Utility function to validate URLs
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upcoming")
    .setDescription("Check upcoming events")
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription("The index of the event")
        .setRequired(false),
    ),

  async execute(interaction) {
    const curTime = moment().unix();

    const upcomingEvents = await ctftimeApi.getEvents(curTime, "", 10);

    let eventIndex = interaction.options.getInteger("index") || 0;

    if (eventIndex < 0 || eventIndex >= upcomingEvents.length) {
      logger.error("COMMAND", "Invalid or out of range index given");
      await interaction.reply({
        content: `Invalid index. Please choose an index from 0 to ${
          upcomingEvents.length - 1
        }.`,
        ephemeral: true,
      });
      return;
    }

    const curEvent = upcomingEvents[eventIndex];

    const eventEmbed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle(curEvent.title)
      .setURL(curEvent.ctftime_url)
      .setDescription(curEvent.description);

    if (curEvent.logo && isValidUrl(curEvent.logo)) {
      eventEmbed.setThumbnail(curEvent.logo);
    }

    eventEmbed.addFields(
      { name: "Format", value: curEvent.format },
      { name: "Link", value: curEvent.url },
      { name: "CTFTime URL", value: curEvent.ctftime_url },
      {
        name: "Start",
        value: moment(curEvent.start).format("MMM Do YY hh:mm A Z"),
      },
      {
        name: "Finish",
        value: moment(curEvent.finish).format("MMM Do YY hh:mm A Z"),
      },
    );

    logger.info("COMMAND", "Event embed sent");

    await interaction.reply({ embeds: [eventEmbed] });
  },
};
