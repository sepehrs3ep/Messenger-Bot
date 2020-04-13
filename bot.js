const IS_TELEGRAM = false;


const BALE_TOKEN = '1041415106:257dc81042c8d5dd4c3044848cdf05692f9459eb';
const TELEGRAM_TOKEN = '1119908489:AAHQdBIDxj0wqnsGQ59ZhyB24kWF9V8g0x8';

const TELEGRAM_BASE_URL = 'https://api.telegram.org';
const BALE_BASE_URL = 'https://tapi.bale.ai';

const TOKEN = process.env.TELEGRAM_TOKEN || IS_TELEGRAM ? TELEGRAM_TOKEN : BALE_TOKEN;

const TelegramBot = require('node-telegram-bot-api');

const request = require('request');
const options = {
  polling: true,
  baseApiUrl: IS_TELEGRAM ? TELEGRAM_BASE_URL : BALE_BASE_URL
};
const bot = new TelegramBot(TOKEN, options);


// ---------- LOGGIN FEATURES ----------
const fs = require('fs');
const util = require('util');

const logFile = fs.createWriteStream(__dirname + '/debug.log', { flags: 'a' });
const logStdout = process.stdout;

console.log = function (d) { 
  logFile.write(util.format(d) + '\n');
  logStdout.write(util.format(d) + '\n');
};


bot.on('message', (msg) => { 	
  let date = new Date(msg.date * 1000);
	 let timestamp = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + "@" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

	let msgFromInfo = "";
	if(msg.chat.type == "private"){
		msgFromInfo = msg.from.first_name + "(" + msg.from.id + ")";
	}else if(msg.chat.type == "group"){
		msgFromInfo = msg.from.first_name + "(" + msg.from.id + "/" + msg.chat.title + ")";
	}
	
	 console.log("[INFO](" + timestamp + ") Msg from " + msgFromInfo + ": " + msg.text);
  
});

// Matches /photo
bot.onText(/\/photo/, function onPhotoText(msg) {
  // From file path
  const photo = `${__dirname}/../test/data/photo.gif`;
  bot.sendPhoto(msg.chat.id, photo, {
    caption: "I'm a bot!"
  });
});


// Matches /audio
bot.onText(/\/audio/, function onAudioText(msg) {
  // From HTTP request
  const url = 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg';
  const audio = request(url);
  bot.sendAudio(msg.chat.id, audio);
});


// Matches /love
bot.onText(/\/start/, function onLoveText(msg) {
  const opts = {
    reply_to_message_id: msg.message_id,
    reply_markup: JSON.stringify({
      keyboard: [
        ['سلام سلام ستاره گل اومده بهاره از این خوشگلا کی داره ها ‌؟','سلام سلام ستاره گل اومده بهاره از این خوشگلا کی داره‌؟'],
        ['من دارمو من دارم آره من دارمو من دارم','من دارمو من دارم آره من دارمو من دارم','من دارمو من دارم آره من دارمو من دارم'],
        ['سلام سلام سلام'],
        ['خدا نگهدار شما '],
        ['همینجوری الکی']
      ],
      resize_keyboard: false
    })
  };
  bot.sendMessage(msg.chat.id, 'Do you love me?', opts);
});


// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function onEchoText(msg, match) {
  const resp = match[1];
  bot.sendMessage(msg.chat.id, resp);
});


// Matches /editable
bot.onText(/\/editable/, function onEditableText(msg) {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Edit Text',
            // we shall check for this value when we listen
            // for "callback_query"
            callback_data: 'edit'
          }
        ]
      ]
    }
  };
  bot.sendMessage(msg.from.id, 'Original Text', opts);
});


// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  let text;

  if (action === 'edit') {
    text = 'Edited Text';
  }

  bot.editMessageText(text, opts);
});