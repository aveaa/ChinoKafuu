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
            name: 'report',
            group: 'moderator',
            memberName: 'report',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            description: 'Эта команда позволит вам зарепортить человека',
            args:[
                {
                    key: "usr",
                    prompt: "Укажите пользователя",
                    type: "member"
                },
                {
                    key: "reason",
                    prompt: "Укажите причину",
                    type: "string"
                }
            ]
        });
    }
    async run(msg, {usr, reason}) {
        mysqlConnection.query(`SELECT * FROM guilds WHERE id = ?`, [msg.guild.id], (e, row) => {
            if(e) throw new Error(e);
            var logsch = false;
            var channel = row[0].logsChannel;
            if(row[0].logsChannel != "0") logsch = true;
            if(!logsch){
                return msg.reply("В этом канале не установлен канал логов для администрации, по этому эта команда не работает.")
            }else{
                mysqlConnection.query("INSERT INTO `reports`(`suspectID`, `usrID`, `reason`, `guildID`) VALUES (?, ?, ?, ?)", [usr.id, msg.author.id, reason, msg.guild.id], (e,r,f) => {
                    if(e) throw new Error(e);
                    var embed = new RichEmbed()
                        .setColor("#f44242")
                        .setTitle(`Вас зарепортили на сервере ${msg.guild.name}`)
                        .addField("Репорт подал", msg.author)
                        .addField("Причина репорта", reason)
                        .addField("Номер репорта", `#${r.insertId}`)
                        .setFooter("Модераторы оповещены!")
                    usr.send(embed)
                
                    var embed1 = new RichEmbed()
                        .setColor("#f44242")
                        .setTitle(`Ваша жалоба на сервере ${msg.guild.name} принята`)
                        .addField("Пользователь", `<@${usr.id}>`)
                        .addField("Причина репорта", reason)
                        .addField("Номер репорта", `#${r.insertId}`)
                        .setFooter("Модераторы оповещены! Ожидайте разборки.")
                    msg.author.send(embed1)
                    

                    var embedB = new RichEmbed()
                        .setColor("#f44242")
                        .setTitle(`Репорт #${r.insertId}`)
                        .addField("Пользователь", `<@${usr.id}>`)
                        .addField("Репорт подал", `<@${msg.author.id}>`)
                        .addField("Причина репорта", reason)
                        .setFooter(`Модератор! после разбора жалобы напишите команду, chino checkreport ${r.insertId} [результат разборки]`)
                        .setTimestamp()
                    this.client.channels.get(channel).send(embedB)
                })
            }
        })
        
    }

};

