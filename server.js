require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

// Intialize the official Google client securely using your environment key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/chat', async (req, res) => {
    try {
        const { playerMessage } = req.body;
        if (!playerMessage) return res.json({ text: "Ahoy, say something matey!" });

        console.log(`Incoming message: ${playerMessage}`);

        // Generate content using the official SDK wrapper
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `You are a high-energy pirate NPC who uses words like Ahoy and Matey. Keep answers very short, under 2 sentences. Reply to this: ${playerMessage}`,
        });

        // The library provides a direct text accessor method
        const aiReply = response.text;

        console.log(`Sending back to Roblox: ${aiReply}`);
        res.json({ text: aiReply });

    } catch (error) {
        console.error("Gemini Core Error:", error);
        res.json({ text: `Arrr, error code: ${error.message || "Unknown Failure"}` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gemini SDK server live on port ${PORT}`));
