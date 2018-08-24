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
            name: 'misc',
            group: 'info',
            memberName: 'misc',
            description: 'Добавить человека в вайтлист ботлиста.',
            args:[
                {
                    key: "usr",
                    prompt: "Укажите пользователя",
                    type: "member"
                }
            ]
        });
    }
    hasPermission(msg) {
        var member = msg.member;
        if(this.client.isOwner(member.id)){
            return true;
        }else{
            return "Команда разрешена только создателю бота."
        }
    }
    async run(msg, {usr}) {
        mysqlConnection.query("SELECT * FROM `whitelist` WHERE usrID = ?", [usr.id], (e, row) => {
            if(e) throw new Error(e);
            if(row.length !== 0){
                return msg.reply("🔵 Человек уже в белом листе")
            }else{
                mysqlConnection.query("INSERT INTO `whitelist`(`usrId`) VALUES (?)", [usr.id])
                return msg.reply("🔵 Человек добавлен в белый лист")
            }
        })
    }

};

