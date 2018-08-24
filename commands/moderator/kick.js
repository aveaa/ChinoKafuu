var { Command } = require('discord.js-commando');
var { RichEmbed } = require('discord.js');
var sqlite3 = require('sqlite3').verbose();
var mysql = require("mysql")
var mysqlConnection = mysql.createConnection({
    host     : process.env.SQLHOST,
    user     : process.env.SQLUSER,
    password : process.env.SQLPASS,
    database : process.env.SQLDATA
});
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            group: 'moderator',
            guildOnly: true,
            memberName: 'kick',
            clientPermissions: ['KICK_MEMBERS'],
            description: 'Кикнуть пользователя',
            examples: ['kick'],
            args: [
                {
                    key: "user",
                    prompt: "Укажите пользователя которого вы хотите кикнуть",
                    type: "member"
                },
                {
                    key: "reason",
                    prompt: "Укажите причину кика",
                    type: "string"
                }
                
            ]
        });
    }
    hasPermission(msg) {
        var member = msg.member;
        if(member.hasPermission("KICK_MEMBERS")){
            return true;
        }else{
            return "🔴 У вас нет прав KICK_MEMBERS";
        }
    }
    run(msg, { user , reason }) {
        var usr = user;
        var logsch = false;
        var channel = "";
        if(!user.bannable) return msg.reply("Я не могу кикнуть этого пользователя :c");
        mysqlConnection.query(`SELECT * FROM guilds WHERE id = ?`, [msg.guild.id], (e, row) => {
            if(e) throw new Error(e);
            
            channel = row[0].logsChannel;
            if(row[0].logsChannel != "0") logsch = true;
            var embedA = new RichEmbed()
                .setColor("#f44242")
                .setTitle(`Вас кикнули с сервера ${msg.guild.name}`)
                .addField("Пользователь", `<@${usr.id}>`)
                .addField("Модератор", `<@${msg.author.id}>`)
                .addField("Причина", reason)
                .setTimestamp()
            user.send(embedA)
            user.kick().then(() => { 
                
                if(logsch) {
                    var embedB = new RichEmbed()
                    .setColor("#f44242")
                    .setTitle(`Кик!`)
                    .addField("Пользователь", `<@${usr.id}>`)
                    .addField("Модератор", `<@${msg.author.id}>`)
                    .addField("Причина", reason)
                    .setTimestamp()
                    this.client.channels.get(channel).send(embedB)
                    return msg.reply("Готово :3\n");
                }
                return msg.reply("Готово :3\n(У вас не установлен канал для логов напишите **chino channellogs** в канале логов)");
            })
            
        })
        
    }
};

