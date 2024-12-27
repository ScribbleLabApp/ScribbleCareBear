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
const { client } = require("./../index");
const { log } = require("./../utils/log");
const { Events } = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

// |=============================================================================================|
// |   MARK: - Global                                                                            |
// |=============================================================================================|

const COINS_ADD_URL = "http://localhost:3000/v0/scribblecarebear/add-coins";
const COINS_GET_URL = "http://localhost:3000/v0/scribblecarebear/get-coins";
const LEADERBOARD_POSITION_URL =
  "http://localhost:3000/v0/scribblecarebear/leaderboard-position";
const validEmojis = [
  "🪙",
  "👌",
  "🍻",
  "1322185634718158959",
];

// |=============================================================================================|
// |   MARK: - Slash command Builder                                                             |
// |=============================================================================================|

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shoutout")
    .setDescription("Give a shoutout to a user and reward them with stars! ⭐️")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to give a shoutout to")
        .setRequired(true),
    ),
  async execute(interaction) {
    const recipient = interaction.options.getUser("user");

    if (recipient.bot) {
      return interaction.reply({
        content: "You can't give a shoutout to a bot!",
        ephemeral: true,
      });
    }

    if (recipient.id === interaction.user.id) {
      return interaction.reply({
        content: "You can't give yourself a shoutout!",
        ephemeral: true,
      });
    }

    try {
      const coinsToAdd = 5;

      console.log(`[SCB - VALIDATION - DEV]: DiscordUserId is ${recipient.id}`);

      await axios.post(COINS_ADD_URL, {
        discordId: recipient.id,
        amount: coinsToAdd,
      });

      const userCoinsResponse = await axios.get(
        `${COINS_GET_URL}/${recipient.id}`,
      );
      const leaderboardPositionResponse = await axios.get(
        `${LEADERBOARD_POSITION_URL}/${recipient.id}`,
      );

      const totalCoins = userCoinsResponse.data;
      const leaderboardPosition = leaderboardPositionResponse.data.position;

      const shoutoutEmbed = new EmbedBuilder()
        .setColor(0xff7800)
        .setTitle("🎉 Shoutout Received!")
        .setDescription(`**${recipient.tag}**, you've received a shoutout!`)
        .addFields(
          {
            name: "Coins Earned",
            value: `${coinsToAdd} 🪙`,
            inline: true,
          },
          { name: "Total Coins", value: `${totalCoins} 🪙`, inline: true },
          {
            name: "Leaderboard Rank",
            value: `#${leaderboardPosition} 🏆`,
            inline: true,
          },
        )
        .setFooter({
          text: "Keep shining and earning more coins!",
          iconURL: recipient.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      await interaction.reply({ embeds: [shoutoutEmbed] });
    } catch (error) {
      console.error("[SCB]: Error handling the shoutout:", error);
      await interaction.reply({
        content:
          "Oops! There was an error while processing the shoutout. Please try again later.",
        ephemeral: true,
      });
    }
  },
};

// |=============================================================================================|
// |   MARK: - MessageReaction Event Handler                                                     |
// |=============================================================================================|

// Valid emojis for shoutouts: ["🪙", "👌", "🚀", "1321236996533784639", "1322185634718158959"]

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  try {
    if (user.bot) return;

    if (reaction.partial) await reaction.fetch();

    const emoji = reaction.emoji.id || reaction.emoji.name;
    if (!validEmojis.includes(emoji)) return;

    const recipient = reaction.message.author;

    if (recipient.bot || recipient.id === user.id) {
      console.log("[SCB]: Ignoring self-reaction or reaction on bot message.");
      return;
    }

    const coinsToAdd = 5;

    await axios.post(COINS_ADD_URL, {
      discordId: recipient.id,
      amount: coinsToAdd,
    });

    const userCoinsResponse = await axios.get(
      `${COINS_GET_URL}/${recipient.id}`,
    );
    const leaderboardPositionResponse = await axios.get(
      `${LEADERBOARD_POSITION_URL}/${recipient.id}`,
    );

    const totalCoins = userCoinsResponse.data;
    const leaderboardPosition = leaderboardPositionResponse.data.position;

    const shoutoutEmbed = new EmbedBuilder()
      .setColor(0xff7800)
      .setTitle("🎉 Shoutout Received!")
      .setDescription(`**${recipient.tag}**, you've received a shoutout!`)
      .addFields(
        {
          name: "Coins Earned",
          value: `${coinsToAdd} 🪙`,
          inline: true,
        },
        { name: "Total Coins", value: `${totalCoins} 🪙`, inline: true },
        {
          name: "Leaderboard Rank",
          value: `#${leaderboardPosition} 🏆`,
          inline: true,
        },
      )
      .setFooter({
        text: "Keep shining and earning more coins!",
        iconURL: recipient.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await reaction.message.channel.send({ embeds: [shoutoutEmbed] });
  } catch (error) {
    console.error("Error handling the reaction shoutout:", error);
  }
});
