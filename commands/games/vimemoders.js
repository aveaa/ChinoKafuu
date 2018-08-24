var { Command } = require('discord.js-commando');
var vime = require("vimelib");
var { RichEmbed } = require('discord.js');
var vimeworld = new vime(process.env.VIMEAPI);
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'vimemoders',
            group: 'games',
            memberName: 'vimemoders',
            description: 'Модераторы онлайн на vimeworld',
            examples: ['vimemoders']
        });
    }
    async run(msg) {
        var list = "";
        await vimeworld.getStaff().then(async moderators => {
            if(moderators.length == 0){
                var embed = new RichEmbed()
                    .setTitle("Модераторы онлайн")
                    .setDescription("Модераторов нет в онлайне")
                    .setColor("#ff0000")
                return msg.channel.send(embed); 
            }else{
                var embed = new RichEmbed()
                    .setTitle("Модераторы онлайн")
                    .setColor("#ff0000")
                await moderators.forEach(moderator => {
                    embed.addField(vimeworld.returnReadablePrefix(moderator.rank) + " " + moderator.username, moderator.online.message)
                });
                msg.channel.send(embed);
            }
            
            
        })
        
        

    }
};