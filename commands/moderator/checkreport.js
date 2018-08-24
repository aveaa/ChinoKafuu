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
            name: 'checkreport',
            group: 'moderator',
            memberName: 'checkreport',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            description: 'Эта команда позволит вам закрыть репорт на человека',
            args:[
                {
                    key: "reportID",
                    prompt: "Укажите ID репорта",
                    type: "string"
                },
                {
                    key: "reason",
                    prompt: "Укажите причину закрытия репорта",
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
        if(member.hasPermission("MANAGE_MESSAGES")){
            return true;
        }else{
            return "🔴 У вас нет прав MANAGE_MESSAGES";
        }
    }

    async run(msg, {reportID, reason}) {
        mysqlConnection.query("SELECT * FROM reports WHERE id = ? AND guildID = ?", [reportID, msg.guild.id], async (e,r,f) => {
            if(e) throw new Error(e);
            if(r[0] === undefined || r[0] == null) return msg.reply("Репорт с таким ID не найден.")
            if(r[0].modAws == 1) return msg.reply("Жалоба уже решена.")
            mysqlConnection.query(`SELECT * FROM guilds WHERE id = ?`, [msg.guild.id], (e, row) => {
                if(e) throw new Error(e);
                var logsch = false;
                var channel = row[0].logsChannel;
                if(row[0].logsChannel != "0") logsch = true;
                if(!logsch){
                    return msg.reply("В этом канале не установлен канал логов для администрации, по этому эта команда не работает.")
                }else{
                    var embed = new RichEmbed()
                        .setColor("#f44242")
                        .setTitle(`Жалоба с номером ${reportID} на сервере ${msg.guild.name} решена модератором`)
                        .addField("Жалоба подана на", `<@${r[0].suspectID}>`)
                        .addField("Жалоба подана", `<@${r[0].usrID}>`)
                        .addField("Причина репорта", r[0].reason)
                        .addField("Номер репорта", `#${r[0].id}`)
                        .addField("Модератор", msg.author)
                        .addField("Ответ модератора", reason)
                        .setTimestamp()
                    msg.guild.members.get(r[0].usrID).send(embed)
                    msg.guild.members.get(r[0].suspectID).send(embed)
                    this.client.channels.get(channel).send(embed)
                    mysqlConnection.query("UPDATE `reports` SET `modAws`= '1',`modReason`= ? WHERE `id` = ?", [reason, reportID])
                }
            })
        })
    }

};

