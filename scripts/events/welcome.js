const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "welcome",
    version: "3.0.0",
    author: "꒰🍿˖°❗◯⃝🫟🎬TRØN†ARËS†BØT🍿⃤ ⃧🍧❓°˖ 🎟️ ꒱",
    category: "events"
  },

  onStart: async function ({ api, event, message }) {
    if (event.logMessageType !== "log:subscribe") return;

    const { threadID, logMessageData } = event;
    const { addedParticipants } = logMessageData;
    const prefix = getPrefix(threadID);

    // Configuration du bot TRON ARES
    const tronNickname = "꒰TRØN†ARËS†BØT꒱";
    const adminID = "61572476705473";

    // Bot nick set function - Style TRON
    if (addedParticipants.some(user => user.userFbId === api.getCurrentUserID())) {
      try {
        await api.changeNickname(tronNickname, threadID, api.getCurrentUserID());
        
        // Message spécial quand le bot rejoint
        const botWelcomeMsg = `╭══════════════════════╮
│   ⚡ **TRON ARES ONLINE** ⚡   │
╰══════════════════════╯

🎬 *System Initialization Complete*
🍿 TRØN†ARËS†BØT has entered the Grid

🔧 *Available Commands:*
⚡ ${prefix}menu - Main interface
🎮 ${prefix}help - Command list
💎 ${prefix}balance - Check credits
🎁 ${prefix}gift - Collect rewards

⚙️ *Admin Contact:* ${adminID}
🎟️ *Enjoy the TRON experience!*`;

        await api.sendMessage({
          body: botWelcomeMsg
        }, threadID);

      } catch (error) {
        console.error("❌ Error setting TRON nickname:", error);
      }
      return;
    }

    // Vérifier si c'est le bot qui a été ajouté
    const botID = api.getCurrentUserID();
    if (addedParticipants.some(u => u.userFbId === botID)) return;

    const threadInfo = await api.getThreadInfo(threadID);
    const groupName = threadInfo.threadName || "TRON Grid";
    const memberCount = threadInfo.participantIDs.length;

    // Collection de GIFs TRON ARES pour les messages de bienvenue
    const tronWelcomeGifs = [
      "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", // Lumière bleue TRON
      "https://media.giphy.com/media/xT0GqH01ZyKwd3aT3G/giphy.gif", // Circuits électroniques
      "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",  // Grille numérique
      "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif", // Animation cyberpunk
      "https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif",  // Énergie bleue
      "https://media.giphy.com/media/26ufdgrZhHp3QnEQY/giphy.gif"   // Interface holographique
    ];

    for (const user of addedParticipants) {
      const userId = user.userFbId;
      const fullName = user.fullName;

      try {
        // Heure avec style TRON
        const timeStr = new Date().toLocaleString("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          weekday: "long",
          month: "short",
          day: "numeric"
        });

        // Vérifier si c'est l'admin qui rejoint
        const isAdmin = userId === adminID;
        const adminBadge = isAdmin ? "👑 " : "";

        // Message de bienvenue TRON ARES
        let welcomeMessage = `╭══════════════════════╮\n`;
        welcomeMessage += `│   🎬 **TRON ARES GRID** 🎬   │\n`;
        welcomeMessage += `╰══════════════════════╯\n\n`;
        
        welcomeMessage += `⚡ **USER DETECTED** ⚡\n`;
        welcomeMessage += `┌──────────────────────┐\n`;
        welcomeMessage += `│ ${adminBadge}${fullName}\n`;
        welcomeMessage += `│ 🆔 ${userId}\n`;
        welcomeMessage += `└──────────────────────┘\n\n`;
        
        welcomeMessage += `🌐 **GRID ENTRY**\n`;
        welcomeMessage += `├ Sector: ${groupName}\n`;
        welcomeMessage += `├ Position: #${memberCount}\n`;
        welcomeMessage += `├ Access Level: ${isAdmin ? "ADMINISTRATOR" : "USER"}\n`;
        welcomeMessage += `└ System Time: ${timeStr}\n\n`;
        
        welcomeMessage += `🔧 **QUICK START**\n`;
        welcomeMessage += `│ ${prefix}menu - Main interface\n`;
        welcomeMessage += `│ ${prefix}help - Command database\n`;
        welcomeMessage += `│ ${prefix}balance - Check credits\n`;
        welcomeMessage += `│ ${prefix}gift - Daily rewards\n\n`;
        
        if (isAdmin) {
          welcomeMessage += `👑 **ADMIN PRIVILEGES ACTIVATED**\n`;
          welcomeMessage += `│ Full system access granted\n`;
          welcomeMessage += `│ Use ${prefix}admin for controls\n\n`;
        }
        
        welcomeMessage += `🍿 *Welcome to the TRON ARES System!*\n`;
        welcomeMessage += `꒰TRØN†ARËS†BØT꒱ is pleased to have you.\n`;
        welcomeMessage += `⚡ Enjoy your journey in the digital Grid!`;

        // Sélectionner un GIF TRON aléatoire
        const randomGif = tronWelcomeGifs[Math.floor(Math.random() * tronWelcomeGifs.length)];
        
        // Créer un répertoire temporaire
        const tmp = path.join(__dirname, "..", "cache");
        await fs.ensureDir(tmp);
        const gifPath = path.join(tmp, `tron_welcome_${userId}_${Date.now()}.gif`);

        try {
          // Télécharger le GIF TRON
          const response = await axios({
            method: 'GET',
            url: randomGif,
            responseType: 'arraybuffer',
            timeout: 10000
          });
          
          fs.writeFileSync(gifPath, response.data);

          // Envoyer le message avec le GIF TRON
          await api.sendMessage({
            body: welcomeMessage,
            attachment: fs.createReadStream(gifPath),
            mentions: [{ tag: fullName, id: userId }]
          }, threadID);

          // Nettoyer le fichier GIF
          setTimeout(() => {
            try {
              if (fs.existsSync(gifPath)) {
                fs.unlinkSync(gifPath);
              }
            } catch (cleanError) {
              console.error("Error cleaning GIF:", cleanError);
            }
          }, 5000);

        } catch (gifError) {
          console.error("❌ Error downloading TRON GIF:", gifError.message);
          
          // Fallback: Essayer avec l'API d'image originale
          try {
            const apiUrl = `https://xsaim8x-xxx-api.onrender.com/api/welcome?name=${encodeURIComponent(fullName)}&uid=${userId}&threadname=${encodeURIComponent(groupName)}&members=${memberCount}&theme=tron`;
            const imagePath = path.join(tmp, `welcome_${userId}.png`);

            const imageResponse = await axios.get(apiUrl, { responseType: "arraybuffer" });
            fs.writeFileSync(imagePath, imageResponse.data);

            await api.sendMessage({
              body: welcomeMessage,
              attachment: fs.createReadStream(imagePath),
              mentions: [{ tag: fullName, id: userId }]
            }, threadID);

            fs.unlinkSync(imagePath);

          } catch (imageError) {
            console.error("❌ Error with image API:", imageError.message);
            
            // Dernier recours: message texte seulement
            await api.sendMessage({
              body: welcomeMessage,
              mentions: [{ tag: fullName, id: userId }]
            }, threadID);
          }
        }

      } catch (err) {
        console.error("❌ Error in welcome process:", err);
        
        // Message d'erreur minimal
        try {
          await api.sendMessage({
            body: `⚡ Welcome ${fullName} to ${groupName}!\nYou're member #${memberCount}\nUse ${prefix}help to start`,
            mentions: [{ tag: fullName, id: userId }]
          }, threadID);
        } catch (finalError) {
          console.error("❌ Final welcome error:", finalError);
        }
      }
    }
  },

  // Fonction optionnelle pour nettoyer les fichiers temporaires
  onExit: function () {
    try {
      const cacheDir = path.join(__dirname, "..", "cache");
      if (fs.existsSync(cacheDir)) {
        const files = fs.readdirSync(cacheDir);
        files.forEach(file => {
          if (file.includes("tron_welcome_") || file.includes("welcome_")) {
            try {
              fs.unlinkSync(path.join(cacheDir, file));
            } catch (e) {
              // Ignorer les erreurs de suppression
            }
          }
        });
      }
    } catch (error) {
      console.error("Error cleaning welcome cache:", error);
    }
  }
};
