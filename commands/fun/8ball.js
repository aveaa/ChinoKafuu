var { Command } = require('discord.js-commando');
var { RichEmbed } = require('discord.js');
var superagent = require("superagent");

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: '8ball',
            group: 'fun',
            memberName: '8ball',
            description: 'Шар судьбы',
            examples: ['8ball'],
            args: [
                {
                    type: "string",
                    prompt: "Задай свой вопрос шару судьбы",
                    key: "anwser"
                }
            ]
        });
    }
    async run(msg, {anwser}) {
        if(anwser.toLowerCase().includes("фсб") && anwser.toLowerCase().includes("следит")){
            return msg.reply("Конечно следит...");
        }
        var items = ["Определено - да", "Определено - нет", "Конечно", "Это возможно", "Да", "Даже не думай", "Вам лучше, пока этого, не знать...", "Нет", "Конечно нет"]
        var result = items[Math.floor(Math.random()*items.length)];
        msg.reply(result);
    }
};

