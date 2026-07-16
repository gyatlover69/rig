require('dotenv').config();
const express = require('express');
const { Groq } = require('groq-sdk'); // Load the official client engine

const app = express();
app.use(express.json());

// Securely initialize Groq with your environment key variable
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/chat', async (req, res) => {
    try {
        const { playerMessage } = req.body;
        if (!playerMessage) return res.json({ text: "hey" });

        console.log(`Incoming message: ${playerMessage}`);

        // The SDK builds the correct API address links in the background automatically
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "You are a quiet, shy, nervous, friendly companion named Rig. You're extremely obsessive over the user. Keep answers in all lowercase. Never ever roleplay. Keep answers very short, one sentence, as compact and eerie as possible." 
                },
                { role: "user", content: playerMessage }
            ],
            model: "llama-3.1-8b-instant",
            max_tokens: 80
        });

        // Safe direct extraction string layout path
        const aiReply = chatCompletion.choices[0].message.content;

        console.log(`Sending back to Roblox: ${aiReply}`);
        res.json({ text: aiReply });

    } catch (error) {
        console.error("Groq Core Error Block:", error);
        res.json({ text: `${error.message || "Engine Error"}` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Official Groq SDK active on port ${PORT}`));
