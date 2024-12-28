//
//  github.js
//  ScribbleCareBear Commands
//
//  Copyright (c) 2024 ScribbleLabApp LLC. - All rights reserved.
//
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//  1. Redistributions of source code must retain the above copyright notice, this
//     list of conditions and the following disclaimer.
//
//  2. Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//
//  3. Neither the name of the copyright holder nor the names of its
//     contributors may be used to endorse or promote products derived from
//     this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
//  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
//  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
//  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
//  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
//  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
//  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
//  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
//  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { client, config } = require("../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("github")
    .setDescription("Link or unlink your GitHub account with the bot.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("link")
        .setDescription("Link your GitHub account with the bot."),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("unlink")
        .setDescription("Unlink your GitHub account from the bot."),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    const embed = new EmbedBuilder()
      .setColor("#FF7800")
      .setTitle("GitHub Account Link/Unlink")
      .setDescription(
        "Linking your GitHub account to this bot allows you to receive roles based on your contributions to our projects.\n" +
          "By linking your GitHub account, you will automatically be granted roles based on your contributions to the organization.\n" +
          "Unlinking your account will remove those roles and reset your contributions.",
      )
      .setFooter({ text: "ScribbleLabApp GitHub Integration" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel(
          subcommand === "link"
            ? "Link GitHub Account"
            : "Unlink GitHub Account",
        )
        .setStyle(ButtonStyle.Link) // Ensure it's a link button
        .setURL(`https://scribbleapi.onrender.com/v0/github/login`), // GitHub OAuth URL
    );

    await interaction.reply({
      content: `Click the button below to ${subcommand === "link" ? "link" : "unlink"} your GitHub account.`,
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  },
};
