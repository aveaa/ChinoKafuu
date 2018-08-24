var { Command } = require('discord.js-commando');
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
            name: 'setwelcomemessage',
            group: 'info',
            memberName: 'setwelcomemessage',
            guildOnly: true,
            description: 'Устанавливает приветствие при заходе на сервер и включает его',
            args: [
                {
                    key: "message",
                    prompt: "Укажите приветствие. (%user% - Имя пользователя, %servername% - Имя сервера)",
                    type: "string"
                }
            ]
        });
    }
    hasPermission(msg) {
        var member = msg.member;
        if(member.hasPermission("ADMINISTRATOR")){
            return true;
        }else{
            return "🔴 У вас нет прав ADMINISTRATOR";
        }
    }
    run(msg, {message}) {
        mysqlConnection.query("UPDATE `guilds` SET `welcomemessages`='1',`welcomemessage`=? WHERE `id` = ?", [message, msg.guild.id], (e, r, f) =>{
            if(e) throw new Error(e);
            msg.reply("Готово! Я Установила вам приветственное сообщение и включила его!")
        })
    }
};

