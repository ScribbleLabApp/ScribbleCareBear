//
//  resources.js
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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resources")
    .setDescription(
      "Shows key links like our site, docs, GitHub, and tools for contributors.",
    ),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("#FF7800")
      .setTitle("ScribbleLab Contribution Resources")
      .setDescription(
        "Get involved with ScribbleLabApp! Whether you're a developer, designer, or simply passionate about contributing, we've got the resources to help you make an impact. " +
          "Use the buttons below to access our GitHub organization, guidelines, legal agreements, and other essential contribution materials. Your involvement helps us grow and improve!",
      )
      .setFooter({ text: "ScribbleLabApp - Building Together" })
      .setTimestamp();

    const upperRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setEmoji("1321250194528010252")
        .setLabel("GitHub Organization")
        .setStyle(ButtonStyle.Link)
        .setURL("https://github.com/ScribbleLabApp"),

      new ButtonBuilder()
        .setEmoji("1321236996533784639")
        .setLabel("Contribution Guidelines")
        .setStyle(ButtonStyle.Link)
        .setURL("https://scribblelabapp-docs.pages.dev/contributing"),

      new ButtonBuilder()
        .setEmoji("1321236996533784639")
        .setLabel("ScribbleLabApp EULA")
        .setStyle(ButtonStyle.Link)
        .setURL("https://scribblelabapp-docs.pages.dev/contributing"),

      new ButtonBuilder()
        .setEmoji("1321236996533784639")
        .setLabel("Changelog")
        .setStyle(ButtonStyle.Link)
        .setURL("https://scribblelabapp-docs.pages.dev/contributing"),

      new ButtonBuilder()
        .setEmoji("1321236996533784639")
        .setLabel("Scribble Support Forum")
        .setStyle(ButtonStyle.Link)
        .setURL("https://scribblelabapp-docs.pages.dev/contributing"),
    );

    const lowerRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setEmoji("1321236996533784639")
        .setLabel("FAQs")
        .setStyle(ButtonStyle.Link)
        .setURL("https://scribblelabapp-docs.pages.dev/contributing"),

      new ButtonBuilder()
        .setEmoji("1321236996533784639")
        .setLabel("Data Protection Policy")
        .setStyle(ButtonStyle.Link)
        .setURL("https://scribblelabapp-docs.pages.dev/contributing"),

      new ButtonBuilder()
        .setEmoji("1321236996533784639")
        .setLabel("Roadmap")
        .setStyle(ButtonStyle.Link)
        .setURL("https://scribblelabapp-docs.pages.dev/contributing"),
    );

    await interaction.reply({
      embeds: [embed],
      components: [upperRow, lowerRow],
    });
  },
};
