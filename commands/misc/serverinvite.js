var { Command } = require('discord.js-commando');
var { RichEmbed } = require('discord.js');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'serverinvite',
            group: 'misc',
            memberName: 'serverinvite',
            description: 'Генерирует инвайт ссылку'
        });
    }
    
    run(msg) {
        msg.channel.createInvite().then((result) => {
            var embed = new RichEmbed()
            .setTitle("Инвайт создан!")
            .addField("Инвайт", result.url)
            .addField("Создан", result.createdAt)
            .addField("Закончится", result.expiresAt)
            .setColor("#92f442")
            .setAuthor(result.inviter.tag, result.inviter.avatarURL)
            .setThumbnail(result.inviter.avatarURL)
            msg.author.send(embed)
            msg.reply("⚫ Проверьте лс!")

        }).catch((err) => {
            msg.reply("Произошла ошибка.");
        });
    }
};

