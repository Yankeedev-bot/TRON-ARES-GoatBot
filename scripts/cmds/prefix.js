const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "3.0.0",
    author: "꒰🍿˖°❗◯⃝🫟🎬TRØN†ARËS†BØT🍿⃤ ⃧🍧❓°˖ 🎟️ ꒱",
    countDown: 3,
    role: 0,
    description: "Configure the command prefix in TRON ARES System",
    category: "⚙️ Configuration",
    guide: {
      en:
        `╭══════════════════════╮
│   **PREFIX GUIDE**   │
╰══════════════════════╯

⚡ **USAGE**
├ ${1}prefix <new prefix>
│   Set prefix for this chat
│   Example: ${1}prefix $
│
├ ${1}prefix <new prefix> -g
│   Set global prefix (Admin only)
│   Example: ${1}prefix $ -g
│
├ ${1}prefix reset
│   Reset to default prefix
│
├ ${1}prefix (without args)
│   Show current prefix settings

🎬 *TRON ARES System* ⚡`
    }
  },

  langs: {
    en: {
      reset:
        `╭══════════════════════╮
│   **PREFIX RESET**   │
╰══════════════════════╯

✅ **SYSTEM UPDATE**
├ Action: Prefix reset
├ Status: COMPLETED
├ New prefix: %1
└ Default: TRON Standard

⚡ *System configuration updated*
🍿 TRON ARES is now using default prefix`,
      
      onlyAdmin:
        `╭══════════════════════╮
│   **ACCESS DENIED**   │
╰══════════════════════╯

❌ **PERMISSION ERROR**
├ User: Unauthorized
├ Action: Global prefix change
├ Required: ADMINISTRATOR
├ Your role: USER
└ Status: DENIED

🔒 *Only system administrators can modify global settings*
👑 Admin ID: 61572476705473`,
      
      confirmGlobal:
        `╭══════════════════════╮
│ **GLOBAL PREFIX** ⚡ │
╰══════════════════════╯

⚠️ **CONFIRMATION REQUIRED**
├ Change type: GLOBAL
├ New prefix: %1
├ Scope: All chats
├ Impact: System-wide
└ Action: Irreversible

🎬 *React to this message to confirm*
⚡ This will affect all TRON ARES users`,
      
      confirmThisThread:
        `╭══════════════════════╮
│  **CHAT PREFIX**  🎬 │
╰══════════════════════╯

⚠️ **CONFIRMATION REQUIRED**
├ Change type: CHAT
├ New prefix: %1
├ Scope: This group only
├ Impact: Local only
└ Action: Reversible

🎬 *React to this message to confirm*
💬 Only this chat will be affected`,
      
      successGlobal:
        `╭══════════════════════╮
│ **UPDATE COMPLETE** ⚡│
╰══════════════════════╯

✅ **GLOBAL PREFIX UPDATED**
├ New prefix: %1
├ Scope: System-wide
├ Status: ACTIVE
├ Users affected: ALL
└ Time: Now

🎬 *All TRON ARES chats updated*
⚡ System ready with new prefix`,
      
      successThisThread:
        `╭══════════════════════╮
│ **UPDATE COMPLETE** 🎬│
╰══════════════════════╯

✅ **CHAT PREFIX UPDATED**
├ New prefix: %1
├ Scope: This group only
├ Status: ACTIVE
├ Group: Current only
└ Time: Now

💬 *Chat configuration updated*
🎬 TRON ARES ready with new prefix`,
      
      myPrefix:
        `╭══════════════════════╮
│  **PREFIX STATUS**  ⚡│
╰══════════════════════╯

📊 **SYSTEM CONFIGURATION**
├ 🌍 Global prefix: %1
├ 💬 Chat prefix: %2
├ 👤 User: %3
├ 🆔 Thread: %4
└ ⚡ System: TRON ARES

🎬 **QUICK START**
│ Use %5help for commands
│ Example: %5menu
│ %5ai for AI assistant
│ %5balance for credits

🍿 *TRON ARES Command System*
⚡ Version: 3.0.0`
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    const adminID = "61572476705473";
    const isAdmin = event.senderID === adminID;
    const userName = (await global.utils.getUserInfo(event.senderID))?.name || "User";
    
    // Si aucun argument n'est fourni, afficher le statut actuel
    if (!args[0]) {
      const globalPrefix = global.GoatBot.config.prefix;
      const threadPrefix = await threadsData.get(event.threadID, "data.prefix") || globalPrefix;
      
      return message.reply(getLang("myPrefix", 
        globalPrefix, 
        threadPrefix, 
        `${userName}${isAdmin ? ' 👑' : ''}`, 
        event.threadID,
        threadPrefix
      ));
    }

    // Commande reset
    if (args[0].toLowerCase() === "reset") {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    
    // Validation du préfixe
    if (newPrefix.length > 5) {
      return message.reply(`╭══════════════════════╮
│   **INVALID PREFIX**   │
╰══════════════════════╯

❌ **VALIDATION ERROR**
├ Issue: Prefix too long
├ Maximum: 5 characters
├ Current: ${newPrefix.length}
└ Action: Rejected

🎬 *Please use a shorter prefix*
⚡ Example: !, $, /, .`);
    }

    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix,
      setGlobal: args[1] === "-g",
      userName: userName,
      isAdmin: isAdmin
    };

    // Vérification des permissions pour le changement global
    if (formSet.setGlobal && !isAdmin) {
      return message.reply(getLang("onlyAdmin"));
    }

    // Message de confirmation
    const confirmMessage = formSet.setGlobal 
      ? getLang("confirmGlobal", newPrefix)
      : getLang("confirmThisThread", newPrefix);
    
    return message.reply(confirmMessage, (err, info) => {
      formSet.messageID = info.messageID;
      global.GoatBot.onReaction.set(info.messageID, formSet);
      
      // Ajouter une réaction initiale
      message.react("⚡", info.messageID);
    });
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal, userName, isAdmin } = Reaction;
    
    // Vérifier que c'est bien l'auteur de la demande
    if (event.userID !== author) {
      return message.reply(`╭══════════════════════╮
│   **UNAUTHORIZED**    │
╰══════════════════════╯

❌ **ACTION REJECTED**
├ Reason: Not the requester
├ Requester: ${userName || 'Unknown'}
├ Current user: Different
└ Status: CANCELLED

🎬 *Only ${userName || 'the requester'} can confirm this change*
⚡ Operation cancelled`);
    }

    // Changer la réaction pour indiquer le traitement
    await message.react("⏳", Reaction.messageID);

    if (setGlobal) {
      // Sauvegarder l'ancien préfixe
      const oldPrefix = global.GoatBot.config.prefix;
      global.GoatBot.config.prefix = newPrefix;
      
      try {
        fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
        
        // Réaction de succès
        await message.react("✅", Reaction.messageID);
        
        // Log de l'action
        console.log(`[TRON ARES] Global prefix changed by ${userName} (${author}): ${oldPrefix} -> ${newPrefix}`);
        
        return message.reply(getLang("successGlobal", newPrefix));
      } catch (error) {
        // Réaction d'erreur
        await message.react("❌", Reaction.messageID);
        
        console.error("[TRON ARES] Error saving global prefix:", error);
        
        return message.reply(`╭══════════════════════╮
│   **SAVE ERROR**     │
╰══════════════════════╯

❌ **SYSTEM ERROR**
├ Action: Save configuration
├ File: config.json
├ Error: Write failed
└ Status: FAILED

🔧 *Please contact system administrator*
👑 Admin ID: 61572476705473`);
      }
    }

    // Changer le préfixe pour ce thread seulement
    const oldPrefix = await threadsData.get(event.threadID, "data.prefix") || global.GoatBot.config.prefix;
    
    try {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      
      // Réaction de succès
      await message.react("✅", Reaction.messageID);
      
      // Log de l'action
      console.log(`[TRON ARES] Thread prefix changed by ${userName} (${author}) in thread ${event.threadID}: ${oldPrefix} -> ${newPrefix}`);
      
      return message.reply(getLang("successThisThread", newPrefix));
    } catch (error) {
      // Réaction d'erreur
      await message.react("❌", Reaction.messageID);
      
      console.error("[TRON ARES] Error saving thread prefix:", error);
      
      return message.reply(`╭══════════════════════╮
│   **DATABASE ERROR**  │
╰══════════════════════╯

❌ **STORAGE ERROR**
├ Action: Save chat settings
├ Database: Thread data
├ Error: ${error.message}
└ Status: FAILED

🔧 *Please try again later*
⚡ System maintenance may be required`);
    }
  },

  onChat: async function ({ event, message, threadsData }) {
    const globalPrefix = global.GoatBot.config.prefix;
    const threadPrefix = await threadsData.get(event.threadID, "data.prefix") || globalPrefix;
    
    // Répondre quand quelqu'un tape "prefix" seul
    if (event.body && event.body.toLowerCase() === "prefix") {
      const userName = (await global.utils.getUserInfo(event.senderID))?.name || "User";
      const adminID = "61572476705473";
      const isAdmin = event.senderID === adminID;
      
      return message.reply({
        body: `╭══════════════════════╮
│  **PREFIX STATUS**  ⚡│
╰══════════════════════╯

📊 **SYSTEM CONFIGURATION**
├ 🌍 Global prefix: ${globalPrefix}
├ 💬 Chat prefix: ${threadPrefix}
├ 👤 User: ${userName.substring(0, 15)}${isAdmin ? ' 👑' : ''}
├ 🆔 Thread: ${event.threadID}
└ ⚡ System: TRON ARES

🎬 **QUICK COMMANDS**
│ ${threadPrefix}menu - Main interface
│ ${threadPrefix}help - All commands
│ ${threadPrefix}ai - AI Assistant
│ ${threadPrefix}balance - Credits

🔧 **CHANGE PREFIX**
│ ${threadPrefix}prefix <new>
│ ${threadPrefix}prefix reset

🍿 *TRON ARES Command System*
⚡ Version: 3.0.0 | Admin: ${adminID}`,
        attachment: await utils.getStreamFromURL("https://files.catbox.moe/ykk54z.jpg")
      });
    }
    
    // Répondre quand quelqu'un tape "prefijo" (espagnol)
    if (event.body && event.body.toLowerCase() === "prefijo") {
      return message.reply(`🎬 *Para ver el prefijo actual, usa:* ${threadPrefix}prefix\n⚡ *Para cambiar:* ${threadPrefix}prefix <nuevo>`);
    }
  },

  // Fonction de nettoyage des réactions expirées
  onExit: function() {
    // Nettoyer les réactions vieilles de plus de 10 minutes
    const now = Date.now();
    for (const [key, value] of global.GoatBot.onReaction.entries()) {
      if (value.commandName === this.config.name && (now - key) > 10 * 60 * 1000) {
        global.GoatBot.onReaction.delete(key);
      }
    }
  }
};
