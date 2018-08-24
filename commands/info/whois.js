var { Command } = require('discord.js-commando');
var { RichEmbed } = require('discord.js');

function ParseData(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var day = date.getDate();
    var month = dategetMonth();
    var year = date.getFullYear();
    return day + "." + month + "." + year + " " + hours + ":" + minutes + ":" + seconds;
}

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'whois',
            group: 'info',
            memberName: 'whois',
            description: "Выводит информацию о пользователе",
            args: [
                {
                    key: "UserM",
                    prompt: "Укажите пользователя о котором вы хотите узнать информацию",
                    type: "member"
                }
            ]
        });
    }
    run(msg, { UserM }) {
        if(this.client.isOwner(UserM.id)){
            var asazs = new RichEmbed()
            .setTitle("Пошел нахуй")
            .setImage("https://i.imgur.com/AzcRZS1.png")
            var timeout = ms => new Promise(res => setTimeout(res, ms))
            return msg.channel.send(asazs).then(async (msgs) => {
                await timeout(2000)
                msgs.delete();
                msg.delete();
            })
        }
        var roles = "";
        UserM.roles.forEach(role => {
            roles += role + " "
        });
        
        var premissions = "";
        var obj = UserM.permissions.serialize();
        var keys = Object.keys(obj);
        var filtered = keys.filter(function(key) {
            return obj[key]
        }); 
        filtered.forEach(per => {
            premissions += `__${per}__` + ", "
        })

        var embed = new RichEmbed()
            .setAuthor(UserM.user.tag, UserM.user.displayAvatarURL)
            .setColor("#00ff00")
            .addField("Статус", UserM.presence.status)
            .addField("Зарегистрировался", UserM.user.createdAt)
            .addField("Зашел в канал", UserM.joinedAt)
            .addField("Роли", roles)
            .addField("Права", premissions)
            .setThumbnail(UserM.user.displayAvatarURL)
        msg.channel.send(embed)
    }
};