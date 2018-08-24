var { Command } = require('discord.js-commando');
var { RichEmbed } = require('discord.js');
var request = require("request")
var StaticMaps = require("staticmaps")
function ValidateIPaddress(ipaddress) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
      return (true)  
    }
    return (false)  
}  
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'checkip',
            group: 'info',
            memberName: 'checkip',
            description: 'Получить информацию о IP',
            examples: ['checkip'],
            args: [
                {
                    key: "IPAddr",
                    prompt: "🔴 Укажите IP о котором вы хотите узнать информацию",
                    type: "string",
                    validate: ip => {
                        return ValidateIPaddress(ip)
                    }
                }
            ]
        });
    }
    run(msg, {IPAddr}) {
        console.log(IPAddr);
        request(`http://ip-api.com/json/${IPAddr}`, {json: true}, (e, r, b) => {
            var embed = new RichEmbed()
                .setColor("#00ff00")
                .addField("Провайдер", `${b.org} / ${b.isp}`)
                .addField("Страна", b.country)
                .addField("Город", b.city)
                .addField("Регион", b.regionName)
                .addField("Часовой Пояс", b.timezone)    
            msg.channel.send(embed)
        });
    }
};