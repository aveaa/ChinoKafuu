var { CommandoClient }  = require('discord.js-commando');
var path                = require('path');
var logger              = require("log-js")();
var mysql               = require("mysql")
var sqlite3             = require('sqlite3').verbose();
var timeout             = ms => new Promise(res => setTimeout(res, ms))
var db                  = new sqlite3.Database('./db.sqlite3');
var client              = new CommandoClient({
                            commandPrefix: 'ch! ',
                            owner: '479415764177387532',
                            disableEveryone: true,
                            unknownCommandResponse: false
                        });


var mysqlConnection     = mysql.createConnection({
                            host     : process.env.SQLHOST,
                            user     : process.env.SQLUSER,
                            password : process.env.SQLPASS,
                            database : process.env.SQLDATA
                        });
client.registry
    .registerDefaultTypes()
    .registerGroups([
        ["misc", "Разное"],
        ["games", "Игры"],
        ["info", "Инфо"],
        ["moderator", "Модерация"],
        ["fun", "Веселые команды"]
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
        commandState: false,
        eval_: true,
        help: false,
        ping: false,
        prefix: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'))
    
client.on("ready", () => { 
    mysqlConnection.connect();
    logger.success("Chino Kafuu запущена :з"); 
    client.user.setActivity(`chino help | в ${client.guilds.size} группах`, {type: "WATCHING"})
})
client.on("error", logger.error)
client.on("warning", logger.warning)
client.on("guildMemberAdd", async (user) => {
    if(user.user.username.toLowerCase().includes("kaboom") || user.user.username.toLowerCase().includes("telebotian") || user.user.username.toLowerCase().includes("jsopbots")){
        mysqlConnection.query("SELECT * FROM whitelist WHERE usrId = ?", [user.id], async (e, r, f) => {
            if(e) throw new Error(e);
            if(r.length === 0){
                if(user.bannable){
                    await user.sendMessage("Вас заблокировала анти-бот система.\n\nЕсли это ошибка - напишите <@479415764177387532> и администратору сервера сообщение что вас заблокировали и вы не бот и приложите этот текст:\n```gid: "+user.guild.id+"\nuid: "+user.id+"\nname: "+user.user.tag+"```")
                    await timeout(300)
                    user.ban("[Chino Anti-Bot]: Бот.")
                }
            }
        })
        
    }
    
    mysqlConnection.query("SELECT * FROM guilds WHERE id = ?", [user.guild.id], (e, r, f) => {
        if(e) throw new Error(e);
        if(r[0].welcomemessages == "1"){
            var msg = r[0].welcomemessage.replace("%user%", user.user).replace("%servername%", user.guild.name)
            user.send(msg)
        }
    })
});
client.on("guildCreate", async (guild) => {
    mysqlConnection.query(`INSERT into guilds (id, name) values ('${guild.id}', '${guild.name}')`)
    const getDefaultChannel = async (guild) => {
        // get "original" default channel
        if(guild.channels.has(guild.id))
          return guild.channels.get(guild.id)
      
        // Check for a "general" channel, which is often default chat
        if(guild.channels.exists("name", "general"))
          return guild.channels.find("name", "general");
        
          if(guild.channels.exists("name", "основной"))
          return guild.channels.find("name", "основной");
        // Now we get into the heavy stuff: first channel in order where the bot can speak
        // hold on to your hats!
        return guild.channels
         .filter(c => c.type === "text" &&
           c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
         .sort((a, b) => a.position - b.position ||
           Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
         .first();
    }
    var ch = await getDefaultChannel(guild)
    ch .send(
    `
🔵 Привет я Chino Kafuu!

⚫ Я очень полезный бот.
⚫ Чтобы узнать что я могу напиши chino help
⚫ Установите канал для логов бота, просто напишите chino channellogs в канале логов,
⚫ Некоторые команды не будут работать без канала логов!
⚫ Если у вас есть вопросы пишите в дискорде <@479415764177387532>
    `)
    client.user.setActivity(`chino help | в ${client.guilds.size} группах`, {type: "WATCHING"})
    logger.success(`Chino добавлена в канал ${guild.name} (${guild.id})`)

})
client.on("guildDelete", (guild) => {
    mysqlConnection.query(`DELETE FROM guilds WHERE id = "${guild.id}"`)
    logger.success(`Chino удалена из канала ${guild.name} (${guild.id})`)
})
client.on("debug", logger.info)
client.on("message", async (msg) => {
    if(msg.channel.type != "dm" || !msg.author.bot){
        mysqlConnection.query("SELECT * FROM guilds WHERE id = ?", [msg.guild.id], async (e, r, f) => {
            if(r[0].obscenity_filter == 1){
                if(msg.content.toLowerCase().match(/\w{0,5}[хx]([хx\s\!@#\$%\^&*+-\|\/]{0,6})[уy]([уy\s\!@#\$%\^&*+-\|\/]{0,6})[ёiлeеюийя]\w{0,7}|\w{0,6}[пp]([пp\s\!@#\$%\^&*+-\|\/]{0,6})[iие]([iие\s\!@#\$%\^&*+-\|\/]{0,6})[3зс]([3зс\s\!@#\$%\^&*+-\|\/]{0,6})[дd]\w{0,10}|[сcs][уy]([уy\!@#\$%\^&*+-\|\/]{0,6})[4чkк]\w{1,3}|\w{0,4}[bб]([bб\s\!@#\$%\^&*+-\|\/]{0,6})[lл]([lл\s\!@#\$%\^&*+-\|\/]{0,6})[yя]\w{0,10}|\w{0,8}[её][bб][лске@eыиаa][наи@йвл]\w{0,8}|\w{0,4}[еe]([еe\s\!@#\$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#\$%\^&*+-\|\/]{0,6})[uу]([uу\s\!@#\$%\^&*+-\|\/]{0,6})[н4ч]\w{0,4}|\w{0,4}[еeё]([еeё\s\!@#\$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#\$%\^&*+-\|\/]{0,6})[нn]([нn\s\!@#\$%\^&*+-\|\/]{0,6})[уy]\w{0,4}|\w{0,4}[еe]([еe\s\!@#\$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#\$%\^&*+-\|\/]{0,6})[оoаa@]([оoаa@\s\!@#\$%\^&*+-\|\/]{0,6})[тnнt]\w{0,4}|\w{0,10}[ё]([ё\!@#\$%\^&*+-\|\/]{0,6})[б]\w{0,6}|\w{0,4}[pп]([pп\s\!@#\$%\^&*+-\|\/]{0,6})[иeеi]([иeеi\s\!@#\$%\^&*+-\|\/]{0,6})[дd]([дd\s\!@#\$%\^&*+-\|\/]{0,6})[oоаa@еeиi]([oоаa@еeиi\s\!@#\$%\^&*+-\|\/]{0,6})[рr]\w{0,12}|\w{0,6}[cсs][уu][kк][aа]/g)){
                    if(msg.deletable){
                        if(msg.content.toLowerCase().includes("оскрбля")){
                            return;
                        }
                        msg.delete()
                        msg.reply("🔴 Не ругайся!").then(async m => {
                            await timeout(2000);
                            m.delete()
                        })
                    }
                }
            }
        });
    }
    

    
    
})
client.on("disconnect", () => { logger.warning("Disconnected!") })
client.on("reconnecting", () => { logger.warning("Reconnecting...") })
client.on("commandError", (cmd, err) => { logger.error(`Произошла ошибка в команде ${cmd.memberName}`, err); })
client.on("commandBlocked", (msg, reason) => { logger.warning(`Команда заблокирована! ${msg.command.memberName} причина: ${reason}`) });
client.login(process.env.BOTTOKEN);
