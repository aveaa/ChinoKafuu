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
            name: 'enablewelcome',
            group: 'info',
            memberName: 'enablewelcome',
            guildOnly: true,
            description: 'Включает приветствие при заходе на сервер'
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
    run(msg) {
        mysqlConnection.query("UPDATE `guilds` SET `welcomemessages`='1' WHERE `id` = ?", [msg.guild.id], (e, r, f) =>{
            if(e) throw new Error(e);
            msg.reply("Готово :3")
        })
    }
};

