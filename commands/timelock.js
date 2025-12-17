const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { timelockChastityModal } = require("./../functions/interactivefunctions.js");
const { getChastityKeyholder, getChastity } = require("../functions/vibefunctions.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timelock")
    .setDescription(`Lock yourself or your sub with a timer`)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("chastity")
        .setDescription("Lock a chastity belt...")
        .addUserOption((opt) => opt.setName("wearer").setDescription("Who wears the belt?").setRequired(false))
    ),
  async execute(interaction) {
    const actiontotake = interaction.options.getSubcommand();
    const wearer = interaction.options.getUser("wearer") ?? interaction.user;

    switch (actiontotake) {
      case "chastity":
        if (!getChastity(wearer.id)) {
          interaction.reply({
            content: `${wearer} is not wearing a belt`,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        if (getChastityKeyholder(wearer.id) != interaction.user.id) {
          interaction.reply({
            content: `You do not have the key to ${wearer}'s belt`,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        interaction.showModal(timelockChastityModal(interaction, wearer));
        break;
      default:
        interaction.reply({
          content: "Unsupported restraint",
          flags: MessageFlags.Ephemeral,
        });
    }
  },
  async modalexecute(interaction) {
    console.log(interaction);

    const keyholder = interaction.user.id;
    const wearer = interaction.customId.split("_")[1];
    const timeString = interaction.fields.getStringSelectValues("timelockinput");
    const access = interaction.fields.getStringSelectValues("accesswhilebound");
    const keyholderAfter = interaction.fields.getStringSelectValues("keyholderafter");

    const unlockTime = parseTime(timeString);

    interaction.showModal(buildConfirmModal(wearer, keyholder, unlockTime.getTime(), access, keyholderAfter));
  },
};
