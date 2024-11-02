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
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { registerCommands } = require("./commands");
const { log } = require("./utils/log");
const config = JSON.parse(
    fs.readFileSync(__dirname + "/../config.json", "utf8")
);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Map();

const { APPLICATION_ID: applicationID, TOKEN: token, GUILD_ID: guildID } = config;

// Export client and config instance for global access
module.exports = { client, config };

client.once(Events.ClientReady, async () => {
    log(`Logged in as ${client.user.tag}`);
    
    try {
        //await clearGlobalCommands(token, applicationID);
        //await clearGuildCommands(token, applicationID, guildID);

        // Register commands once when ScribbleCareBear becomes ready
        const commands = await registerCommands(token, applicationID, guildID);
        client.commands.clear();        //< Populate the commands map
        commands.forEach((cmd) => client.commands.set(cmd.data.name, cmd));

        log(`[SCB]: Registered commands: ${Array.from(client.commands.keys()).join(", ")}`);
    } catch (error) {
        log(`[SCB]: Failed to register commands: ${error}`);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        log(`[SCB]: Command not found: ${interaction.commandName}`);
        await interaction.reply({ content: "Command not found", ephemeral: true });
        return;
    }

    try {
        log(`[SCB]: Executing command: ${command.data.name}`);
        await command.execute(interaction);
    } catch (e) {
        log(`[SCB]: Interaction execution failed: ${e}`);
        await interaction.reply({ content: "An unexpected error occured while executing this command.\nTry again later. If this issue persists, contact ScribbleLabApp Support.", ephemeral: true });
    }
});

client.login(token);
