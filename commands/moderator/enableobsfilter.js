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
            name: 'enableobsfilter',
            group: 'moderator',
            memberName: 'enableobsfilter',
            description: 'Включить Анти-мат на сервере',
            guildOnly: true
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
    async run(msg) {
        mysqlConnection.query("UPDATE `guilds` SET `obscenity_filter`='1' WHERE `id` = ?", [msg.guild.id], (e, r, f) =>{
            if(e) throw new Error(e);
            msg.reply("Готово :3")
        })
    }

};

