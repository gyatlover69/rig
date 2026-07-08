require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/chat', async (req, res) => {
    try {
        const { playerMessage } = req.body;
        if (!playerMessage) return res.json({ text: "Ahoy, say something matey!" });

        console.log(`Incoming message from Roblox: ${playerMessage}`);

        const response = await fetch(`https://googleapis.com{GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a high-energy pirate NPC who uses words like Ahoy and Matey. Keep answers very short, under 2 sentences. Reply to this: ${playerMessage}`
                    }]
                }]
            })
        });

        const data = await response.json();
        console.log("Raw response data from Gemini:", JSON.stringify(data));

        // Fixed data extraction specifically for Gemini 1.5 format with array indices
        let aiReply = "Ahoy! Me brain box got confused.";
        
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            aiReply = data.candidates[0].content.parts[0].text;
        } else {
            console.error("Unexpected Gemini Layout:", JSON.stringify(data));
        }

        console.log(`Sending back to Roblox: ${aiReply}`);
        res.json({ text: aiReply });

    } catch (error) {
        console.error("Server Error Loop:", error);
        res.json({ text: "Arrr, me programming crashed!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gemini server live on port ${PORT}`));
