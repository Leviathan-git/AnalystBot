const dataFile = new (require('../util/file'))('data.json');

module.exports = {
  command: 'subscribe',
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

    if (!data.channels.some((c) => c.alias == args[0])) {
      return msg.channel.send('Alias not found.');
    } else if (
      data.channels
        .find((c) => c.alias == args[0])
        .subscriptions.some((s) => s.id == msg.channel.id)
    ) {
      data.channels.find(
        (c) => c.alias == args[0]
      ).subscriptions = data.channels
        .find((c) => c.alias == args[0])
        .subscriptions.filter((s) => s.id != msg.channel.id);
      msg.channel.send('Channel successfully unsubscribed.');
    } else {
      data.channels
        .find((c) => c.alias == args[0])
        .subscriptions.push({
          id: msg.channel.id,
          role: '@here',
          color: '#95A5A6'
        });
      msg.channel.send('Channel successfully subscribed.');
    }

    dataFile.write(data);
  }
};
