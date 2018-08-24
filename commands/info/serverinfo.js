var { Command } = require('discord.js-commando');
var { RichEmbed } = require('discord.js');
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'serverinfo',
            group: 'info',
            memberName: 'serverinfo',
            guildOnly: true,
            description: 'Информация о сервере',
            examples: ['serverinfo']
        });
    }
    run(msg) {
        var guild = msg.guild;
        var roles = "";
        guild.roles.forEach(role => {
            roles += role + " "
        });

        var emojiss = "";
        guild.emojis.forEach(emoji => {
            emojiss += emoji + " ";
        });

        if(roles == ""){
            roles = "Ролей нет";
        }
        if(emojiss == ""){
            emojiss = "Эмоджи нет";
        }
        
        var ver = [
            "Ограничений нет", 
            "Требуется подтвержденный e-mail", 
            "Учасник должен быть зарегистрирован более 5 минут",
            "Учасник должен находится более 10 минут на сервере", 
            "Требуется иметь подтвержденный телефон у учасника сервера"]
        var embed = new RichEmbed()
            .setThumbnail(guild.iconURL)
            .setTitle(`Информация о сервере ${guild.name}`)
            .addField("Создатель канала", `${guild.owner.user.tag}`)
            .addField("Создан", guild.createdAt)
            .addField("Количество учасников", guild.memberCount)
            .addField("Роли на сервере", roles)
            .addField("Emoji На сервере", emojiss)
            .addField("Регион", guild.region)
            .addField("Верификационный Левел", ver[guild.verificationLevel])
            .setColor("#00ff00")
        msg.channel.send(embed);
    }
};