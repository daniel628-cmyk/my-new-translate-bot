const TelegramBot = require('node-telegram-bot-api');
const translate = require('@vitalets/google-translate-api').default;

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

// ተጠቃሚው ሲጀምር
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `👋 **ሠላም! እኔ የእርስዎ የትርጉም ረዳት ነኝ!** 🌐

እኔን በመጠቀም ጽሁፎችን ወደ ተለያዩ ቋንቋዎች በቀላሉ መተርጎም ይችላሉ። 
**Hello! I am your translation assistant.** 🚀

እባክዎ መተርጎም የሚፈልጉትን ቋንቋ ከመረጡ በኋላ ጽሁፍዎን ይላኩልኝ፦`;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'አማርኛ 🇪🇹', callback_data: 'am' }, { text: 'English 🇺🇸', callback_data: 'en' }],
        [{ text: 'Afan Oromo 🇪🇹', callback_data: 'om' }, { text: 'Arabic 🇸🇦', callback_data: 'ar' }],
        [{ text: 'Chinese 🇨🇳', callback_data: 'zh-cn' }]
      ]
    }
  };

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown', ...options });
});

// የቋንቋ ምርጫን ማቀናበር
bot.on('callback_query', (query) => {
  const lang = query.data;
  bot.answerCallbackQuery(query.id, { text: `አሁን ወደ ${lang} መተርጎም ይችላሉ!` });
  bot.sendMessage(query.chat.id, `ቋንቋውን መርጠዋል! አሁን መተርጎም የሚፈልጉትን ጽሁፍ ይላኩልኝ።`);
  // እዚህ ጋር የቋንቋ ምርጫውን ለተጠቃሚው ማስታወስ የሚያስችል ኮድ መጨመር ይቻላል
});

// የትርጉም ስራው
bot.on('message', async (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    // እዚህ ለቀላልነት ወደ አማርኛ የሚተረጉም ኮድ ነው ያለው
    try {
      const res = await translate(msg.text, {to: 'am'});
      bot.sendMessage(msg.chat.id, `ትርጉም፦\n${res.text}`);
    } catch (err) {
      bot.sendMessage(msg.chat.id, 'ይቅርታ፣ መተርጎም አልቻልኩም።');
    }
  }
});
