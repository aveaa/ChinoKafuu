var { Command } = require('discord.js-commando');
var { RichEmbed } = require('discord.js');
var superagent = require("superagent");

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cat',
            group: 'fun',
            memberName: 'cat',
            description: 'Эта команда пришлет котика :D',
            examples: ['cat']
        });
    }
    
    async run(msg) {
        var {body} = await superagent
        .get("http://aws.random.cat/meow");
        
        var dogembed = new RichEmbed()
            .setColor("#d000ff")
            .setTitle("Котя :cat:")
            .setImage(body.file)
            .setFooter("Возможно что картинка не прогрузится :c, я не виновит не бейте меня")
        msg.channel.send(dogembed);        
    }
};

