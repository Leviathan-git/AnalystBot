const dataFile = new (require('../util/file'))('data.json');

module.exports = {
  command: 'mentionprefix',
  dm: false,
  permissions: (member) => {
    return (
      member.id == '780481685975990313' || member.id == '401376663541252096'
    );
  },
  async execute(bot, msg, args) {
    if (!args[0]) return msg.channel.send('Please enter the new prefix.');

    const data = dataFile.read();

    data.prefix = args[0];

    msg.channel.send(`Prefix for mentions updated to \`${args[0]}\`.`);

    dataFile.write(data);
  }
};
