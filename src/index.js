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

const fs = require("fs");
const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const { registerCommands } = require("./commands");
const { log } = require("./utils/log");
const path = require("path");

const config = JSON.parse(
  fs.readFileSync(__dirname + "/../config.json", "utf8"),
);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Reaction, Partials.User],
});
client.commands = new Map();

const {
  APPLICATION_ID: applicationID,
  TOKEN: token,
  GUILD_ID: guildID,
} = config;

// Export client and config instance for global access
module.exports = { client, config };

client.once(Events.ClientReady, async () => {
  log(`Logged in as ${client.user.tag}`);

  try {
    /*
        Clear guild/global commands to prevent duplicates:
            await clearGlobalCommands(token, applicationID);
            await clearGuildCommands(token, applicationID, guildID);
        */
    // Register commands once when ScribbleCareBear becomes ready
    const commands = await registerCommands(token, applicationID, guildID);
    client.commands.clear();
    commands.forEach((cmd) => client.commands.set(cmd.data.name, cmd));

    log(
      `[SCB]: Registered commands: ${Array.from(client.commands.keys()).join(", ")}`,
    );
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
    await interaction.reply({
      content:
        "An unexpected error occured while executing this command.\nTry again later. If this issue persists, contact ScribbleLabApp Support.",
      ephemeral: true,
    });
  }

  // |=============================================================================================|
  // |   MARK: - Resolve button                                                                    |
  // |=============================================================================================|

  if (!interaction.isButton()) return;

    switch (interaction.customId) {
        case "mark_as_resolved":
            const thread = interaction.channel;
            if (!thread.isThread()) return;

            try {
                const newThreadName = `✅ [SCB Resolved] ${thread.name}`;
                await thread.setName(newThreadName);

                await thread.setLocked(true);
                await thread.setArchived(true);

                await interaction.reply({ 
                    content: "✅ This thread has been marked as resolved, renamed, and is now closed.", 
                    ephemeral: true 
                });
            } catch (error) {
                console.error("Error marking thread as resolved:", error);
                await interaction.reply({ 
                    content: "❌ Unable to mark this thread as resolved. Please try again.", 
                    ephemeral: true 
                });
            }
            break;

        default:
            console.warn(`Unhandled button interaction: ${interaction.customId}`);
            break;
    }
});

// |=============================================================================================|
// |   MARK: - Event Loading                                                                     |
// |=============================================================================================|

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.name && typeof event.execute === "function") {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        log(`Loaded event: ${event.name}`);
    } else {
        console.warn(`Event file "${file}" is missing required properties.`);
    }
}

// |=============================================================================================|
// |                                                                                             |
// |=============================================================================================|

client.login(token);

// |=============================================================================================|
// |   MARK: - Event logging                                                                     |
// |=============================================================================================|

const { EmbedBuilder } = require('discord.js');

const loggingChannelId = "1322316264919666859";

const sendLog = async (client, message) => {
  const logChannel = await client.channels.fetch(loggingChannelId);
  if (logChannel) {
    await logChannel.send({ embeds: [message] });
  } else {
    console.error('Log channel not found!');
  }
};

client.on(Events.MessageDelete, async (message) => {
  if (message.partial) {
    return;
  }

  const logEmbed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('Message Deleted')
    .setDescription(`A message by ${message.author.tag} was deleted.`)
    .addFields(
      { name: 'Message Content', value: message.content || 'No content' },
      { name: 'Channel', value: message.channel.name },
      { name: 'Message ID', value: message.id },
    )
    .setTimestamp();

  await sendLog(client, logEmbed);
});

client.on(Events.MessageUpdate, async (oldMessage, newMessage) => { // 'messageUpdate'
  if (oldMessage.partial || newMessage.partial) {
    return;
  }

  const logEmbed = new EmbedBuilder()
    .setColor('#FFAA00')
    .setTitle('Message Edited')
    .setDescription(`A message by ${oldMessage.author.tag} was edited.`)
    .addFields(
      { name: 'Before', value: oldMessage.content || 'No content' },
      { name: 'After', value: newMessage.content || 'No content' },
      { name: 'Channel', value: newMessage.channel.name },
      { name: 'Message ID', value: newMessage.id },
    )
    .setTimestamp();

  await sendLog(client, logEmbed);
});

client.on(Events.GuildMemberAdd, async (member) => { // 'guildMemberAdd'
  const logEmbed = new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('Member Joined')
    .setDescription(`${member.user.tag} has joined the server.`)
    .addFields(
      { name: 'Member ID', value: member.id },
      { name: 'Account Created', value: member.user.createdAt.toDateString() },
    )
    .setTimestamp();

  await sendLog(client, logEmbed);
});

client.on(Events.GuildMemberRemove, async (member) => { // 'guildMemberRemove'
  const logEmbed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('Member Left')
    .setDescription(`${member.user.tag} has left the server.`)
    .addFields(
      { name: 'Member ID', value: member.id },
      { name: 'Account Created', value: member.user.createdAt.toDateString() },
    )
    .setTimestamp();

  await sendLog(client, logEmbed);
});

client.on(Events.GuildBanAdd, async (guild, user) => { // 'guildBanAdd'
  const logEmbed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('User Banned')
    .setDescription(`${user.tag} has been banned from the server.`)
    .addFields(
      { name: 'User ID', value: user.id },
      { name: 'Account Created', value: user.createdAt.toDateString() },
    )
    .setTimestamp();

  await sendLog(client, logEmbed);
});

client.on(Events.GuildBanRemove, async (guild, user) => { // 'guildBanRemove'
  const logEmbed = new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('User Unbanned')
    .setDescription(`${user.tag} has been unbanned from the server.`)
    .addFields(
      { name: 'User ID', value: user.id },
      { name: 'Account Created', value: user.createdAt.toDateString() },
    )
    .setTimestamp();

  await sendLog(client, logEmbed);
});

client.on('guildMemberKick', async (guild, user) => {
  const logEmbed = new EmbedBuilder()
    .setColor('#FF5500')
    .setTitle('User Kicked')
    .setDescription(`${user.tag} has been kicked from the server.`)
    .addFields(
      { name: 'User ID', value: user.id },
      { name: 'Account Created', value: user.createdAt.toDateString() },
    )
    .setTimestamp();

  await sendLog(client, logEmbed);
});