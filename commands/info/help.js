var { Command } = require('discord.js-commando');
var { RichEmbed } = require('discord.js');
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            group: 'info',
            memberName: 'help',
            description: 'Выводит все доступные команды',
            examples: ['help']
        });
    }
    async run(msg) {
        var prefix = this.client.commandPrefix
        var embed = new RichEmbed()
            .setTitle("__**Доступные команды в Chino Kafuu**__")
            .setColor("#ff0000")
        await this.client.registry.groups.forEach(async group => {
            var listCmds = "";
            if(group.commands.size != 0) {  } else { return; }
            
            await group.commands.forEach(command => {
                if(command.name == "whitelistadd") return;
                listCmds += "```"+prefix+command.name+": "+command.description+"```\n";
            });
            embed.addField(`${group.name}`, listCmds)
        })
        msg.author.send(embed);
        msg.reply("⚫ Я отправила вам в лс")

    }
};