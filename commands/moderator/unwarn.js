var { Command } = require('discord.js-commando');
var { RichEmbed } = require('discord.js');
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
            name: 'unwarn',
            group: 'moderator',
            memberName: 'unwarn',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                    key: "usr",
                    prompt: "Укажите пользователя",
                    type: "member"
                },
                {
                    key: "reason",
                    prompt: "Укажите причину",
                    type: "string"
                },
                
                
            ],
            description: 'Эта команда позволит вам убрать все варны у человека',
            
        });
    }
    hasPermission(msg) {
        var member = msg.member;
        if(this.client.isOwner(member.id)){
            return true;
        }
        if(member.hasPermission("MANAGE_MESSAGES")){
            return true;
        }else{
            return "🔴 У вас нет прав MANAGE_MESSAGES";
        }
    }
    async run(msg, {usr, reason}) {
        mysqlConnection.query("SELECT * FROM `warns` WHERE usrID = ? AND guildID = ?", [usr.id, msg.guild.id], (e, row) => {
            if(e) throw new Error(e);
            if(row.length === 0){
                return msg.reply("🔵 Варнов не найдено")
            }else{
                mysqlConnection.query(`DELETE FROM warns WHERE usrID = ? AND guildID = ?`, [usr.id, msg.guild.id]);
                mysqlConnection.query(`SELECT * FROM guilds WHERE id = ?`, [msg.guild.id], (e, row) => {
                    if(e) throw new Error(e);
                    var logsch = false;
                    var channel = row[0].logsChannel;
                    if(row[0].logsChannel != "0") logsch = true;
                    if(logsch){
                        var embed = new RichEmbed()
                            .setColor("#f44242")
                            .setTitle(`Модератор снял вам все предупреждения на сервере ${msg.guild.name}`)
                            .addField("Модератор", `<@${msg.author.id}>`)
                            .addField("Причина снятия", reason)
                            .setTimestamp()
                            .setFooter("Больше не нарушайте правила сервера! Чтобы узнать сколько у вас варнов пропишите на сервере команду chino warns")
                        usr.send(embed)

                        var embedA = new RichEmbed()
                            .setColor("#f44242")
                            .setTitle(`Сняты варны`)
                            .addField("Пользователь", `<@${usr.id}>`)
                            .addField("Модератор", `<@${msg.author.id}>`)
                            .addField("Причина снятия", reason)
                            .setTimestamp()
                        this.client.channels.get(channel).send(embedA)
                    }
                    msg.reply("🔵 Все варны сняты!")
                })
                
            }
        })
    }

};

