const googleTTS = require('google-tts-api'); // CommonJS
const https = require('https');
const fs = require('fs');
const { Telegraf } = require('telegraf');
const bot = new Telegraf('1743081593:AAHtbW8v9gvq50ifCwrQTokWs66I0wpZB3E')
const audioconcat = require('audioconcat');
const express = require('express')
const expressApp = express()

// const port = process.env.PORT || 3000
// // expressApp.get('/', (req, res) => {
// //   res.send('Hello World!')
// // })
// expressApp.listen(port, () => {
//   console.log(`Listening on port ${port}`)
// })


expressApp.listen(process.env.PORT || 8080);


// require('https').createServer().listen(process.env.PORT || 5000).on('request', function(req, res){
//     res.end('')
//   });


bot.command("audio", (ctx) => {
    return ctx.replyWithAudio({ source: "./file.mp3" });
});

bot.on('message', (msg) => {
    const url = googleTTS.getAllAudioUrls(msg.update.message.text, {
        lang: 'ru',
      slow: false,
      host: 'https://translate.google.com',
      splitPunct: ',.?'
    });

    for (let i = 0; i < url.length; i++){
        const file = fs.createWriteStream("file" + i + ".mp3");
        const request = https.get(url[i].url, function(response) {
            response.pipe(file);
        }); 
    }

    setTimeout(() => {
        let songs = [];
            for (let i = 0; i < url.length; i++){
                songs.push("./file" + i + ".mp3");
            }
            // console.log(songs);
            audioconcat(songs)
            .concat('merged.mp3')
        }, 3000);

    setTimeout(() => {
        msg.replyWithAudio({ source: "./merged.mp3" });
        songs = [];
    }, 4000);

})

bot.launch();

process.on('uncaughtException', function (err) {
    console.log(err);
}); 