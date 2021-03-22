const { MessageEmbed } = require('discord.js');
const { PREFIX } = require('./../util/globals.js');
const dataFile = new (require('../util/file'))('data.json');

let recentCommands = [];

module.exports = async (bot, msg) => {
  const data = dataFile.read();

  const channel = data.channels.find((c) => c.id == msg.channel.id);

  if (channel) {
    let mention = false;
    let color =
      msg.content.includes('BTO') || msg.content.includes('BUY')
        ? '#39C45E'
        : msg.content.includes('STC') || msg.content.includes('SELL')
        ? '#D13232'
        : null;
    if (msg.content.startsWith(data.prefix)) {
      msg.content = msg.content.slice(data.prefix.length);
      mention = true;
    }
    const embed = new MessageEmbed()
      .setDescription(msg.content)
      .setImage(msg.attachments.first()?.proxyURL)
      .setFooter(
        'Options Wizards',
        'https://media.discordapp.net/attachments/780486233482723396/822957571835953163/wizard-1454385_640_2.png'
      )
      .setTimestamp();

    for (let subscription of channel.subscriptions) {
      const subscribedChannel = bot.channels.cache.get(subscription.id);
      embed.setColor(color || subscription.color);
      subscribedChannel.send('', {
        content: mention ? subscription.role : null,
        embed
      });
    }
  }

  if (msg.author.bot) return;

  let args = [].concat
    .apply(
      [],
      msg.content
        .slice(PREFIX.length)
        .trim()
        .split('"')
        .map(function (v, i) {
          return i % 2 ? v : v.split(' ');
        })
    )
    .filter(Boolean);
  let message = msg.content.substring(0);

  if (message.substring(0, PREFIX.length) == PREFIX) {
    const command =
      bot.commands.get(args[0]) ||
      bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(args[0]));

    if (command) {
      try {
        if (command.guild && !msg.guild) {
          return msg.channel.send('You can only use this command in a server.');
        }
        if (command.permissions && !command.permissions(msg.member)) {
          return msg.channel.send('Access denied.');
        }
        if (command.dm && msg.guild) {
          return msg.channel.send('You can only use this command in DMs.');
        }
        if (recentCommands.includes(`${msg.author.id}-${command.name}`)) {
          return msg.channel.send(
            command.cdMsg
              ? command.cdMsg
              : 'You are using this command too quicky!'
          );
        }

        recentCommands.push(`${msg.author.id}-${command.name}`);
        setTimeout(
          () => {
            recentCommands = recentCommands.filter(
              (c) => c != `${msg.author.id}-${command.name}`
            );
          },
          command.cooldown ? command.cooldown : 1000
        );

        await command.execute(
          bot,
          msg,
          args.slice(1).filter((a) => a != ''),
          () => {
            recentCommands = recentCommands.filter(
              (c) => c != `${msg.author.id}-${command.name}`
            );
          }
        );
      } catch (err) {
        console.error(err);
        msg.channel.send(
          `There was an error trying to execute the ${args[0]} command!`
        );
      }
    }
  }
};
