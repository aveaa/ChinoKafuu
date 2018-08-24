var { Command } = require('discord.js-commando');
var { RichEmbed } = require('discord.js');
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}


module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'info',
            group: 'info',
            memberName: 'info',
            description: 'Информация о бота',
            examples: ['info']
        });
    }
    run(msg, {anwser}) {
        var time = process.uptime();
        var uptime = (time + "").toHHMMSS();
        var emb = new RichEmbed()
        .setTitle("Информация о боте")
        .setImage(this.client.user.avatarURL)
        .setTimestamp()
        .setAuthor(this.client.user.tag, this.client.user.avatarURL)
        .addField("Создатель", "<@479415764177387532>", true)
        .addField("UpTime", uptime, true)
        .addField("Серверов", this.client.guilds.size, true)
        .addField("Команд", this.client.registry.commands.size, true)
        .setColor("#7df442");
        msg.channel.send(emb);
    }
};

