const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Purges messages in a channel")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of messages to purge (1-100)")
        .setRequired(true),
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator,
      )
    ) {
      return interaction.reply({
        content:
          "⚠️ You do not have the required permissions to use this command.",
        ephemeral: true,
      });
    }

    const amount = interaction.options.getInteger("amount");

    if (amount < 1 || amount > 100) {
      return interaction.reply({
        content: "Please specify a number between 1 and 100.",
        ephemeral: true,
      });
    }

    const channel = interaction.channel;

    try {
      // Fetch and delete messages
      const messages = await channel.messages.fetch({ limit: amount });
      await channel.bulkDelete(messages);

      // Inform the user
      await interaction.reply({
        content: `✅ Purged ${messages.size} message(s).`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "⚠️ An error occurred while trying to purge messages.",
        ephemeral: true,
      });
    }
  },
};
