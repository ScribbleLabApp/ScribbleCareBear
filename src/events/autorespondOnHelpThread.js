//
//  autorespondOnHelpThread.js
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
//  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
//  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
//  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
//  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
//  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
//  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
//  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events } = require("discord.js");
const { log } = require("../utils/log");
const { client } = require("../index");
const supportThreadCategoryId = "1321181454276755517";

module.exports = {
    name: 'threadCreate',
    execute: async (client, thread) => {
        if (thread.parentId !== supportThreadCategoryId) return;

        const supportEmbed = new EmbedBuilder()
            .setColor("#3498db")
            .setTitle("🛠️ Need Help with Our Products?")
            .setDescription(
                "Welcome to the ScribbleLabApp Support Thread! Here's how to get started:\n\n" +
                "- **Describe your issue clearly** so we can assist you better.\n" +
                "- **Provide screenshots or details** about the product you're using.\n" +
                "- **Be patient** as our team or community members respond.\n\n" +
                "Need help navigating our resources? Check out our [Support Guide](https://scribblelabapp.pages.dev/support)."
            )
            .addFields(
                { 
                    name: "Before Posting", 
                    value: "<:s1:1321239087612428378> Search for similar issues in our [FAQs](https://scribblelabapp.com/faq).\n<:s2:1321239085943226369> Make sure your product is up-to-date.\n<:s3:1321239084295000216> Provide as much detail as possible." 
                },
                { 
                    name: "Issue Resolved?", 
                    value: "Click the button below to mark the thread as resolved and close it." 
                }
            )
            .setFooter({
                text: "Thank you for using ScribbleLabApp!",
                iconURL: thread.guild.iconURL({ dynamic: true }),
            });

        const resolveButton = new ButtonBuilder()
            .setCustomId("mark_as_resolved")
            .setLabel("Mark as Resolved")
            .setStyle(ButtonStyle.Success)
            .setEmoji("✅");

        const actionRow = new ActionRowBuilder().addComponents(resolveButton);

        try {
            await thread.send({ embeds: [supportEmbed], components: [actionRow] });
            log("Support embed with resolve button sent successfully!");
        } catch (error) {
            console.error("Error sending support embed:", error);
        }
    },
};

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "mark_as_resolved") {
        const thread = interaction.channel;
        if (!thread.isThread()) return;

        try {
            const newThreadName = `✅ [SCB Resolved] ${thread.name}`;
            await thread.setName(newThreadName);

            await thread.setLocked(true);
            await thread.setArchived(true);

            await interaction.reply({ content: "✅ This thread has been marked as resolved, renamed, and is now closed.", ephemeral: true });
        } catch (error) {
            console.error("Error marking thread as resolved:", error);
            await interaction.reply({ content: "❌ Unable to mark this thread as resolved. Please try again.", ephemeral: true });
        }
    }
});