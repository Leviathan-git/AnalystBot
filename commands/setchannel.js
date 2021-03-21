const dataFile = new (require('../util/file'))('data.json');

module.exports = {
  command: 'setchannel',
  dm: false,
  permissions: (member) => {
    return (
      member.id == '780481685975990313' || member.id == '401376663541252096'
    );
  },
  async execute(bot, msg, args) {
    if (!args[0])
      return msg.channel.send('Please enter an alias for this channel.');

    const data = dataFile.read();

    if (data.channels.some((c) => c.alias == args[0])) {
      return msg.channel.send('Alias already exists.');
    } else {
      data.channels.push({
        alias: args[0],
        id: msg.channel.id,
        subscriptions: []
      });

      msg.channel.send('Alias added for this channel.');
    }

    dataFile.write(data);
  }
};
