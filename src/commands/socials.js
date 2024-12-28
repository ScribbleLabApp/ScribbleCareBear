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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("socials")
    .setDescription("Displays an overview of ScribbleLabApp's social accounts"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("#FF7800")
      .setTitle("ScribbleLabApp Social Accounts")
      .setDescription(
        "We're excited to announce that ScribbleLab is now active on social media! Follow us to stay updated on new features, get helpful tips on maximizing the potential of our app, and enjoy a behind-the-scenes look at our projects. Connect with us, share your feedback, and be part of our growing community!",
      );

    // Creating an ActionRowBuilder instance
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setEmoji("1321249437829435443")
        .setLabel("YouTube")
        .setStyle(ButtonStyle.Link)
        .setURL("https://www.youtube.com/@scribblelabappofficial"),

      new ButtonBuilder()
        .setEmoji("1321249149613506676")
        .setLabel("Twitter")
        .setStyle(ButtonStyle.Link)
        .setURL("https://x.com/scribblelabapp"),

      new ButtonBuilder()
        .setEmoji("1321248310735933541")
        .setLabel("Instagram")
        .setStyle(ButtonStyle.Link)
        .setURL("https://www.instagram.com/scribblelabappofficial"),

      new ButtonBuilder()
        .setEmoji("1321249906408816742")
        .setLabel("TikTok")
        .setStyle(ButtonStyle.Link)
        .setURL("https://www.tiktok.com/@scribblelabappofficial"),

      new ButtonBuilder()
        .setEmoji("1321250194528010252")
        .setLabel("GitHub")
        .setStyle(ButtonStyle.Link)
        .setURL("https://github.com/ScribbleLabApp"),
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
