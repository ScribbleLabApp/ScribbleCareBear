//
//  healthcheck.js
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
const axios = require("axios");
const https = require("https");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("healthcheck")
    .setDescription(
      "Check the health of ScribbleLabApp's Services to detect downtimes.",
    ),
  async execute(interaction) {
    const services = [
      {
        name: "ScribbleCareBear API",
        url: "http://localhost:3000/v0/scribblecarebear/",
        type: "api",
      },
      { name: "ScribbleCareBear Webhook Service", url: "", type: "api" },
      { name: "ScribbleLab ID", url: "", type: "api" },
      { name: "Scribble OTA (UpdateService)", url: "", type: "api" },
      {
        name: "ScribbleLabApp Website",
        url: "https://scribblelabapp.pages.dev/",
        type: "website",
      },
      {
        name: "ScribbleLabApp Docs",
        url: "https://scribblelabapp-docs.pages.dev/",
        type: "website",
      },
      {
        name: "Scribble API v0 (EU Central)",
        url: "https://scribbleapi.onrender.com/v0/",
        type: "api",
      },
      { name: "ScribbleLabAppDB (EU Central)", url: "", type: "api" },
      { name: "ScribbleLabAppDB I/O", url: "", type: "api" },
    ];

    const statuses = await Promise.all(
      services.map(async (service) => {
        if (!service.url) {
          return { name: service.name, value: "🔵 Unknown", inline: true };
        }

        if (service.type === "api") {
          // Check API status with axios
          try {
            const response = await axios.get(service.url, { timeout: 5000 });
            if (response.status >= 200 && response.status < 300) {
              return { name: service.name, value: "✅ Online", inline: true };
            } else {
              return { name: service.name, value: "🔴 Offline", inline: true };
            }
          } catch (error) {
            return { name: service.name, value: "🔵 Unknown", inline: true };
          }
        } else if (service.type === "website") {
          return new Promise((resolve) => {
            const request = https.get(service.url, (res) => {
              if (res.statusCode === 200) {
                resolve({
                  name: service.name,
                  value: "✅ Online",
                  inline: true,
                });
              } else {
                resolve({
                  name: service.name,
                  value: "🔴 Offline",
                  inline: true,
                });
              }
            });

            request.on("error", () => {
              resolve({
                name: service.name,
                value: "🔵 Unknown",
                inline: true,
              });
            });

            request.end();
          });
        }
      }),
    );
    const embed = new EmbedBuilder()
      .setColor("#FF7800")
      .setTitle("ScribbleLabApp Health Check")
      .setDescription(
        "Check the current status of critical services. If a service is down, appropriate actions will be taken.",
      )
      .addFields(...statuses)
      /*
      .addFields(
        {
          name: "ScribbleCareBear Operational Status",
          value: "✅ Online",
          inline: true,
        },
        { name: "ScribbleCareBear API", value: "✅ Operational", inline: true },
        {
          name: "ScribbleCareBear Webhook Service",
          value: "✅ Functional",
          inline: true,
        },
        { name: "ScribbleLab ID", value: "✅ Active", inline: true },
        {
          name: "Scribble OTA (UpdateService)",
          value: "✅ Up-to-date",
          inline: true,
        },
        { name: "ScribbleLabApp Website", value: "✅ Online", inline: true },
        { name: "ScribbleLabApp Docs", value: "✅ Available", inline: true },
        {
          name: "Scribble API v0 (EU Central)",
          value: "✅ Online",
          inline: true,
        },
        {
          name: "ScribbleLabAppDB (EU Central)",
          value: "✅ Healthy",
          inline: true,
        },
        { name: "ScribbleLabAppDB I/O", value: "✅ Normal", inline: true },
      )
      */
      .setFooter({ text: "ScribbleLabApp Health Check" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("View Detailed Status")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://scribblelabapp.pages.dev/status`),
    );

    await interaction.deferReply({
      ephemeral: false,
    });

    await interaction.editReply({
      content: "Here's the current health check for ScribbleLabApp's services:",
      embeds: [embed],
      components: [row],
      ephemeral: false,
    });
  },
};
