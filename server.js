const token = "5891286316:AAHfdHUIr0TIlbmQfAWmUqPCdftQcpjqn5I"
const telegramBot = require("node-telegram-bot-api")
const bot = new telegramBot(token, { polling: true });
const fs = require("fs");
const { maxHeaderSize } = require("http");
const menu = JSON.parse(fs.readFileSync(__dirname + "/database/product.json"))
let user = []
const admin = 1344960166
let Jami = 0
bot.onText(/\/start/, async (msg) => {  
    try {
        const id = msg.chat.id
        console.log(msg);
        if (msg.from.is_bot) return
        await bot.sendMessage(id, "Salom " + msg.chat.first_name)
        await bot.sendPhoto(id, __dirname + "/images/menu.png")
        await bot.sendMessage(id,"Buyrutma berish uchun tugmani bosing",{
            reply_markup:{
                keyboard: [
                    [{text: "Buyurtma Berish"}]
                ],
                resize_keyboard:true,
                one_time_keyboard: true,
            }
        })
        user.push(msg.chat.first_name)
    } catch (error) { }
})
bot.on("text", async(msg) => {
    const id = msg.chat.id
    if(msg.text == "Buyurtma Berish"){
        await bot.sendMessage(id,"Buyurtmani tanlang",{
            reply_markup:{
                keyboard:[
                    [{text : "Peperoni"},{text : "Margarita"}],
                    [{text : "Go'shtli"},{text : "4 karra Pishloqli"}],
                    [{text: "Sezar"},{text : "Ninjago"}]
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            }
        })
    }
})
bot.on("text", async (msg) => {
    console.log(msg.text);
    const id = msg.chat.id
    if (msg.text == "Peperoni" || msg.text == "Margarita" || msg.text == "Go'shtli" || msg.text == "4 karra Pishloqli" || msg.text == "Sezar" || msg.text == "Ninjago") {
        for(let i =0;i<menu.length; i++){
            if(menu[i].name == msg.text){
                Jami = menu[i].price
            }
        }
        user.push(msg.text)
        bot.sendMessage(id,"Ichimlikni tanlang", {
            reply_markup: {
                keyboard: [
                    [{ text: "Coca cola" },{ text: "Suv" }],
                    [{ text: "Sprite" }, { text: "Fanta" }],
                    [{text: "ichimlik kerak emas"}]
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            }
        })
    }
})
bot.on("text" , async(msg) => {
    console.log(msg.text);
    const id = msg.chat.id
    if(msg.text == "Coca cola" || msg.text == "Suv" || msg.text == "Sprite" || msg.text == "Fanta" || msg.text == "ichimlik kerak emas"){
        for(let i =0;i<menu.length; i++){
            if(menu[i].name == msg.text){
                Jami += menu[i].price
            }
        }
        user.push(msg.text)
        bot.sendMessage(id,Jami + "so'm"  + " + dostavka xizmati siz uchun tekin 😉",{
            reply_markup:{
                keyboard:[
                    [{text:"Naqd pul orqali to'lash"}],
                    [{text: "Plastik karta orqali to'lash"}]
                ],
                one_time_keyboard: true,
                resize_keyboard : true
            }
        })
    }
})

bot.on("text", async (msg) => {
    const id = msg.chat.id
    if (msg.text == "Naqd pul orqali to'lash") {
        bot.sendMessage(id, "Yetkazib berish kerak bo'lgan joyni yuboring")
        user.push("Naqd")
    }
    if (msg.text == "Plastik karta orqali to'lash") {
        bot.sendMessage(id, "Yetkazib berish kerak bo'lgan joyni yuboring")
        user.push("Karta Orqali")
    }
})

bot.on("location", async (msg) => {
    const id = msg.chat.id
    user.push(msg.location.latitude, msg.location.longitude)
    bot.sendMessage(id, "Telefon raqamingizni jo'nating")
})
bot.on("contact", async(msg) => {
    console.log(msg);
    bot.sendMessage(msg.chat.id, "✅")
    bot.sendMessage(msg.chat.id, "Sizni  buyurtmangiz qabul qilindi, siz blan tez orada operator aloqaga chiqadi,buyrutmangiz uchun raxmat!")
    user.push(msg.contact.phone_number)
    fs.writeFileSync(__dirname + "/database/users.json", JSON.stringify(user, null, 4))
    await bot.sendMessage(admin, "zakaz:  " + JSON.stringify(user))
    user = []
})

