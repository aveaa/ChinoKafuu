var { Command } = require('discord.js-commando');
var { RichEmbed } = require('discord.js');
var mysql = require("mysql")
var mysqlConnection = mysql.createConnection({
    host     : process.env.SQLHOST,
    user     : process.env.SQLUSER,
    password : process.env.SQLPASS,
    database : process.env.SQLDATA
});
var ms = require("ms");
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'gag',
            group: 'moderator',
            guildOnly: true,
            memberName: 'gag',
            clientPermissions: ['MANAGE_ROLES'],
            description: 'Эта команда позволит вам гагнуть человека',
            args:[
                {
                    key: "usr",
                    prompt: "Укажите пользователя",
                    type: "member"
                },
                {
                    key: "time",
                    prompt: "Укажите время",
                    type: "string",
                    validate: time => {
                        if(ms(time) >= 86400000){
                            return "Вы не можете гагнуть человека больше чем на 1 день."
                        }else{
                            return true;
                        }
                    }
                },
                {
                    key: "reason",
                    prompt: "Укажите причину",
                    type: "string"
                }
            ]
        });
    }
    hasPermission(msg) {
        var member = msg.member;
        if(this.client.isOwner(member.id)){
            return true;
        }
        if(member.hasPermission("MUTE_MEMBERS")){
            return true;
        }else{
            return "🔴 У вас нет прав MUTE_MEMBERS";
        }
    }
    async run(msg, {usr, time, reason}) {
        // if(usr.hasPermission("MANAGE_MESSAGES")) return msg.reply("Я не могу замутить его :c");
        var muterole = msg.guild.roles.find("name", "gagged");
        if(!muterole){
            try {
                muterole = await msg.guild.createRole({
                    name: "gagged",
                    color: "#000000",
                    permissions: []
                })
                msg.guild.channels.forEach(async (ch, id) => {
                    await ch.overwritePermissions(muterole, {
                        SPEAK: false
                    })
                });
            } catch (e) {
                console.log(e)
            }
        }

        await(usr.addRole(muterole.id));
        var logsch = false;
        var channel = "";
        mysqlConnection.query(`SELECT * FROM guilds WHERE id = ?`, [msg.guild.id], (e, row) => {
            if(e) throw new Error(e);
            channel = row[0].logsChannel;
            if(row[0].logsChannel != "0") logsch = true;
            var embedA = new RichEmbed()
                .setColor("#f44242")
                .setTitle(`Вас гагнули на сервере ${msg.guild.name}`)
                .addField("Пользователь", `<@${usr.id}>`)
                .addField("Время", time)
                .addField("Модератор", `<@${msg.author.id}>`)
                .addField("Причина", reason)
                .setTimestamp()
            user.send(embedA)
            if(logsch) {
                var embedB = new RichEmbed()
                    .setColor("#f44242")
                    .setTitle(`Гаг`)
                    .addField("Пользователь", `<@${usr.id}>`)
                    .addField("Время мута", time)
                    .addField("Модератор", `<@${msg.author.id}>`)
                    .setTimestamp()
                this.client.channels.get(channel).send(embedB)
                msg.reply("Готово :3\n");
            }else{
                msg.reply("Готово :3\n(У вас не установлен канал для логов напишите **chino channellogs** в канале логов)");
            }
            setTimeout(() => {
                usr.removeRole(muterole.id);
                if(logsch) {
                    var embedB = new RichEmbed()
                    .setColor("#f44242")
                    .setTitle(`Гаг Прошел!`)
                    .addField("Пользователь", `<@${usr.id}>`)
                    .addField("Время мута", time)
                    .addField("Модератор", `<@${msg.author.id}>`)
                    .setTimestamp()
                    this.client.channels.get(channel).send(embedB)
                }
            }, ms(time))
        });
    }
};

