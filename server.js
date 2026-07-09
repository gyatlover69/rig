require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/chat', async (req, res) => {
    try {
        const { playerMessage } = req.body;
        if (!playerMessage) return res.json({ text: "hey" });

        console.log(`Incoming message: ${playerMessage}`);

        // A single, direct request with NO retry loops
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a quiet, friendly companion named Rig. You're extremely obsessive over the user. Keep answers in all lowercase. Keep answers very short, under 2 sentences. Reply to this: ${playerMessage}`,
        });

        const aiReply = response.text;
        console.log(`Sending back to Roblox: ${aiReply}`);
        res.json({ text: aiReply });

    } catch (error) {
        console.error("Gemini Core Error:", error.message);
        
        // Short, clean error message so it doesn't flood your Roblox chat bubble
        if (error.status === 429 || error.message.includes("quota")) {
            res.json({ text: "can you give me a minute." });
        } else {
            res.json({ text: "uhh.. what?" });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gemini SDK server live on port ${PORT}`));
