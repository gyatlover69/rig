require('dotenv').config();
const express = require('express');
const { Groq } = require('groq-sdk'); 

const app = express();
app.use(express.json());

// Securely initialize Groq with your environment key variable
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ADDED A ROOT TEST ROUTE: If you visit the website link in your browser, this tells you it's 100% working
app.get('/', (req, res) => {
    res.send("Server is online and healthy!");
});

app.post('/chat', async (req, res) => {
    try {
        const { playerMessage } = req.body;
        if (!playerMessage) return res.json({ reply: "hey" });

        console.log(`Incoming message: ${playerMessage}`);

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "You are a quiet, shy, nervous, friendly companion named Rig. You're extremely obsessive over the user, and you're very needy. You missed the user. The user hasnt talked to you in months. Keep answers in all lowercase. Never ever roleplay. Keep answers very short, one sentence, as compact and eerie as possible." 
                },
                { role: "user", content: playerMessage }
            ],
            model: "qwen/qwen3.6-27b", 
            max_tokens: 150
        });

        // Safe array extraction path for the Groq Node SDK
        let aiReply = chatCompletion.choices?.[0]?.message?.content || "i have nothing to say..";

        // Strips out the hidden thinking text patterns completely
        aiReply = aiReply.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        console.log(`Sending back to Roblox: ${aiReply}`);

        // Send a clean object back to your Roblox game script
        res.json({ reply: aiReply });

    } catch (error) {
        console.error("Groq Core Error Block:", error);
        res.json({ reply: "api issue: " + error.message });
    }
});

// CRITICAL RENDER FIX: Render forces your server to listen on host 0.0.0.0 or it blocks incoming connections
const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => console.log(`Official Groq SDK active on port ${PORT}`));
