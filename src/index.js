//
//  index.js
//  ScribbleCareBear Core
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

const fs  = require("fs");
//const cmd = require("./commands.js")
//const cmd = require("./commands")

const { 
    Client, 
    Events, 
    GatewayIntentBits, 
    SlashCommandBuilder, 
    REST, 
    Routes 
} = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const config = JSON.parse(fs.readFileSync(__dirname + "/../config.json", "utf8"));

const applicationID = config.APPLICATION_ID;
const publicKey = config.PUBLIC_KEY;
const token = config.TOKEN;

const guildID = config.GUILD_ID;

client.once(Events.ClientReady, async c => {

    const commands = [
        new SlashCommandBuilder()
            .setName("ping")
            .setDescription(
                "Displays the bot's latency and response time"
            ),
        new SlashCommandBuilder()
            .setName("about")
            .setDescription(
                "Displays the bot's version, build number, developer information, and uptime"
            )
    ].map(command => command.toJSON());

    const rest = new REST({ version: "10" }).setToken(token);

    try {
        await rest.put(
            Routes.applicationCommands(applicationID, guildID),
            { body: commands }
        );
    } catch (error) {
        console.error(error);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === "ping") {
        const latency = Date.now() - interaction.createdTimestamp;
        await interaction.reply({ content: `Pong! Latency: ${latency}ms. API Latency: ${client.ws.ping}ms` });
    }
    if (interaction.commandName === "about") {
        await interaction.reply({
            content: `ScribbleCareBear Version: ${config.version} (Build ${config.build})\nDeveloped by ${config.developer}\nUptime: ${client.uptime}ms`
        });
    }
});

client.login(token);