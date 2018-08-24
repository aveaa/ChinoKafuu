var { Command } = require('discord.js-commando');
var { RichEmbed } = require('discord.js');
var mysql = require("mysql")
var mysqlConnection = mysql.createConnection({
    host     : process.env.SQLHOST,
    user     : process.env.SQLUSER,
    password : process.env.SQLPASS,
    database : process.env.SQLDATA
});
mysqlConnection.connect();
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            group: 'moderator',
            memberName: 'ban',
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            description: 'Заблокировать пользователя',
            examples: ['ban'],
            
            args: [
                {
                    key: "user",
                    prompt: "Укажите пользователя которого вы хотите забанить",
                    type: "member"
                },
                {
                    key: "days",
                    prompt: "Укажите дни бана (0 - навсегда)",
                    type: "integer"
                },
                {
                    key: "reason",
                    prompt: "Укажите причину бана",
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
        if(member.hasPermission("BAN_MEMBERS")){
            return true;
        }else{
            return "🔴 У вас нет прав BAN_MEMBERS";
        }
    }
    run(msg, { user , days, reason }) {
        var usr = user;
        var logsch = false;
        var channel = "";
        if(!user.bannable) return msg.reply("Я не могу заблокировать этого пользователя :c");

        mysqlConnection.query(`SELECT * FROM guilds WHERE id = ?`, [msg.guild.id], (e, row) => {
            if(e) throw new Error(e);
            
            if(days != 0) var block = "На "+days+" Дней"
                else var block = "навсегда";
            
            channel = row[0].logsChannel;
            if(row[0].logsChannel != "0") logsch = true;
            var embed = new RichEmbed()
                .setColor("#f44242")
                .setTitle(`Вы заблокированы на сервере ${msg.guild.name}`)
                .addField("Время блокировки", block)
                .addField("Модератор", `<@${msg.author.id}>`)
                .addField("Причина блокировки", reason)
            user.send(embed)
            user.ban({days: days, reason: `[Chino: ${msg.author.tag}] ${reason}`}).then(() => { 
                mysqlConnection.query("INSERT INTO `banlist`(`usrID`, `guildID`, `usrName`, `modID`, `modName`, `reason`, `days`) VALUES (?,?,?,?,?,?,?)", [usr.id, msg.guild.id, usr.user.tag, msg.author.id, msg.author.tag, reason, days], (e,r,f) => {
                    if(logsch) {
                        var embedB = new RichEmbed()
                            .setColor("#f44242")
                            .setTitle(`Блокировка #${r.insertId}`)
                            .addField("Пользователь", `<@${usr.id}>`)
                            .addField("Время блокировки", block)
                            .addField("Модератор", `<@${msg.author.id}>`)
                            .addField("Причина блокировки", reason)
                            .setFooter(`Модератор! если вы передумали команда разбана, chino unban ${r.insertId}`)
                            .setTimestamp()
                        this.client.channels.get(channel).send(embedB)
                        return msg.reply("Готово :3\n");
                    }
                    return msg.reply("Готово :3\n(У вас не установлен канал для логов напишите **chino channellogs** в канале логов)");
                })
                
            })
            
        })
        
        
    }
};

