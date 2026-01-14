const a = require("axios");
const nix = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

module.exports = {
  config: {
    name: "gemini",
    aliases: ["ai", "chat", "tronai", "ask"],
    version: "3.0.0",
    author: "꒰🍿˖°❗◯⃝🫟🎬TRØN†ARËS†BØT🍿⃤ ⃧🍧❓°˖ 🎟️ ꒱",
    countDown: 3,
    role: 0,
    shortDescription: "TRON ARES AI Assistant",
    longDescription: "Interact with TRON ARES AI powered by Gemini - Your intelligent assistant in the digital Grid",
    category: "AI",
    guide: "/gemini [your question] | /ai [prompt] | /chat [message]"
  },

  onStart: async function({ api, event, args }) {
    let e;
    const userName = (await global.utils.getUserInfo(event.senderID))?.name || "User";
    const adminID = "61572476705473";
    const isAdmin = event.senderID === adminID;
    
    // En-tête TRON ARES
    const tronHeader = `╭══════════════════════╮
│   ⚡ **TRON ARES AI** ⚡   │
╰══════════════════════╯\n`;

    try {
      const apiConfig = await a.get(nix);
      e = apiConfig.data && apiConfig.data.api;
      if (!e) throw new Error("Configuration Error: Missing API in GitHub JSON.");
    } catch (error) {
      const errorMsg = tronHeader + 
        `┌──────────────────────┐\n` +
        `│ ❌ **SYSTEM ERROR**   │\n` +
        `├──────────────────────┤\n` +
        `│ Failed to fetch API  │\n` +
        `│ configuration        │\n` +
        `│                      │\n` +
        `│ Please try again     │\n` +
        `│ later                │\n` +
        `└──────────────────────┘\n\n` +
        `🍿 *TRON ARES SYSTEM* 🎟️`;
      
      api.sendMessage(errorMsg, event.threadID, event.messageID);
      return;
    }

    const p = args.join(" ");
    if (!p) {
      const helpMsg = tronHeader + 
        `┌──────────────────────┐\n` +
        `│   **QUICK START**    │\n` +
        `├──────────────────────┤\n` +
        `│ ${userName}${isAdmin ? ' 👑' : ''}\n` +
        `│                      │\n` +
        `│ Ask me anything:     │\n` +
        `│ /gemini [question]   │\n` +
        `│                      │\n` +
        `│ Examples:            │\n` +
        `│ /gemini Hello        │\n` +
        `│ /ai What is TRON?    │\n` +
        `│ /chat How are you?   │\n` +
        `└──────────────────────┘\n\n` +
        `🎬 *Powered by Gemini AI*\n` +
        `⚡ TRON ARES Intelligence`;
      
      return api.sendMessage(helpMsg, event.threadID, event.messageID);
    }

    // Réaction de traitement avec emoji TRON
    api.setMessageReaction("⚡", event.messageID, () => {}, true);

    // Message de traitement
    const processingMsg = tronHeader + 
      `┌──────────────────────┐\n` +
      `│   **PROCESSING**     │\n` +
      `├──────────────────────┤\n` +
      `│ User: ${userName.substring(0, 15)}${isAdmin ? ' 👑' : ''}\n` +
      `│ Query: ${p.substring(0, 30)}${p.length > 30 ? '...' : ''}\n` +
      `│                      │\n` +
      `│ Analyzing request... │\n` +
      `│ Please wait...       │\n` +
      `└──────────────────────┘`;
    
    await api.sendMessage(processingMsg, event.threadID);

    try {
      const r = await a.get(`${e}/gemini?prompt=${encodeURIComponent(p)}`);
      const reply = r.data?.response; 
      if (!reply) throw new Error("No response from Gemini API.");

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // Formater la réponse avec style TRON
      const formattedReply = tronHeader + 
        `┌──────────────────────┐\n` +
        `│   **AI RESPONSE**    │\n` +
        `├──────────────────────┤\n` +
        `│ User: ${userName.substring(0, 12)}${isAdmin ? ' 👑' : ''}\n` +
        `│ Query: ${p.substring(0, 20)}${p.length > 20 ? '...' : ''}\n` +
        `├──────────────────────┤\n` +
        `│ ${reply.replace(/\n/g, '\n│ ')}\n` +
        `└──────────────────────┘\n\n` +
        `⚡ **AI STATS**\n` +
        `├ Model: Gemini AI\n` +
        `├ System: TRON ARES\n` +
        `├ Version: 3.0.0\n` +
        `└ Status: ✅ ACTIVE\n\n` +
        `💡 *Continue the conversation by replying to this message*\n` +
        `🍿 *TRON ARES AI Assistant* 🎟️`;

      api.sendMessage(formattedReply, event.threadID, (err, i) => {
        if (!i) return;
        global.GoatBot.onReply.set(i.messageID, { 
          commandName: this.config.name, 
          author: event.senderID, 
          baseApi: e,
          userName: userName,
          isAdmin: isAdmin
        });
      }, event.messageID);

    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      
      const errorMsg = tronHeader + 
        `┌──────────────────────┐\n` +
        `│   **AI ERROR**       │\n` +
        `├──────────────────────┤\n` +
        `│ System: TRON ARES AI │\n` +
        `│ Status: ⚠️ OFFLINE   │\n` +
        `│                      │\n` +
        `│ Error Details:       │\n` +
        `│ AI service           │\n` +
        `│ temporarily          │\n` +
        `│ unavailable          │\n` +
        `│                      │\n` +
        `│ Please try again     │\n` +
        `│ in a few moments     │\n` +
        `└──────────────────────┘\n\n` +
        `🔧 **TROUBLESHOOTING**\n` +
        `1. Check your connection\n` +
        `2. Wait 30 seconds\n` +
        `3. Try again\n\n` +
        `🍿 *TRON ARES SYSTEM* 🎟️`;
      
      api.sendMessage(errorMsg, event.threadID, event.messageID);
    }
  },

  onReply: async function({ api, event, Reply }) {
    if ([api.getCurrentUserID()].includes(event.senderID)) return;
    const { baseApi: e, userName, isAdmin } = Reply;
    
    if (!e) {
      const expiredMsg = `╭══════════════════════╮
│   ⚡ **TRON ARES AI** ⚡   │
╰══════════════════════╯

┌──────────────────────┐
│   **SESSION END**    │
├──────────────────────┤
│ AI session has       │
│ expired              │
│                      │
│ Please start a new   │
│ conversation with:   │
│ /gemini [question]   │
└──────────────────────┘

🍿 *TRON ARES AI Assistant* 🎟️`;
      
      return api.sendMessage(expiredMsg, event.threadID, event.messageID);
    }

    const p = event.body;
    if (!p) return;

    // Réaction de traitement
    api.setMessageReaction("⚡", event.messageID, () => {}, true);

    // Message de traitement pour la réponse
    const processingMsg = `╭══════════════════════╮
│   ⚡ **TRON ARES AI** ⚡   │
╰══════════════════════╯

┌──────────────────────┐
│   **PROCESSING**     │
├──────────────────────┤
│ Continuing conversation...
│ Please wait...       │
└──────────────────────┘`;
    
    await api.sendMessage(processingMsg, event.threadID);

    try {
      const r = await a.get(`${e}/gemini?prompt=${encodeURIComponent(p)}`);
      const reply = r.data?.response; 
      if (!reply) throw new Error("No response from Gemini API.");

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // Formater la réponse continue
      const formattedReply = `╭══════════════════════╮
│   ⚡ **TRON ARES AI** ⚡   │
╰══════════════════════╯

┌──────────────────────┐
│   **CONTINUED**      │
├──────────────────────┤
│ User: ${userName?.substring(0, 12) || "User"}${isAdmin ? ' 👑' : ''}
│ Previous context     │
│ saved               │
├──────────────────────┤
│ ${reply.replace(/\n/g, '\n│ ')}
└──────────────────────┘

⚡ **CONVERSATION INFO**
├ Messages: Continuing
├ Context: Preserved
├ Status: ✅ ACTIVE
└ Session: Ongoing

💡 *Reply to continue chatting*
🍿 *TRON ARES AI Assistant* 🎟️`;

      api.sendMessage(formattedReply, event.threadID, (err, i) => {
        if (!i) return;
        global.GoatBot.onReply.set(i.messageID, { 
          commandName: this.config.name, 
          author: event.senderID, 
          baseApi: e,
          userName: userName,
          isAdmin: isAdmin
        });
      }, event.messageID);

    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      
      const errorMsg = `╭══════════════════════╮
│   ⚡ **TRON ARES AI** ⚡   │
╰══════════════════════╯

┌──────────────────────┐
│   **AI ERROR**       │
├──────────────────────┤
│ Conversation         │
│ interrupted          │
│                      │
│ Please restart with: │
│ /gemini              │
└──────────────────────┘

🍿 *TRON ARES SYSTEM* 🎟️`;
      
      api.sendMessage(errorMsg, event.threadID, event.messageID);
    }
  },

  // Fonction pour nettoyer les sessions expirées
  onExit: function() {
    // Nettoyer les sessions vieilles de plus de 30 minutes
    const now = Date.now();
    for (const [key, value] of global.GoatBot.onReply.entries()) {
      if (value.commandName === this.config.name && (now - key) > 30 * 60 * 1000) {
        global.GoatBot.onReply.delete(key);
      }
    }
  }
};
