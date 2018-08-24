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
            name: 'warns',
            group: 'info',
            memberName: 'warns',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            description: 'Эта команда позволит вам узнать сколько у вас варнов',
            
        });
    }
    async run(msg) {
        mysqlConnection.query("SELECT * FROM `warns` WHERE usrID = ? AND guildID = ?", [msg.author.id, msg.guild.id], (e, row) => {
            if(e) throw new Error(e);
            if(row.length === 0){
                return msg.reply("🔵 У вас нет не одного варна! :з")
            }else{
                var msgs = `🔴 У вас есть ${row.length} варнов!\n`
                row.forEach((warn,i) => {
                    msgs += `🔴 ${(i+1)}. Выдан модератором <@${warn.modID}> по причине ${warn.reason}\n`
                })
                msg.reply(msgs)
            }
        })
    }

};

