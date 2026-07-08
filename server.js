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

        // Direct request to the correct Gemini model layout
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a quiet, friendly companion named Rig. You're extremely obsessive over the user. Keep answers in all lowercase. Keep answers very short, under 2 sentences. Reply to this: ${playerMessage}`,
        });

        const aiReply = response.text;
        console.log(`Sending back to Roblox: ${aiReply}`);
        res.json({ text: aiReply });

    } catch (error) {
        console.error("Gemini Core Error:", error);
        
        if (error.status === 503 || error.message.includes("503")) {
            res.json({ text: "Arrr! Google's servers are overloaded right now, try chatting again in a second!" });
        } else {
            res.json({ text: `Arrr, error code: ${error.message || "Unknown Failure"}` });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gemini SDK server live on port ${PORT}`));
