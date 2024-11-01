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
const { registerCommands } = require("./commands");
const { log } = require("./utils/log");
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

client.commands = new Map();

client.once(Events.ClientReady, async (c) => {
    log(`Logged in as ${c.user.tag}`);

    try {
        const commands = await registerCommands(token, applicationID, guildID);
        commands.forEach(command => {
            // Ensure command names are unique
            if (!client.commands.has(command.name)) {
                client.commands.set(command.name, command);
            } else {
                log(`[SCB]: Duplicate command found: ${command.name}`);
            }
        });
        log(`[SCB]: Registered commands: ${Array.from(client.commands.keys()).join(", ")}`);
    } catch (error) {
        log(`[SCB]: Failed to register commands: ${error}`);
    }
});

client.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        log(`[SCB]: Command not found: ${interaction.commandName}`);
        return;
    }

    try {
        log(`[SCB]: Executing command: ${command.name}`);
        command.execute(interaction);
    } catch (e) {
        log(`[SCB]: Interaction execution failed: ${e}`);
    }
});

client.login(token);