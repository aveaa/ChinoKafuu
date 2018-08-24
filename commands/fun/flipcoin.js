var { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'flipcoin',
            group: 'fun',
            memberName: 'flipcoin',
            description: 'Подбросить монетку',
            examples: ['flipcoin']
        });
    }
    async run(msg) {
        var items = ["Орёл", "Решка"]
        var result = items[Math.floor(Math.random()*items.length)];
        msg.reply(result);
    }
};