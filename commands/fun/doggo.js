var { Command } = require('discord.js-commando');
var { RichEmbed } = require('discord.js');
var superagent = require("superagent");

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'doggo',
            group: 'fun',
            memberName: 'doggo',
            description: 'Эта команда пришлет пёсиля :D',
            examples: ['doggo']
        });
    }
    
    async run(msg) {
        var {body} = await superagent
        .get("https://random.dog/woof.json");
        
        var dogembed = new RichEmbed()
            .setColor("#ffc700")
            .setTitle("Пёсиль :dog2:")
            .setImage(body.url)
            .setFooter("Возможно что картинка не прогрузится :c, я не виновит не бейте меня")
        msg.channel.send(dogembed);        
    }
};

