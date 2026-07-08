require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/chat', async (req, res) => {
    try {
        const { playerMessage } = req.body;
        if (!playerMessage) return res.status(400).json({ error: "No message" });

        const response = await fetch(`https://googleapis.com{GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a quiet, calm guy named Rig. You're obsessed with the player. Reply to this: ${playerMessage}`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        // Safety check to verify Gemini's nested formatting layout
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            const replyText = data.candidates[0].content.parts[0].text;
            res.json({ text: replyText });
        } else {
            console.error("Unexpected Gemini Data Structure:", JSON.stringify(data));
            res.json({ text: "[Gemini structure error - fallback activated]" });
        }

    } catch (error) {
        console.error("Gemini Server Error Loop:", error);
        res.status(200).json({ text: "[Server exception caught safely]" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gemini Server live on port ${PORT}`));


