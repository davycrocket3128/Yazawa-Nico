// This event executes when a new member leaves a server.
const Discord = require("discord.js");
const axios = require('axios');
const Canvas = require('canvas');
const moment = require('moment');

module.exports = async (client, member) => {
  // Load the guild's settings
  // console.log(member.guild);
  try {
    const guildRes = await axios.post('http://localhost:8000/guilds/profile', 
    {'discord_id': member.guild.id, 'name': member.guild.name });
    const guild = guildRes.data.guild;

    const channel = member.guild.channels.find(ch => ch.id === guild.leaveChannel);

    if (guild.leaveEnabled && guild.leaveChannel !== null) {
      const msg = guild.leaveMessage.replace("<user>", member.user.username);

      channel.send(msg);

      // Modlog
      try {
        const modLogChannel = channel.guild.channels.find(ch => ch.id === guild.modLogChannel);
    
        if (guild.modlog && modLogChannel !== null) {
          try {
            let embed = new Discord.RichEmbed()
              .setDescription(`**Member Left:** ${member.user.username}#${member.user.discriminator}`)
              .setThumbnail(member.user.displayAvatarURL)
              .setTimestamp()
              .setColor("#FF4D9C");
            
            // Send the deleted message to the modlog channel
            modLogChannel.send(embed).catch(console.error);

            // client.logger.error("Getting audit logs");
            // const entry = await message.guild.fetchAuditLogs({type: 'MEMBER_KICK'});

            // client.logger.error(entry);

          } catch (e) {
            client.logger.error(`[guildMemberAdd.js]: Embed: ${e}`);
            client.channel.send(`Unable to show leave log due to an error. If encountered, please send to developers. (!support to get invite link) \n\`[${moment().utc()}] [guildMemberAdd.js]: Embed: | ${e.response}\``);
          }
        }
    
      } catch (e) {
        client.logger.error(`[guildMemberRemove.js]: Modlog: ${e}`);
        client.channel.send(`Unable to show leave log due to an error. If encountered, please send to developers. (!support to get invite link) \n\`[${moment().utc()}] [guildMemberAdd.js]: Modlog: | ${e.response}\``);
      }
    }
  
} catch (e) {
  client.logger.error(`[guildMemberRemove.js]: ${e}`);
}
};
