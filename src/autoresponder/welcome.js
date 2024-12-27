const { EmbedBuilder } = require('discord.js');

client.on('guildMemberAdd', async (member) => {
  if (member.user.bot) return;

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
    )
    .setFooter({
      text: "We're thrilled to have you with us! Feel free to introduce yourself and start exploring!",
      iconURL: member.guild.iconURL({ dynamic: true }),
    })
    .setImage('https://your-image-url.com/image.png')
    .setTimestamp();

  const welcomeChannel = member.guild.channels.cache.get('1271081597055275041');
  if (welcomeChannel) {
    await welcomeChannel.send({ embeds: [welcomeEmbed] });
  }
});