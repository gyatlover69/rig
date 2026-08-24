require('dotenv').config();
const express = require('express');
const { Groq } = require('groq-sdk'); 

const app = express();
app.use(express.json());

// Securely initialize Groq with your environment key variable
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
            model: "openai/gpt-oss-20b", 
            max_tokens: 60
        });

        // 1. FIXED EXTRACTION PATH: Added the exact array [0] index accessor
        const aiReply = chatCompletion.choices?.[0]?.message?.content || "i have nothing to say..";

        console.log(`Sending back to Roblox: ${aiReply}`);

        // 2. Send a clean object back to your Roblox game script
        res.json({ reply: aiReply });

    } catch (error) {
        console.error("Groq Core Error Block:", error);
        res.json({ reply: "api issue: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Official Groq SDK active on port ${PORT}`));
