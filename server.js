require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/chat', async (req, res) => {
    try {
        const { playerMessage } = req.body;
        if (!playerMessage) return res.json({ text: "Ahoy, say something matey!" });

        console.log(`Incoming message: ${playerMessage}`);

        let response;
        let retries = 3;
        let delay = 2000; // Wait 2 seconds between retries

        while (retries > 0) {
            try {
                response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `You are a high-energy pirate NPC who uses words like Ahoy and Matey. Keep answers very short, under 2 sentences. Reply to this: ${playerMessage}`,
                });
                break; // Success! Break out of the loop
            } catch (apiError) {
                retries--;
                console.warn(`Gemini busy (Status ${apiError.status || 503}). Retries remaining: ${retries}`);
                if (retries === 0) throw apiError; // Out of retries, pass to main catch block
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        const aiReply = response.text;
        console.log(`Sending back to Roblox: ${aiReply}`);
        res.json({ text: aiReply });

    } catch (error) {
        console.error("Gemini Core Error:", error);
        res.json({ text: "Arrr! Google's servers are overloaded right now, try chatting again in a second!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gemini SDK server live on port ${PORT}`));
