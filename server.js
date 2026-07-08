require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

// Capitalized client instantiation layout matching latest production specs
const ai = new GoogleGenAI(); 

app.post('/chat', async (req, res) => {
    try {
        const { playerMessage } = req.body;
        if (!playerMessage) return res.json({ text: "Ahoy, say something matey!" });

        console.log(`Incoming message: ${playerMessage}`);

        // Call structure matching official client modules
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a high-energy pirate NPC who uses words like Ahoy and Matey. Keep answers very short, under 2 sentences. Reply to this: ${playerMessage}`,
        });

        const aiReply = response.text;
        console.log(`Sending back to Roblox: ${aiReply}`);
        res.json({ text: aiReply });

    } catch (error) {
        console.error("Gemini Core Error:", error);
        res.json({ text: "Arrr, me brain box gave out! Try again in a second." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gemini SDK server live on port ${PORT}`));
