const dataFile = new (require('../util/file'))('data.json');

module.exports = {
  command: 'setrole',
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

    if (
      !data.channels.some(
        (c) =>
          c.alias == args[0] &&
          c.subscriptions.some((s) => s.id == msg.channel.id)
      )
    ) {
      return msg.channel.send('Subscription not found.');
    } else {
      data.channels
        .find((c) => c.alias == args[0])
        .subscriptions.find((s) => s.id == msg.channel.id).role = args[1];

      msg.channel.send(`Role mention for this channel set to \`${args[1]}\`.`);
    }

    dataFile.write(data);
  }
};
