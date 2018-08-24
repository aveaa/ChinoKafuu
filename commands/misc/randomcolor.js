var { Command } = require('discord.js-commando');
var { RichEmbed } = require('discord.js');

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'randomcolor',
            group: 'misc',
            memberName: 'randomcolor',
            description: 'Генерирует рандомный HEX цвет',
            examples: ['flipcoin']
        });
    }
    run(msg) {
        var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        var embed = new RichEmbed()
            .setColor(color)
            .addField("HEX", color)
            .addField("RGB", `${hexToRgb(color).r}, ${hexToRgb(color).g}, ${hexToRgb(color).b}`);
        msg.channel.send(embed)
    }
};