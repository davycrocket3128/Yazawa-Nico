const Discord = require("discord.js");
const moment = require("moment");
const axios = require("axios");
//  Description: Display rips
//  Usage: rip arg1
exports.run = async (client, message, args, level) => {
  try {
    // Set the rip
    const res = await axios.post('http://localhost:8000/globals/rip', {'discord_id': message.guild.id, 'name': message.guild.name, 'rip': 1 });
    const global = res.data;

    // Send message
    let messages = args.join(" ");

    if (messages) {
      var msg = `${
        message.author.username
      } has paid their respects for ${args.join(" ")}\n${
        global.todaysRips
      } Today, 
      ${global.totalRips} All`;
    } else {
      var msg = `${message.author.username} has paid their respects.\n${
        global.todaysRips
      } Today, ${global.totalRips} All`;
    }

    let embed = new Discord.RichEmbed().setDescription(msg).setColor("#FF4D9C");
    message.channel.send({ embed: embed });

  } catch (error) {
    message.channel.send(`Unable to set rip due to an error. If encountered, please send to developers.\n\`${error}\``);
  }
};

exports.conf = {
  enabled: "true",
  guildOnly: "false",
  aliases: ['f'],
  permLevel: "User"
};

exports.help = {
  name: "rip",
  category: "Fun",
  description: "Rest in Piece",
  usage: "rip <user>"
};
