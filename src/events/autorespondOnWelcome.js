//
//  autorespondOnWelcome.js
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

const { Events, EmbedBuilder } = require('discord.js');
const { log } = require("../utils/log");
const communityGeneralChannelId = "1271081597055275041";

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        if (member.user.bot) return;

        try {
            const welcomeChannel = await member.guild.channels.fetch(communityGeneralChannelId);

            if (!welcomeChannel) {
                console.error('Error: Welcome channel not found!');
                return;
            }

            const welcomeEmbed = new EmbedBuilder()
                .setColor("#FF7800")
                .setTitle(`Welcome to the ScribbleLabApp Community, ${member.user.username}!`)
                .setDescription(
                    `Hello and thank you for joining the ScribbleLabApp Community Server! <:scribblelabheart:1321236996533784639> We're excited to have you here.\n\nScribbleLab is an innovative text editor designed by students, for students, offering a seamless cross-platform experience across iOS, macOS, and visionOS. With its sleek design and essential academic tools, ScribbleLab is the perfect companion for organizing, creating, and collaborating on your academic journey.\n\nScribbleLab is not just about the app, but the community behind it. In our server, you'll find a space to:\n\n- Share your ideas and suggestions to enhance ScribbleLab\n- Report bugs and discuss new features\n- Connect with like-minded students and developers passionate about productivity and creativity.`
                )
                .addFields(
                    { name: 'Getting Started', value: 'Check out <#1271087878713380946> & <#1321181503232671825> to start engaging with the community.' },
                    { name: 'Need Help?', value: 'If you have any questions, visit <#1321181503232671825> or ask in <#1321181454276755517>.' },
                    { name: 'Rules', value: 'Please be sure to read the **rules** in <#1271087878713380946> before participating.' },
                    { name: 'Username', value: member.user.username, inline: true },
                    { name: 'User ID', value: member.user.id, inline: true }
                )
                .setFooter({
                    text: "We're thrilled to have you with us! Feel free to introduce yourself and start exploring!",
                    iconURL: member.guild.iconURL({ dynamic: true }),
                })
                .setImage('https://github.com/ScribbleLabApp/ScribbleCareBear/blob/main/assets/welcome-sca.png')
                .setTimestamp();

            log('Sending welcome embed...');
            await welcomeChannel.send({ embeds: [welcomeEmbed] });
            log('Embed sent successfully!');
        } catch (error) {
            console.error('Error sending welcome embed:', error);
        }
    },
};