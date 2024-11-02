//
//  commands.js
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

const fs = require("fs");
const path = require("node:path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
const { log } = require("./utils/log")

/**
 * Loads and retrieves all command data from the specified directory.
 *
 * @param {string} dir - The directory path to search for command files.
 * @returns {Array} An array of command objects ready for use.
 */
function loadCommands(dir) {

    /*
    const commandFiles = fs.readdirSync(dir, { withFileTypes: true })
        .flatMap((file) => file.isDirectory()
            ? loadCommands(path.join(dir, file.name))
            : file.name.endsWith(".js") ? [path.join(dir, file.name)] : []);

    const commands = commandFiles.map((file) => {
        const command = require(file);
        if (typeof command.execute !== "function" || !command.data) {
            throw new Error(`The command at ${file} is not structured properly.`);
        }
        return command;
    });

    console.log(`[SCB]: Loaded ${commands.length} commands`);
    return commands;
    */

    // TODO: Add subdir ability

    const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith(".js"));
    const commands = [];

    for (const file of commandFiles) {
        const command = require(path.join(dir, file));
        if (command.data && command.execute) {
            commands.push(command);
        } else {
            log(`[SCB]: Command file ${file} is missing 'data' or 'execute'.`);
        }
    }

    return commands;
}

/**
 * Registers commands with the Discord API.
 *
 * @param {string} token - The bot's token.
 * @param {string} applicationID - The application's ID.
 * @param {string} guildID - The guild ID for command registration.
 * @returns {Promise<Array>} A promise that resolves with the registered commands.
 */
async function registerCommands(token, applicationID, guildID) {
    const commandsDir = path.join(__dirname, "commands");
    const commands = loadCommands(commandsDir);

    const serializedCommands = commands.map((cmd) => cmd.data.toJSON());

    const rest = new REST({ version: "10" }).setToken(token);

    try {
        log("[SCB]: Registering new commands...");
        await rest.put(
            Routes.applicationCommands(applicationID, guildID),
            { body: serializedCommands }
        );

        log("[SCB]: Successfully registered application commands!");

        return commands;
    } catch (e) {
        log(`[SCB]: Error registering commands: ${e}`);
        throw e;
    }
}

async function clearGlobalCommands(token, applicationID) {
    const rest = new REST({ version: "10" }).setToken(token);

    try {
        await rest.put(
            Routes.applicationCommands(applicationID), 
            { body: [] }
        );

        log("[SCB]: Successfully cleared global commands!");
    } catch (e) {
        log(`[SCB]: Error clearing global commands: ${e}`);
    }
}

async function clearGuildCommands(token, applicationID, guildID) {
    const rest = new REST({ version: "10" }).setToken(token);

    try {
        await rest.put(
            Routes.applicationGuildCommands(applicationID, guildID), 
            { body: [] }
        );

        log("[SCB]: Successfully cleared guild commands!");
    } catch (e) {
        log(`[SCB]: Error clearing guild commands: ${e}`);
    }
}

module.exports = { loadCommands, registerCommands, clearGlobalCommands, clearGuildCommands };