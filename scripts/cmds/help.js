const axios = require("axios");
const fs = require("fs");
const { getPrefix } = global.utils;
const { commands } = global.GoatBot;

let xfont = null;
let yfont = null;
let categoryEmoji = null;

/* ───── Load Fonts & Emoji ───── */
async function loadResources() {
  try {
    const [x, y, c] = await Promise.all([
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/xfont.json"),
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/yfont.json"),
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/category.json")
    ]);
    xfont = x.data;
    yfont = y.data;
    categoryEmoji = c.data;
  } catch (e) {
    console.error("[HELP] Resource load failed");
  }
}

/* ───── Font Convert ───── */
function fontConvert(text, type = "command") {
  const map = type === "category" ? xfont : yfont;
  if (!map) return text;
  return text.split("").map(c => map[c] || c).join("");
}

function getCategoryEmoji(cat) {
  const customEmojis = {
    "admin": "👑",
    "info": "📌",
    "economy": "💎",
    "game": "🎮",
    "fun": "🎉",
    "media": "📥",
    "system": "🖥️",
    "utility": "🧰",
    "nsfw": "🔞",
    "ai": "🤖",
    "image": "🌌",
    "tools": "🔧",
    "owner": "👑",
    "custom": "🛠️",
    "anime": "🎬",
    "bank": "🏦",
    "tron": "⚡"
  };
  return customEmojis[cat.toLowerCase()] || categoryEmoji?.[cat.toLowerCase()] || "🎁";
}

function roleText(role) {
  if (role === 0) return "All Users";
  if (role === 1) return "Group Admins";
  if (role === 2) return "Bot Admin";
  return "Unknown";
}

/* ───── Command Find ───── */
function findCommand(name) {
  name = name.toLowerCase();
  for (const [, cmd] of commands) {
    const a = cmd.config?.aliases;
    if (cmd.config?.name === name) return cmd;
    if (Array.isArray(a) && a.includes(name)) return cmd;
    if (typeof a === "string" && a === name) return cmd;
  }
  return null;
}

// Fonction pour créer une boîte décorative
function createBox(content, title = null) {
  let box = `╭═══✨✨✨═══╮\n`;
  if (title) {
    box += `│ ${title}\n`;
  }
  
  const lines = content.split('\n');
  lines.forEach(line => {
    if (line.trim() !== '') {
      box += `│ ${line}\n`;
    }
  });
  
  box += `╰═══✨✨✨✨═══╯`;
  return box;
}

// Fonction pour créer l'en-tête
function createHeader(userName) {
  const adminID = "61572476705473";
  
  return `╭═══✨✨✨═══╮
│ 🎄💙 *TRON ARES HELP SYSTEM* 💙🎄
│ Usuario: *${userName || "Guest"}*
│ Bot: *TRØN†ARËS†BØT*
│ Admin: *${adminID}*
╰═══✨✨✨✨═══╯\n\n`;
}

// Fonction pour télécharger et envoyer un GIF
async function sendWithGif(message, gifUrl, caption = "") {
  try {
    // Télécharger le GIF
    const response = await axios({
      method: 'GET',
      url: gifUrl,
      responseType: 'stream',
      timeout: 15000 // 15 secondes timeout
    });

    // Créer un fichier temporaire
    const gifPath = `./tron_ares_${Date.now()}.gif`;
    const writer = fs.createWriteStream(gifPath);
    
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Envoyer le message avec le GIF
    await message.reply({
      body: caption,
      attachment: fs.createReadStream(gifPath)
    });

    // Supprimer le fichier temporaire
    setTimeout(() => {
      try {
        if (fs.existsSync(gifPath)) {
          fs.unlinkSync(gifPath);
        }
      } catch (e) {
        console.error("Error deleting GIF:", e);
      }
    }, 5000);
    
  } catch (error) {
    console.error("Error sending GIF:", error.message);
    // Envoyer le message sans GIF en cas d'erreur
    await message.reply(caption + "\n\n🎬 *GIF TRON ARES non disponible*");
  }
}

// Collection de GIFs TRON ARES - Thème cyberpunk/technologique
const tronAresGifs = [
  // GIFs avec thème TRON : lumière bleue, circuits, grille numérique
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", // Effets de lumière bleue
  "https://media.giphy.com/media/xT0GqH01ZyKwd3aT3G/giphy.gif", // Circuits électroniques
  "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",  // Grille numérique
  "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif", // Animation cyberpunk
  "https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif",  // Énergie bleue
  "https://media.giphy.com/media/26ufdgrZhHp3QnEQY/giphy.gif",  // Interface holographique
  "https://media.giphy.com/media/3o7TKsQ8gTp3WqXqjq/giphy.gif", // Données qui s'écoulent
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", // Grid TRON
  "https://media.giphy.com/media/26tknCqiJrBQG6DrC/giphy.gif",  // Rétroéclairage bleu
  "https://media.giphy.com/media/xT0Gqn3yF1phSDzr8s/giphy.gif"  // Animation futuriste
];

// GIFs alternatifs si les premiers ne fonctionnent pas
const backupTronGifs = [
  "https://i.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",
  "https://i.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://i.giphy.com/media/xT0GqH01ZyKwd3aT3G/giphy.gif",
  "https://i.imgur.com/fJA5FX6.gif", // GIF TRON alternatif 1
  "https://i.imgur.com/V4hqK7H.gif", // GIF TRON alternatif 2
  "https://i.imgur.com/vvQmXJN.gif"  // GIF TRON alternatif 3
];

// Sélectionner un GIF aléatoire de TRON ARES
function getRandomTronGif() {
  try {
    // Essayer d'abord la collection principale
    const mainGif = tronAresGifs[Math.floor(Math.random() * tronAresGifs.length)];
    return mainGif;
  } catch (error) {
    // Fallback sur les GIFs de secours
    return backupTronGifs[Math.floor(Math.random() * backupTronGifs.length)];
  }
}

// Fonction pour créer le footer avec GIF TRON
function createTronFooter(prefix, totalCommands, category = null) {
  const randomGif = getRandomTronGif();
  
  let footerText = `┌─────────────────────┐\n`;
  footerText += `│  ⚡ **TRON ARES SYSTEM** ⚡  │\n`;
  footerText += `├─────────────────────┤\n`;
  
  if (category) {
    footerText += `│ 📁 Category: ${category}\n`;
  }
  
  footerText += `│ 📊 Commands: ${totalCommands}\n`;
  footerText += `│ ⚡ Prefix: ${prefix}\n`;
  footerText += `│ 🔍 Usage: ${prefix}help [command]\n`;
  footerText += `│ 📖 Example: ${prefix}help balance\n`;
  footerText += `└─────────────────────┘\n\n`;
  
  footerText += `🎬 *Powered by TRON ARES Technology* 🍿\n`;
  footerText += `꒰🍿˖°❗◯⃝🫟🎬TRØN†ARËS†BØT🍿⃤ ⃧🍧❓°˖ 🎟️ ꒱`;
  
  return {
    caption: footerText,
    gifUrl: randomGif
  };
}

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "start", "cmd", "tronhelp"],
    version: "3.1.0",
    author: "꒰🍿˖°❗◯⃝🫟🎬TRØN†ARËS†BØT🍿⃤ ⃧🍧❓°˖ 🎟️ ꒱",
    role: 0,
    category: "System",
    shortDescription: "Show all commands with TRON ARES style and animated GIFs",
    guide: "{pn} | {pn} <command> | {pn} -c <category> | {pn} all | {pn} basics",
    countDown: 3
  },

  onStart: async function ({ message, args, event, role }) {
    if (!xfont || !yfont || !categoryEmoji) await loadResources();

    const prefix = getPrefix(event.threadID);
    const input = args.join(" ").trim();
    const userName = (await global.utils.getUserInfo(event.senderID))?.name || "User";
    const adminID = "61572476705473";
    const isAdmin = event.senderID === adminID;

    /* ───── Collect Categories ───── */
    const categories = {};
    for (const [name, cmd] of commands) {
      if (!cmd?.config) continue;
      
      // Vérifier les permissions (admin voit tout)
      if (!isAdmin && cmd.config.role > role) continue;
      
      const cat = (cmd.config.category || "UNCATEGORIZED").toUpperCase();
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push({
        name: name,
        config: cmd.config
      });
    }

    /* ───── Mode "all" - Affichage complet ───── */
    if (args[0] === "all") {
      let result = createHeader(userName);
      
      // Ajouter un badge admin si c'est l'admin
      if (isAdmin) {
        result += `╭═══✨✨✨═══╮\n│ ⚡ *ADMIN MODE ACTIVATED*\n│ Full Grid Access Granted\n╰═══✨✨✨✨═══╯\n\n`;
      }

      // Ajouter une bannière TRON ARES
      result += `╭══════════════════════╮\n`;
      result += `│    TRON ARES GRID    │\n`;
      result += `│   COMMAND DATABASE   │\n`;
      result += `╰══════════════════════╯\n\n`;

      // Trier les catégories
      const sortedCategories = Object.keys(categories).sort();
      
      // Afficher chaque catégorie dans une boîte
      for (const cat of sortedCategories) {
        const categoryCommands = categories[cat]
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 8); // Limiter à 8 commandes
        
        if (categoryCommands.length > 0) {
          let boxContent = "";
          boxContent += `${getCategoryEmoji(cat)} *${fontConvert(cat, "category")}*\n`;
          boxContent += `├──────────────────┤\n`;
          
          categoryCommands.forEach((cmd, index) => {
            const cmdName = cmd.name;
            const displayName = ` ${index + 1}. ${prefix}${cmdName}`;
            boxContent += `│${displayName.padEnd(18)}│\n`;
          });
          
          if (categories[cat].length > 8) {
            boxContent += `│ +${categories[cat].length - 8} more`.padEnd(20) + `│\n`;
          }
          
          result += createBox(boxContent) + "\n\n";
        }
      }

      // Pied de page avec GIF TRON
      const totalCommands = Object.values(categories).reduce((a, b) => a + b.length, 0);
      const footer = createTronFooter(prefix, totalCommands);
      
      result += footer.caption;
      
      // Envoyer avec GIF TRON
      return await sendWithGif(message, footer.gifUrl, result);
    }

    /* ───── Mode "basics" - Commandes de base TRON ───── */
    if (args[0] === "basics") {
      const basicCommandsList = {
        "anisr": "🔍 Search anime in TRON database",
        "balance": "🏦 Check your digital credits",
        "gift": "🎁 Collect Grid rewards",
        "rank": "📊 View your TRON level",
        "pet": "🐾 Manage digital companions",
        "trade": "💱 Exchange in Grid market",
        "arena": "⚔️ Enter the Games Arena",
        "vault": "🔐 Secure storage system"
      };

      let result = createHeader(userName);
      
      result += `╭══════════════════════╮\n`;
      result += `│  TRON ARES BASICS    │\n`;
      result += `│  Essential Commands  │\n`;
      result += `╰══════════════════════╯\n\n`;
      
      result += `╭──────────────────────╮\n`;
      Object.entries(basicCommandsList).forEach(([cmd, desc]) => {
        result += `│ ⚡ ${prefix}${cmd.padEnd(12)} ${desc}\n`;
      });
      result += `╰──────────────────────╯\n\n`;
      
      const footer = createTronFooter(prefix, Object.keys(basicCommandsList).length, "BASICS");
      result += footer.caption;
      
      return await sendWithGif(message, footer.gifUrl, result);
    }

    /* ───── Category View (-c) ───── */
    if (args[0] === "-c" && args[1]) {
      const cat = args[1].toUpperCase();
      if (!categories[cat]) {
        return message.reply(`❌ Grid Sector "${cat}" not found`);
      }

      let msg = createHeader(userName);
      msg += `╭══════════════════════╮\n`;
      msg += `│  GRID SECTOR: ${cat.padEnd(6)} │\n`;
      msg += `╰══════════════════════╯\n\n`;

      // Afficher les commandes en format tableau
      msg += `┌─── Command List ────┐\n`;
      
      categories[cat]
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((cmd, index) => {
          const num = (index + 1).toString().padStart(2, '0');
          msg += `│ ${num}. ${prefix}${cmd.name.padEnd(15)} │\n`;
        });

      msg += `└──────────────────────┘\n\n`;
      
      const footer = createTronFooter(prefix, categories[cat].length, cat);
      msg += footer.caption;
      
      return await sendWithGif(message, footer.gifUrl, msg);
    }

    /* ───── Main Menu (sans arguments) ───── */
    if (!input) {
      let msg = createHeader(userName);
      
      // Ajouter un badge admin si c'est l'admin
      if (isAdmin) {
        msg += `╭═══✨✨✨═══╮\n│ ⚡ *GRID ADMIN ACCESS*\n│ System: FULL CONTROL\n╰═══✨✨✨✨═══╯\n\n`;
      }

      // Bannière d'accueil TRON
      msg += `╭══════════════════════╮\n`;
      msg += `│   WELCOME TO TRON    │\n`;
      msg += `│     ARES SYSTEM      │\n`;
      msg += `╰══════════════════════╯\n\n`;

      // Afficher les catégories principales avec style TRON
      const mainCategories = [
        { name: "ANIME", desc: "Digital Entertainment" },
        { name: "BANK", desc: "Credit Management" },
        { name: "GAME", desc: "Grid Games" },
        { name: "MEDIA", desc: "Data Streams" },
        { name: "AI", desc: "Artificial Intelligence" }
      ];
      
      mainCategories.forEach(({ name, desc }) => {
        if (categories[name] && categories[name].length > 0) {
          msg += `╭─ ${getCategoryEmoji(name)} ${name} ─╮\n`;
          msg += `│ ${desc}\n`;
          
          // Afficher 2-3 commandes exemple
          const examples = categories[name]
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, 3);
          
          examples.forEach(cmd => {
            msg += `│ ⚡ ${prefix}${cmd.name}\n`;
          });
          
          if (categories[name].length > 3) {
            msg += `│ ... ${categories[name].length - 3} more\n`;
          }
          
          msg += `╰──────────────────────╯\n\n`;
        }
      });

      // Navigation TRON
      msg += `╭─ QUICK NAVIGATION ─╮\n`;
      msg += `│ ${prefix}help all\n`;
      msg += `│ ${prefix}help basics\n`;
      msg += `│ ${prefix}help -c <sector>\n`;
      msg += `│ ${prefix}help <command>\n`;
      msg += `╰──────────────────────╯\n\n`;

      // Pied de page avec GIF TRON
      const totalCommands = Object.values(categories).reduce((a, b) => a + b.length, 0);
      const footer = createTronFooter(prefix, totalCommands);
      msg += footer.caption;
      
      return await sendWithGif(message, footer.gifUrl, msg);
    }

    /* ───── Command Info ───── */
    const cmd = findCommand(input);
    if (!cmd) {
      // Recherche approximative avec style TRON
      const allCommands = [];
      for (const [name, command] of commands) {
        if (command?.config) {
          allCommands.push(name);
          if (Array.isArray(command.config.aliases)) {
            allCommands.push(...command.config.aliases);
          }
        }
      }
      
      // Trouver les commandes similaires
      const similar = allCommands
        .filter(c => c.toLowerCase().includes(input.toLowerCase()))
        .slice(0, 3);
      
      let reply = createHeader(userName);
      reply += `╭══════════════════════╮\n`;
      reply += `│   COMMAND NOT FOUND  │\n`;
      reply += `╰══════════════════════╯\n\n`;
      reply += `❌ Command "${input}" not in Grid\n\n`;
      
      if (similar.length > 0) {
        reply += `⚡ Did you mean?\n`;
        reply += `├──────────────────────┤\n`;
        similar.forEach(s => {
          reply += `│ ${prefix}${s}\n`;
        });
        reply += `╰──────────────────────╯\n\n`;
      }
      
      const footer = createTronFooter(prefix, 0);
      reply += footer.caption;
      
      return await sendWithGif(message, footer.gifUrl, reply);
    }

    const c = cmd.config;
    const aliasText = Array.isArray(c.aliases)
      ? c.aliases.join(", ")
      : c.aliases || "None";

    let usage = "No usage data";
    if (c.guide) {
      if (typeof c.guide === "string") {
        usage = c.guide;
      } else if (typeof c.guide === "object") {
        usage = c.guide.en || Object.values(c.guide)[0] || "No usage";
      }
      usage = usage.replace(/{pn}/g, `${prefix}${c.name}`);
    }

    // Créer l'affichage détaillé avec style TRON
    const msg = createHeader(userName) + 
      `╭══════════════════════╮
│   COMMAND ANALYSIS   │
╰══════════════════════╯

╭─ COMMAND DATA ─╮
│ Name: ${prefix}${c.name}
│ Sector: ${(c.category || "UNCATEGORIZED").toUpperCase()}
│ Access: ${roleText(c.role)}
│ Version: ${c.version || "1.0"}
│ Author: ${c.author || "TRON SYSTEM"}
╰──────────────────────╯

╭─ DESCRIPTION ─╮
│ ${c.longDescription || c.shortDescription || "No description available"}
╰──────────────────────╯

╭─ USAGE PARAMETERS ─╮
│ Aliases: ${aliasText}
│ Usage: ${usage}
│ Cooldown: ${c.countDown || 5}s
│ Status: ⚡ ACTIVE
╰──────────────────────╯\n\n`;

    const footer = createTronFooter(prefix, 1);
    const fullMessage = msg + footer.caption;
    
    return await sendWithGif(message, footer.gifUrl, fullMessage);
  },

  // Fonction pour changer le nom de fichier temporaire
  onExit: function () {
    // Nettoyer les fichiers temporaires au démarrage
    const tempFiles = fs.readdirSync('./').filter(file => file.startsWith('tron_ares_'));
    tempFiles.forEach(file => {
      try {
        fs.unlinkSync(`./${file}`);
      } catch (e) {
        // Ignorer les erreurs de suppression
      }
    });
  }
};
