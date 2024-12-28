//
//  about.js
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
    .setName("about")
    .setDescription(
      "Displays the bot's version, build number, developer information, and uptime",
    ),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("#FF7800")
      .setTitle("About ScribbleCareBear")
      .setDescription(
        "ScribbleCareBear is your friendly utility bot designed to assist with ScribbleLabApp projects. " +
          "It offers tools to streamline workflows, access essential resources, and foster collaboration within the community. " +
          "Learn more about the bot's version, features, and development details below.",
      )
      .addFields(
        { name: "Version", value: config.version, inline: true },
        { name: "Build", value: config.build, inline: true },
        { name: "Uptime", value: `${client.uptime}ms`, inline: true },
        { name: "License", value: `BSD-3 Clause`, inline: true },
        {
          name: "Copyright",
          value: `(c) 2024 - ${new Date().getFullYear()} ScribbleLabApp LLC. - All rights reserved.`,
          inline: true,
        },
        {
          name: "Developer",
          value: `ScribbleLabApp LLC. & Nevio Hirani`,
          inline: true,
        },
      )
      .setFooter({ text: "ScribbleLabApp - Building Together" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setEmoji("1321250194528010252")
        .setLabel("Source Code")
        .setStyle(ButtonStyle.Link)
        .setURL("https://github.com/ScribbleLabApp/ScribbleCareBear"),
      new ButtonBuilder()
        .setEmoji("1321250194528010252")
        .setLabel("Report an Issue")
        .setStyle(ButtonStyle.Link)
        .setURL("https://github.com/ScribbleLabApp/ScribbleCareBear/issues"),
    );
    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
