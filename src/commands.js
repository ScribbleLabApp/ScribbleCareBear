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
const main = require("./index")

const { log } = require("./utils/log")
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");

/**
 * Loads and retrieves all command data from the specified directory.
 *
 * @param {string} dir - The directory path to search for command files.
 * @returns {Array} An array of command data objects ready for registration.
 */
function loadCommands(dir) {
    function getFiles(directory) {
        const files = fs.readdirSync(directory, { withFileTypes: true });
        let commandFiles = [];

        for (const file of files) {
            if (file.isDirectory()) {
                commandFiles.push(...getFiles(path.join(directory, file.name)));
            } else if (file.name.endsWith(".js")) {
                commandFiles.push(path.join(directory, file.name));
            }
        }

        return commandFiles;
    }

    const commandFiles = getFiles(dir);
    //const commands = commandFiles.map(file => require(file).data.toJSON());
    const commands = commandFiles.map(file => {
        const command = require(file);

        if (typeof command.execute !== "function") {
            log(`The command at ${file} does not have an execute function.`);
            throw new Error(`The command at ${file} does not have an execute function.`);
        }
        return {
            name: command.data.name,
            description: command.data.description,
            execute: command.execute,
            data: command.data.toJSON()
        };
    });

    log(`[SCB]: Loaded commands: ${JSON.stringify(commands)}`);

    return commands;
}

//const commandsDir = path.join(__dirname, "commands");
//const commands = loadCommands(commandsDir);

/**
 * Registers commands with the Discord API.
 *
 * @param {string} token - The bot's token.
 * @param {string} applicationID - The application's ID.
 * @param {string} guildID - The guild ID where the commands will be registered.
 */
async function registerCommands(token, applicationID, guildID) {
    const commandsDir = path.join(__dirname, "commands");
    const commands = loadCommands(commandsDir);

    const rest = new REST({ version: "10" }).setToken(token);

    try {
        await rest.put(
            Routes.applicationGuildCommands(applicationID, guildID),
            { body: commands }
        );
        log("[SCB]: Successfully registered application commands!");
        return commands;
    } catch (e) {
        log(`[SCB]: Error registering commands: ${e}`);
        throw e;
    }
}

module.exports = { loadCommands, registerCommands };