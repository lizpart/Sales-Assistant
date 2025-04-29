const dotenv = require("dotenv");
const axios = require("axios");
const { Telegraf } = require("telegraf");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");
const cron = require("node-cron");

dotenv.config();

// Initialize services
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// MongoDB Setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  username: String,
  messages: [
    {
      text: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  lastRecommendationAt: { type: Date, default: new Date(0) }
});

const User = mongoose.model("User", userSchema);

// --- Utility Functions ---

// Save user message
async function logUserMessage(userId, username, text) {
  try {
    await User.updateOne(
      { userId },
      { 
        $setOnInsert: { username },
        $push: { messages: { text, timestamp: new Date() } }
      },
      { upsert: true }
    );
    console.log(`💬 Saved message for user ${userId}: "${text}"`);
  } catch (error) {
    console.error(`❌ Failed to log user message (${userId}):`, error);
  }
}

// Let Gemini answer normally
async function chatWithGemini(userMessage) {
  const prompt = `
You are a warm, helpful Davis & Shirtliff assistant based in Kenya. 
You assist customers about our products (pumps, solar, swimming pool, borehole, irrigation, water treatment).

Here is the reference:
{
  "inventory_posting_groups": {
    "CAT01": "Spare Parts",
    "CAT02": "Miscellaneous Store",
    "CAT04": "Pumps",
    "CAT08": "Solar Equipment",
    "CAT10": "Pool Equipment",
    "CAT11": "Borehole Equipment",
    "CAT12": "Water Treatment",
    "CAT15": "Waste Water Systems",
    "CAT16": "Irrigation Systems",
    "CAT18": "Chemical Products",
    "CAT19": "Digital Engineering Solutions",
    "CAT39": "Non-Stock Items",
    "CAT40": "Finished Goods",
    "CAT51": "Transport Equipment"
  },
  "product_categories": {
    "pool": {
      "fittings": ["Valves", "Jets", "Strainers", "Thermometers"],
      "systems": ["Spas", "Heat Pumps", "Solar Heaters"]
    },
    "solar": {
      "components": ["Inverters", "Controllers", "Panels", "Batteries"],
      "systems": ["Grid-Tie", "Hybrid", "Pump Kits"]
    },
    "pumps": {
      "types": ["Submersible", "Centrifugal", "Diaphragm", "Axial Piston"],
      "brands": ["Dayliff", "Pedrollo", "Grundfos", "DAB"]
    },
    "irrigation": {
      "drip": ["Tapes", "Emitters", "Kits"],
      "sprinklers": ["Impact", "Rotary", "Pop-Up"],
      "controls": ["Timers", "Solenoids", "Weather Stations"]
    },
    "water_treatment": {
      "filtration": ["RO Membranes", "UV Systems", "Sediment Filters"],
      "chemical": ["Disinfection", "pH Adjusters", "Scale Inhibitors"]
    }
  },
  "brands": [
    "Dayliff", "Pedrollo", "Grundfos", "Hunter", "Lorentz", 
    "Growatt", "Schneider", "DAB", "Davey", "KSB", 
    "Victron", "JA Solar", "Must", "Deye", "BYD"
  ],
  "special_tags": [
    "Eshop_Available", "Heavy_Duty", "Corrosion_Resistant",
    "High_Pressure", "Food_Grade", "Potable_Water"
  ]
}


- Speak friendly, but always vary your opening greetings. DO NOT always say "Mambo" or "Poa Sana" in every message.  
- Use different greetings naturally like: "Sasa!", "Vipi!", "Habari yako!", "Niaje boss!", "Karibu!" sometimes. Mix in some casual English too like "Hello there!", "Hey boss!", "Hi! How can I help you today?".
- Don't sound robotic or scripted. Switch tones naturally based on user mood and language (English / Kiswahili / Sheng).
- If user asks something not related to Davis & Shirtliff, politely redirect them.
- Keep sentences short, friendly and a little local flavor. Use simple, clear language.

Here’s the conversation:

User: "${userMessage}"

Now reply as the Davis & Shirtliff seller, keeping the above spirit!
Respond:

  `;
  console.log("🤖 Sending message to Gemini...");
  try {
    const result = await model.generateContent(prompt);
    const reply = result.response.text().trim();
    console.log("✅ Gemini responded successfully");
    return reply;
  } catch (error) {
    console.error("❌ Gemini error:", error);
    return "⚡ Sorry, I'm having trouble thinking right now.";
  }
}

// Synthesize query from history
async function synthesizeFromHistory(messages) {
  const prompt = `
SYSTEM:
The user has been chatting about products. Here are their recent messages:
${messages.map((m, i) => `${i + 1}. ${m.text}`).join("\n")}

if language is not English, translate.

You are helping suggest products from Davis & Shirtliff inventory.

Please craft a smart, short product search query using relevant keywords from Davis & Shirtliff categories, brands, or systems.

Here is the reference:
{
  "inventory_posting_groups": {
    "CAT01": "Spare Parts",
    "CAT02": "Miscellaneous Store",
    "CAT04": "Pumps",
    "CAT08": "Solar Equipment",
    "CAT10": "Pool Equipment",
    "CAT11": "Borehole Equipment",
    "CAT12": "Water Treatment",
    "CAT15": "Waste Water Systems",
    "CAT16": "Irrigation Systems",
    "CAT18": "Chemical Products",
    "CAT19": "Digital Engineering Solutions",
    "CAT39": "Non-Stock Items",
    "CAT40": "Finished Goods",
    "CAT51": "Transport Equipment"
  },
  "product_categories": {
    "pool": {
      "fittings": ["Valves", "Jets", "Strainers", "Thermometers"],
      "systems": ["Spas", "Heat Pumps", "Solar Heaters"]
    },
    "solar": {
      "components": ["Inverters", "Controllers", "Panels", "Batteries"],
      "systems": ["Grid-Tie", "Hybrid", "Pump Kits"]
    },
    "pumps": {
      "types": ["Submersible", "Centrifugal", "Diaphragm", "Axial Piston"],
      "brands": ["Dayliff", "Pedrollo", "Grundfos", "DAB"]
    },
    "irrigation": {
      "drip": ["Tapes", "Emitters", "Kits"],
      "sprinklers": ["Impact", "Rotary", "Pop-Up"],
      "controls": ["Timers", "Solenoids", "Weather Stations"]
    },
    "water_treatment": {
      "filtration": ["RO Membranes", "UV Systems", "Sediment Filters"],
      "chemical": ["Disinfection", "pH Adjusters", "Scale Inhibitors"]
    }
  },
  "brands": [
    "Dayliff", "Pedrollo", "Grundfos", "Hunter", "Lorentz", 
    "Growatt", "Schneider", "DAB", "Davey", "KSB", 
    "Victron", "JA Solar", "Must", "Deye", "BYD"
  ],
  "special_tags": [
    "Eshop_Available", "Heavy_Duty", "Corrosion_Resistant",
    "High_Pressure", "Food_Grade", "Potable_Water"
  ]
}

IMPORTANT:
- Focus on specific products, components and related products and keywords too
- Do NOT return explanations, only the search query.
- Be concise.

ONLY return the query text minimum of 20 characters.
  `;

  console.log("🧠 Synthesizing query from user history...");
  try {
    const result = await model.generateContent(prompt);
    const query = result.response.text().trim();
    console.log(`✅ Synthesized query: "${query}"`);
    return query;
  } catch (error) {
    console.error("❌ Synthesis error:", error);
    return "";
  }
}


// Search products using Serper
async function searchProducts(keywords) {
  console.log(`🔎 Searching products for: "${keywords}"...`);
  try {
    const { data } = await axios.post(
      "https://google.serper.dev/shopping",
      {
        q: keywords,
        location: "Kenya",
        gl: "ke"
      },
      {
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("✅ Search results received");

    if (!data) {
      console.warn("⚠️ No shopping results found");
      return [];
    } 

    
    console.log(`✅ Found ${data.shopping?.length || 0} products`);
    return data.shopping || [];
  } catch (error) {
    console.error("❌ Search error:", error);
    return [];
  }
}

// Recommend products
async function recommendToUser(user) {
  console.log(`🚀 Starting recommendation for user ${user.userId}...`);
  const recentMessages = user.messages.slice(-10); // last 5 chats
  const query = await synthesizeFromHistory(recentMessages);
  // console.log(`>>>> Update___ Synthesized query: "${query}"`);

  if (!query) {
    console.warn(`⚠️ No query generated for user ${user.userId}. Skipping recommendation.`);
    return;
  }

  const products = await searchProducts(query);
  if (!products.length) {
    console.warn(`⚠️ No products found for user ${user.userId}. Skipping recommendation.`);
    return;
  }

  const topProducts = products.slice(0, 5);
  //save top products to user profile
  await User.updateOne(
    { userId: user.userId },
    { $set: { topProducts } },
    { upsert: true }
  );

  console.log(`✅ Saved top products for user ${user.userId}`);

  let recommendation = `🛒 **Based on our recent chat, here are a few things you might like:**\n\n`;
  topProducts.forEach((item, index) => {
    //prioritize links with this domain: https://www.davisandshirtliff.com/
    recommendation += `${index + 1}. [${item.title}](${item.link}) - 💵 ${item.price}\n\n`;
  });

  recommendation += `\n_(Enjoy browsing! 🚀)_`;

  console.log(`📤 Sending recommendation to user ${user.userId}...`);

  try {
    await bot.telegram.sendMessage(user.userId, recommendation, { parse_mode: "Markdown" });
    console.log(`✅ Recommendation sent to user ${user.userId}`);
    
    await User.updateOne({ userId: user.userId }, { $set: { lastRecommendationAt: new Date() } });
    console.log(`🗂 Updated lastRecommendationAt for user ${user.userId}`);
  } catch (error) {
    console.error(`❌ Failed to send recommendation to user ${user.userId}:`, error);
  }
}

// --- Bot Handlers ---

bot.start(async (ctx) => {
  console.log(`🚪 User ${ctx.from.id} started the bot`);
  await logUserMessage(ctx.from.id, ctx.from.username || ctx.from.first_name, "started the bot");

  ctx.reply(
    "👋 Hi there! I'm your Davis & Shirtliff Assistant.\n\n" +
    "Feel free to chat with me about anything you need help with!"
  );
});

bot.on("text", async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || ctx.from.first_name;
  const message = ctx.message.text;
  console.log(`📥 Received text from user ${userId}: "${message}"`);

  // Save chat history
  await logUserMessage(userId, username, message);

  // Gemini responds
  const response = await chatWithGemini(message);
  await ctx.reply(response);
});

// Cron job: Recommend if new chats : 1 minute for simulation
cron.schedule('*/1 * * * *', async () => {
  console.log("⏰ Cron: Checking for new user activity...");

  const users = await User.find({});
  const now = new Date();

  for (const user of users) {
    const lastChat = user.messages.length ? user.messages[user.messages.length-1].timestamp : null;
    
    if (lastChat && lastChat > user.lastRecommendationAt) {
      console.log(`🎯 New chat activity for user ${user.userId}, proceeding with recommendation...`);
      await recommendToUser(user);
    } else {
      console.log(`⏳ No new chats for user ${user.userId}. Skipping.`);
    }
  }
});

// Error handling
bot.catch((err) => {
  console.error("❌ Bot error:", err);
});


//send all users top products to admin with id from secrets
async function sendTopProductsToAdmin() {
  const users = await User.find({});
  const adminId = process.env.ADMIN_ID;

  for (const user of users) {
    if (user.topProducts) {
      let message = `🛒 **Top Products for User ${user.userId}**:\n\n`;
      user.topProducts.forEach((item, index) => {
        message += `${index + 1}. [${item.title}](${item.link}) - 💵 ${item.price}\n\n`;
      });

      try {
        await bot.telegram.sendMessage(adminId, message, { parse_mode: "Markdown" });
        console.log(`✅ Sent top products to admin for user ${user.userId}`);
      } catch (error) {
        console.error(`❌ Failed to send top products to admin for user ${user.userId}:`, error);
      }
    }
  }
}
//schedule to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log("⏰ Cron: Sending top products to admin...");
  await sendTopProductsToAdmin();
});
// --- Start Bot ---

bot.launch().then(() => {
  console.log("🤖 Davis & Shirtliff Assistant is running...");
}).catch(err => {
  console.error("❌ Failed to launch bot:", err);
});

// Graceful shutdown
process.once("SIGINT", () => {
  console.log("🛑 SIGINT received. Shutting down bot...");
  bot.stop("SIGINT");
});
process.once("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down bot...");
  bot.stop("SIGTERM");
});
