var { Command } = require('discord.js-commando');
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
            name: 'channellogs',
            group: 'moderator',
            memberName: 'channellogs',
            guildOnly: true,
            description: 'Установить канал для логов бота',
            examples: ['channellogs']
        });
    }
    hasPermission(msg) {
        var member = msg.member;
        if(this.client.isOwner(member.id)){
            return true;
        }
        if(member.hasPermission("ADMINISTRATOR")){
            return true;
        }else{
            return "🔴 У вас нет прав ADMINISTRATOR";
        }
    }
    run(msg) {
        var id = msg.channel.id;
        mysqlConnection.query("UPDATE guilds SET logsChannel = ? WHERE id = ?", [id, msg.guild.id])
        msg.reply("Канал установлен");
    }
};

