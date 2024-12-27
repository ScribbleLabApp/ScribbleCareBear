//
//  leaderboard.js
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

const axios = require("axios");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription(
      "We use leaderboards to list the community's most helpful members.",
    ),

  async execute(interaction) {
    let leaderboardData = [];

    try {
      const response = await axios.get(
        "http://localhost:3000/v0/scribblecarebear/leaderboard",
      );
      leaderboardData = response.data;
    } catch (error) {
      console.error("Error fetching leaderboard data from API:", error);
      return interaction.reply({
        content: "There was an error fetching the leaderboard data.",
        ephemeral: true,
      });
    }

    if (!Array.isArray(leaderboardData) || leaderboardData.length === 0) {
      return interaction.reply({
        content: "No leaderboard data available at the moment.",
        ephemeral: true,
      });
    }

    const top10 = leaderboardData.slice(0, 10);

    const leaderboardEmbed = new EmbedBuilder()
      .setColor("#FF7800")
      .setTitle("🌟 Community Leaderboard 🌟")
      .setDescription(
        "Here are the most helpful members of our community! Keep it up! 💪",
      )
      .setTimestamp()
      .setFooter({ text: "Leaderboard updated hourly" });

    top10.forEach((member, index) => {
      const badge =
        index === 0
          ? "🥇"
          : index === 1
            ? "🥈"
            : index === 2
              ? "🥉"
              : `#${index + 1}`;

      leaderboardEmbed.addFields({
        name: `${badge}`,
        value: `**Points**: ${member.coins} - <@${member.discordId}>`,
        inline: false,
      });
    });

    try {
      await interaction.reply({
        embeds: [leaderboardEmbed],
      });
    } catch (err) {
      console.error("Error replying to interaction:", err);
    }
  },
};
