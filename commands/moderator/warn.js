var { Command } = require('discord.js-commando');
var { RichEmbed } = require('discord.js');
var ms = require("ms");
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
            name: 'warn',
            group: 'moderator',
            memberName: 'warn',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            description: 'Эта команда позволит вам заварнить человека',
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
        mysqlConnection.query(`SELECT * FROM guilds WHERE id = ?`, [msg.guild.id], (e, row) => {
            if(e) throw new Error(e);
            var logsch = false;
            var channel = row[0].logsChannel;
            if(row[0].logsChannel != "0") logsch = true;
            if(!logsch){
                return msg.reply("В этом канале не установлен канал логов для администрации, по этому эта команда не работает.")
            }else{
                mysqlConnection.query(`SELECT * FROM warns WHERE usrID = ? AND guildID = ?`, [usr.id, msg.guild.id], async (e, row) => {
                    mysqlConnection.query("INSERT INTO `warns`(`guildID`, `usrID`, `modID`, `reason`) VALUES (?, ?, ?, ?)", [msg.guild.id, usr.id, msg.author.id, reason])
                    if(row.length >= 3){
                        mysqlConnection.query(`DELETE FROM warns WHERE usrID = ? AND guildID = ?`, [usr.id, msg.guild.id]);
                        var embed = new RichEmbed()
                            .setColor("#f44242")
                            .setTitle(`Вам выдан мут из-за 3 предупреждений ${msg.guild.name}`)
                            .addField("Время блокировки чата", "10 минут")
                            .addField("Модератор", `<@${msg.author.id}>`)
                            .addField("Причина блокировки", reason)
                            .setTimestamp()
                            .setFooter("Больше не нарушайте правила сервера! Чтобы узнать сколько у вас варнов пропишите на сервере команду chino warns")
                        usr.send(embed)

                        var embedA = new RichEmbed()
                            .setColor("#f44242")
                            .setTitle(`Выдан мут из-за 3 предупреждений.`)
                            .addField("Время блокировки чата", "10 минут")
                            .addField("Пользователь", `<@${usr.id}>`)
                            .addField("Модератор", `<@${msg.author.id}>`)
                            .addField("Причина блокировки", reason)
                            .setTimestamp()
                            .setFooter("Больше не нарушайте правила сервера! Чтобы узнать сколько у вас варнов пропишите на сервере команду chino warns")
                        this.client.channels.get(channel).send(embedA)
                        

                        var muterole = msg.guild.roles.find("name", "warn_muted");
                        if(!muterole){
                            try {
                                muterole = await msg.guild.createRole({
                                    name: "warn_muted",
                                    color: "#000000",
                                    permissions: []
                                })
                                msg.guild.channels.forEach(async (c, id) => {
                                    await c.overwritePermissions(muterole, {
                                        SEND_MESSAGES: false,
                                        ADD_REACTIONS: false,
                                        SPEAK: false
                                    })
                                });
                            } catch (e) {
                                console.log(e)
                            }
                        }

                        await(usr.addRole(muterole.id));
                        msg.reply("Готово :3")
                        setTimeout(() => {
                            usr.removeRole(muterole.id);
                            if(logsch) {
                                var embedB = new RichEmbed()
                                .setColor("#f44242")
                                .setTitle(`Мут на сервере ${msg.guild.name} Прошел`)
                                .addField("Пользователь", `<@${usr.id}>`)
                                .addField("Время мута", "10 минут")
                                .addField("Модератор", `<@${msg.author.id}>`)
                                .addField("Причина", reason)
                                .setTimestamp()
                                this.client.channels.get(channel).send(embedB)
                                usr.send(embedB)
                            }
                        }, ms("10m"))
                        
                    }else{
                        var embed = new RichEmbed()
                            .setColor("#f44242")
                            .setTitle(`Вам выдали предупреждение на сервере ${msg.guild.name}`)
                            .addField("Модератор", `<@${msg.author.id}>`)
                            .addField("Причина предупреждения", reason)
                            .setTimestamp()
                            .setFooter("Больше не нарушайте правила сервера! Чтобы узнать сколько у вас варнов пропишите на сервере команду chino warns, если у вас будет 3 предупреждения то вас автоматически замутит на 10 минут ")
                        usr.send(embed)

                        var embedA = new RichEmbed()
                            .setColor("#f44242")
                            .setTitle(`Выдано предупреждение.`)
                            .addField("Пользователь", `<@${usr.id}>`)
                            .addField("Модератор", `<@${msg.author.id}>`)
                            .addField("Причина блокировки", reason)
                            .setTimestamp()
                        this.client.channels.get(channel).send(embedA)
                        msg.reply("Готово :3")
                    }
                })
            }
        })
        
    }

};

