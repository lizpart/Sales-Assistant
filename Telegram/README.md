
# Davis & Shirtliff Telegram Bot 🤖🇰🇪

This is an intelligent Telegram bot assistant built for Davis & Shirtliff (Kenya).  
It helps customers inquire about products like pumps, solar equipment, pool systems, boreholes, irrigation, water treatment solutions, and more.

It uses:
- **Google Gemini (Generative AI)** for natural customer conversations.
- **MongoDB** to store user chat history and interactions.
- **Node.js & Telegraf** for Telegram bot operations.
- **Serper.dev** (Google Shopping API) to recommend real products to users.
- **Cron Jobs** to schedule product recommendations based on chat history.

---

## Features ✨
- **Smart Responses:** Friendly, natural, Kenya-style conversations.
- **Product Search:** Recommends Davis & Shirtliff products intelligently.
- **User Tracking:** Stores messages and builds chat-based profiles.
- **Scheduled Recommendations:** Automatically suggests products after recent activity.
- **Multilingual Support:** Can understand English, Kiswahili, and Sheng.

---

## Setup Instructions 🚀

1. **Clone the Repository**
   ```bash
   git clone https://..._.git
   cd ds-telegram-bot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   
   Create a `.env` file in the root directory and add the following:
   ```bash
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token
   GOOGLE_AI_KEY=your-google-generative-ai-key
   MONGO_URI=your-mongodb-connection-string/<databaseName>
   SERPER_API_KEY=your-serper.dev-api-key
   ```

4. **Run the Bot**
   ```bash
   node index.js
   ```

---

## Project Structure 🏗
| File | Purpose |
| :--- | :------ |
| `index.js` | Main bot logic: handles Telegram commands, Gemini prompts, user storage, and product recommendations |
| `.env` | Environment configuration for secrets |
| `models/User.js` *(optional if extracted)* | Mongoose User schema for MongoDB |
| `package.json` | Node.js project file for dependency management |

---

## Important Services 🔥

- **Google Generative AI (Gemini 1.5 Flash):** For friendly, real-time conversations.
- **MongoDB Atlas (or local MongoDB):** To store user profiles and chat history.
- **Serper.dev Shopping API:** To fetch and recommend real Davis & Shirtliff products.

---

## How it Works ⚙️
1. **User chats** → Bot responds warmly via Gemini AI.
2. **Messages are logged** into MongoDB.
3. **Background cron job** analyzes user history, crafts a product search query.
4. **Search results** from Serper.dev are fetched and sent to the user as recommendations.

---

## Example Interaction 🎉

```
User: Niaje boss! Naeza pata solar pump?
Bot: Sasa! 😎 Tuna solar pump solutions kibao from Dayliff, Grundfos na Lorentz. Unataka ya domestic ama borehole?
```

> Later, bot recommends pumps matching their need.

---

## Roadmap 🛤
- [ ] Add admin dashboard to view user stats
- [ ] Support media (product images in recommendations)
- [ ] Integrate live Davis & Shirtliff inventory (instead of Serper.dev)

---

## Contributing 🤝

Feel free to fork the repo and open a PR!  
For major changes, please open an issue first to discuss what you would like to change.

---

## License 📜

This project is open-source under the **MIT License**.

---

**Built with ❤️ in Kenya for Davis & Shirtliff customers!**

