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
            name: 'unban',
            group: 'moderator',
            guildOnly: true,
            memberName: 'unban',
            description: 'Разблокировать пользователя по ID',
            examples: ['unban'],
            args: [
                {
                    key: "banID",
                    prompt: "Укажите ID Бана",
                    type: "string"
                }
                
            ]
        });
    }
    hasPermission(msg) {
        var member = msg.member;
        if(member.hasPermission("BAN_MEMBERS")){
            return true;
        }else{
            return "🔴 У вас нет прав BAN_MEMBERS";
        }
    }
    run(msg, { banID }) {
        mysqlConnection.query("SELECT * FROM banlist WHERE id = ? AND guildID = ?", [banID, msg.guild.id], async (e,r,f) => {
            if(e) throw new Error(e);
            if(r[0] === undefined || r[0] == null) return msg.reply("Бан с таким ID не найден.")
            if(r[0].unbanned == 1) return msg.reply("Пользователь уже разблокирован")
            let user;
            var idrrr = r[0].usrID
            var banned = await msg.guild.fetchBans().then(bans => {
                let users = bans.filter(r => r.id === idrrr)
                if(!users.first()){
                    msg.reply("Пользователь разблокирован вручную.")
                    return Promise.resolve(false)
                }else{
                    user = users.first()
                    return Promise.resolve(users.first())
                }
            })
            if(!banned) {return;}
            mysqlConnection.query(`SELECT * FROM guilds WHERE id = ?`, [msg.guild.id], (e, row) => {
                if(e) throw new Error(e);
                var channel = row[0].logsChannel;
                var logsch = false;
                if(row[0].logsChannel != "0") logsch = true;
                
                msg.guild.unban(banned.id, `[Chino: ${msg.author.tag}] Разбан модератором`).then(user => {
                    mysqlConnection.query("UPDATE `banlist` SET `unbanned`='1' WHERE `id` = ?", [banID])
                    if(logsch){
                        var embedB = new RichEmbed()
                            .setColor("#f44242")
                            .setTitle(`Разблокировка бана #${banID}`)
                            .addField("Модератор", `<@${msg.author.id}>`)
                            .addField("Пользователь", `<@${user.id}>`)
                            .setTimestamp()
                        this.client.channels.get(channel).send(embedB)
                    }
                    user.send(`Вы были разблокированы в канале ${msg.guild.name}`)
                    msg.reply("Готово! :з")
                    
                });
            })
            

        })
        
    }
};

