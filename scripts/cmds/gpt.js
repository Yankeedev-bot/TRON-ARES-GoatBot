const axios = require('axios');

// Configuration TRON ARES
const apiKey = ""; // À remplir avec votre clé API OpenAI
const maxTokens = 800;
const numberGenerateImage = 4;
const maxStorageMessage = 8; // Augmenté pour de meilleures conversations

// Initialisation des variables globales TRON
if (!global.temp.tronAIUsing)
	global.temp.tronAIUsing = {};
if (!global.temp.tronAIHistory)
	global.temp.tronAIHistory = {};

const { tronAIUsing, tronAIHistory } = global.temp;

// GIFs TRON ARES pour les réponses
const tronAIGifs = [
	"https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
	"https://media.giphy.com/media/xT0GqH01ZyKwd3aT3G/giphy.gif",
	"https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",
	"https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
	"https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif"
];

module.exports = {
	config: {
		name: "gpt",
		aliases: ["ai", "tronai", "chatgpt", "ask"],
		version: "3.0.0",
		author: "꒰🍿˖°❗◯⃝🫟🎬TRØN†ARËS†BØT🍿⃤ ⃧🍧❓°˖ 🎟️ ꒱",
		countDown: 3,
		role: 0,
		description: {
			en: "TRON ARES AI - Advanced GPT-4 assistant with image generation"
		},
		category: "AI",
		guide: {
			en: `╭══════════════════════╮
│   **TRON ARES AI**   │
╰══════════════════════╯

⚡ **COMMANDS**
├ ${1}gpt <prompt>
│   Chat with TRON AI
│   Example: ${1}gpt Hello
│
├ ${1}gpt draw <prompt>
│   Generate AI images
│   Example: ${1}gpt draw cyberpunk city
│
├ ${1}gpt clear
│   Clear conversation history
│
├ ${1}gpt model <name>
│   Switch AI model
│   Options: gpt-4, gpt-3.5
│
⚡ Reply to any AI message to continue conversation

🎬 *Powered by OpenAI & TRON ARES Technology*`
		}
	},

	langs: {
		en: {
			apiKeyEmpty: `╭══════════════════════╮
│   **CONFIG ERROR**   │
╰══════════════════════╯

❌ **SYSTEM CONFIGURATION**
├ Issue: Missing API Key
├ Service: OpenAI
├ File: gpt.js
└ Status: INACTIVE

🔧 *Please configure API key in:*
📁 scripts/cmds/gpt.js
👑 Contact admin: 61572476705473

⚡ *TRON ARES AI requires OpenAI API key*`,
			
			invalidContentDraw: `╭══════════════════════╮
│   **INPUT ERROR**    │
╰══════════════════════╯

❌ **MISSING PROMPT**
├ Action: Image generation
├ Error: No content provided
├ Required: Image description
└ Status: REJECTED

🎬 *Please provide image description:*
⚡ Example: ${1}gpt draw futuristic city`,
			
			yourAreUsing: `╭══════════════════════╮
│   **SYSTEM BUSY**    │
╰══════════════════════╯

⚠️ **REQUEST QUEUED**
├ Status: Processing previous
├ Action: Please wait
├ Queue: 1 request ahead
└ Estimated: < 1 minute

⚡ *TRON ARES is processing your previous request*
🎬 Please wait for completion...`,
			
			processingRequest: `╭══════════════════════╮
│ **PROCESSING** ⚡ │
╰══════════════════════╯

🌀 **AI ENGINE ACTIVE**
├ Model: GPT-4 Turbo
├ Task: Processing request
├ Time: 10-30 seconds
└ Status: ANALYZING

🎬 *TRON ARES is thinking...*
⚡ Please wait for the response`,
			
			processingImage: `╭══════════════════════╮
│ **GENERATING** 🎨 │
╰══════════════════════╯

🖼️ **IMAGE CREATION**
├ Model: DALL-E 3
├ Quantity: ${numberGenerateImage} images
├ Quality: 1024x1024 HD
└ Time: 15-45 seconds

🎬 *TRON ARES is creating your images...*
⚡ Please wait...`,
			
			invalidContent: `╭══════════════════════╮
│   **INPUT ERROR**    │
╰══════════════════════╯

❌ **EMPTY REQUEST**
├ Action: AI Conversation
├ Error: No message provided
├ Required: Text input
└ Status: REJECTED

💬 *Please provide your question:*
⚡ Example: ${1}gpt What is TRON?`,
			
			error: `╭══════════════════════╮
│   **AI ERROR**      │
╰══════════════════════╯

❌ **SYSTEM MALFUNCTION**
├ Service: OpenAI API
├ Error: %1
├ Time: ${new Date().toLocaleTimeString()}
└ Status: FAILED

🔧 **TROUBLESHOOTING**
1. Check internet connection
2. Wait 1 minute
3. Try again
4. Contact admin if persists

👑 Admin: 61572476705473
⚡ *TRON ARES AI temporarily unavailable*`,
			
			clearHistory: `╭══════════════════════╮
│ **MEMORY CLEARED** 🧠│
╰══════════════════════╯

✅ **CONVERSATION RESET**
├ Action: History cleared
├ Messages: 0 remaining
├ Context: Fresh start
└ Status: COMPLETED

🎬 *TRON ARES memory has been cleared*
⚡ Ready for new conversation`,
			
			modelSwitched: `╭══════════════════════╮
│ **MODEL CHANGED** 🔄│
╰══════════════════════╯

✅ **AI MODEL UPDATED**
├ New Model: %1
├ Capabilities: %2
├ Speed: %3
└ Status: ACTIVE

⚡ *TRON ARES is now using %1*
🎬 Experience enhanced AI interactions`
		}
	},

	onStart: async function ({ message, event, args, getLang, prefix, commandName }) {
		const adminID = "61572476705473";
		const isAdmin = event.senderID === adminID;
		const userName = (await global.utils.getUserInfo(event.senderID))?.name || "User";
		
		// Vérifier la clé API
		if (!apiKey)
			return message.reply(getLang('apiKeyEmpty', prefix));

		// Commande draw/image
		if (['img', 'image', 'draw'].includes(args[0])) {
			if (!args[1])
				return message.reply(getLang('invalidContentDraw', prefix));
			
			if (tronAIUsing[event.senderID])
				return message.reply(getLang("yourAreUsing"));

			tronAIUsing[event.senderID] = true;

			let sending;
			try {
				sending = message.reply(getLang('processingImage'));
				
				// Message d'en-tête pour l'image
				const headerMsg = `╭══════════════════════╮
│   **TRON ARES ART**   │
╰══════════════════════╯

📊 **GENERATION DETAILS**
├ User: ${userName.substring(0, 12)}${isAdmin ? ' 👑' : ''}
├ Prompt: ${args.slice(1).join(' ').substring(0, 50)}${args.slice(1).join(' ').length > 50 ? '...' : ''}
├ Model: DALL-E 3
├ Quality: 1024x1024 HD
└ Images: ${numberGenerateImage}`;
				
				await message.reply(headerMsg);

				const responseImage = await axios({
					url: "https://api.openai.com/v1/images/generations",
					method: "POST",
					headers: {
						"Authorization": `Bearer ${apiKey}`,
						"Content-Type": "application/json"
					},
					data: {
						prompt: args.slice(1).join(' '),
						n: numberGenerateImage,
						size: '1024x1024',
						quality: 'hd',
						style: 'vivid'
					}
				});
				
				const imageUrls = responseImage.data.data;
				const images = await Promise.all(imageUrls.map(async (item, index) => {
					const image = await axios.get(item.url, {
						responseType: 'stream'
					});
					image.data.path = `tron_art_${Date.now()}_${index}.png`;
					return image.data;
				}));
				
				// Message de succès
				const successMsg = `✅ **IMAGE GENERATION COMPLETE**
├ Status: SUCCESS
├ Created: ${images.length} images
├ Time: ${new Date().toLocaleTimeString()}
└ Quality: HD

🎬 *TRON ARES has created your artwork*
⚡ Use ${prefix}gpt draw <prompt> for more`;
				
				return message.reply({
					body: successMsg,
					attachment: images
				});
			}
			catch (err) {
				const errorMessage = err.response?.data.error?.message || err.message || "Unknown error";
				return message.reply(getLang('error', errorMessage));
			}
			finally {
				delete tronAIUsing[event.senderID];
				if (sending)
					message.unsend((await sending).messageID);
			}
		}
		
		// Commande clear
		else if (args[0] === 'clear') {
			tronAIHistory[event.senderID] = [];
			return message.reply(getLang('clearHistory'));
		}
		
		// Commande model switch
		else if (args[0] === 'model' && args[1]) {
			const model = args[1].toLowerCase();
			let modelName, capabilities, speed;
			
			if (model.includes('4')) {
				modelName = "GPT-4 Turbo";
				capabilities = "Advanced reasoning, 128K context";
				speed = "Medium";
			} else if (model.includes('3')) {
				modelName = "GPT-3.5 Turbo";
				capabilities = "Fast response, 16K context";
				speed = "Fast";
			} else {
				return message.reply(`❌ Invalid model. Use: ${prefix}gpt model gpt-4 or ${prefix}gpt model gpt-3.5`);
			}
			
			// Stocker le modèle préféré (simulation)
			if (!global.temp.tronAIModels)
				global.temp.tronAIModels = {};
			global.temp.tronAIModels[event.senderID] = modelName;
			
			return message.reply(getLang('modelSwitched', modelName, capabilities, speed));
		}
		
		// Conversation normale
		else {
			if (!args[0])
				return message.reply(getLang('invalidContent', prefix));

			handleTronAI(event, message, args, getLang, commandName, userName, isAdmin);
		}
	},

	onReply: async function ({ Reply, message, event, args, getLang, commandName }) {
		const { author } = Reply;
		if (author != event.senderID)
			return;

		const userName = (await global.utils.getUserInfo(event.senderID))?.name || "User";
		const isAdmin = event.senderID === "61572476705473";
		
		handleTronAI(event, message, args, getLang, commandName, userName, isAdmin);
	}
};

async function askTronAI(event, model = "gpt-4-turbo-preview") {
	// Vérifier le modèle préféré de l'utilisateur
	let finalModel = model;
	if (global.temp.tronAIModels && global.temp.tronAIModels[event.senderID]) {
		if (global.temp.tronAIModels[event.senderID].includes('GPT-4'))
			finalModel = "gpt-4-turbo-preview";
		else
			finalModel = "gpt-3.5-turbo-0125";
	}

	const response = await axios({
		url: "https://api.openai.com/v1/chat/completions",
		method: "POST",
		headers: {
			"Authorization": `Bearer ${apiKey}`,
			"Content-Type": "application/json"
		},
		data: {
			model: finalModel,
			messages: tronAIHistory[event.senderID],
			max_tokens: maxTokens,
			temperature: 0.8,
			top_p: 0.9,
			frequency_penalty: 0.2,
			presence_penalty: 0.1
		}
	});
	return response;
}

async function handleTronAI(event, message, args, getLang, commandName, userName, isAdmin) {
	try {
		// Vérifier si l'utilisateur est déjà en train d'utiliser l'AI
		if (tronAIUsing[event.senderID])
			return message.reply(getLang("yourAreUsing"));

		tronAIUsing[event.senderID] = true;

		// Message de traitement
		const processingMsg = getLang('processingRequest');
		const sending = await message.reply(processingMsg);

		// Initialiser l'historique si nécessaire
		if (
			!tronAIHistory[event.senderID] ||
			!Array.isArray(tronAIHistory[event.senderID])
		) {
			tronAIHistory[event.senderID] = [
				{
					role: 'system',
					content: `You are TRON ARES AI, an advanced AI assistant with a cyberpunk/TRON theme. 
					You speak in a futuristic, technical style. Use terms like "Grid", "System", "Digital", "Circuit", "Byte". 
					You're created by ꒰🍿˖°❗◯⃝🫟🎬TRØN†ARËS†BØT🍿⃤ ⃧🍧❓°˖ 🎟️ ꒱. 
					The user's name is ${userName}. ${isAdmin ? 'User is SYSTEM ADMINISTRATOR with full privileges.' : ''}
					Keep responses engaging and in theme.`
				}
			];
		}

		// Limiter l'historique
		if (tronAIHistory[event.senderID].length >= maxStorageMessage)
			tronAIHistory[event.senderID].splice(1, 2); // Garder le message système

		// Ajouter le message de l'utilisateur
		tronAIHistory[event.senderID].push({
			role: 'user',
			content: args.join(' ')
		});

		// Obtenir la réponse de l'AI
		const response = await askTronAI(event);
		const text = response.data.choices[0].message.content;

		// Ajouter la réponse à l'historique
		tronAIHistory[event.senderID].push({
			role: 'assistant',
			content: text
		});

		// Formater la réponse avec style TRON
		const formattedResponse = `╭══════════════════════╮
│   **TRON ARES AI**   │
╰══════════════════════╯

📊 **CONVERSATION DATA**
├ User: ${userName.substring(0, 12)}${isAdmin ? ' 👑' : ''}
├ Context: ${tronAIHistory[event.senderID].length - 1} messages
├ Model: ${response.data.model}
├ Tokens: ${response.data.usage.total_tokens}
└ Time: ${new Date().toLocaleTimeString()}

💬 **RESPONSE**
${text}

⚡ **CONTINUE CONVERSATION**
│ Reply to this message
│ or type: ${global.GoatBot.config.prefix}gpt <message>
│
│ ${global.GoatBot.config.prefix}gpt clear - Reset chat
│ ${global.GoatBot.config.prefix}gpt draw - Generate images

🎬 *Powered by OpenAI & TRON ARES Technology*
🍿 Version: 3.0.0 | Admin: 61572476705473`;

		// Supprimer le message de traitement
		message.unsend(sending.messageID);

		// Envoyer la réponse
		return message.reply(formattedResponse, (err, info) => {
			global.GoatBot.onReply.set(info.messageID, {
				commandName,
				author: event.senderID,
				messageID: info.messageID
			});
		});
	}
	catch (err) {
		const errorMessage = err.response?.data?.error?.message || err.message || "Connection error";
		return message.reply(getLang('error', errorMessage));
	}
	finally {
		delete tronAIUsing[event.senderID];
	}
}

// Fonction de nettoyage automatique
setInterval(() => {
	const now = Date.now();
	for (const userId in tronAIHistory) {
		// Supprimer les historiques vieux de 2 heures
		if (tronAIHistory[userId].timestamp && (now - tronAIHistory[userId].timestamp) > 2 * 60 * 60 * 1000) {
			delete tronAIHistory[userId];
		}
	}
}, 30 * 60 * 1000); // Vérifier toutes les 30 minutes
