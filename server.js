require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

// Explicitly pass the key. If your Environment variable is missing, it falls back to a clean string alert
const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY }); 

app.post('/chat', async (req, res) => {
    try {
        const { playerMessage } = req.body;
        if (!playerMessage) return res.json({ text: "Ahoy, say something matey!" });

        console.log(`Incoming message: ${playerMessage}`);

        if (!GEMINI_KEY || GEMINI_KEY === "") {
            return res.json({ text: "Arrr, your GEMINI_API_KEY variable is missing on Render!" });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a high-energy pirate NPC who uses words like Ahoy and Matey. Keep answers very short, under 2 sentences. Reply to this: ${playerMessage}`,
        });

        const aiReply = response.text;
        console.log(`Sending back to Roblox: ${aiReply}`);
        res.json({ text: aiReply });

    } catch (error) {
        console.error("Gemini Core Error:", error);
        res.json({ text: `Arrr, me brain box broke! Error: ${error.message || "Unknown Connection Wall"}` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gemini SDK server live on port ${PORT}`));
