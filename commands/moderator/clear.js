var { Command } = require('discord.js-commando');
var timeout = ms => new Promise(res => setTimeout(res, ms))
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            group: 'moderator',
            memberName: 'clear',
            description: 'Эта команда позволит очистить чат',
            examples: ['clear 10'],
            clientPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true,
            aliases: ['clear', 'очистить_чат'],
            args: [
                {
                    key: 'value',
                    prompt: '🔴 Сколько строк вы хотите удалить?',
                    type: 'integer',
                    validate: (value) => {
                        if(value < 2) return "🔴 Укажите кол-во строк больше чем 2"
                        return true;
                    }
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
    async run(msg, { value }) {
        await msg.channel.fetchMessages({limit: value}).then(messages => msg.channel.bulkDelete(messages));
        msg.reply("🔵 Сообщения удалены").then(async msg => {
            await timeout(2000)
            msg.delete();
        });
    }
    
};
