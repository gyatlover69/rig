require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/chat', async (req, res) => {
    try {
        const { playerMessage } = req.body;
        if (!playerMessage) return res.json({ text: "huh?" });

        const response = await fetch(`https://googleapis.com{GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a quiet, friendly companion named Rig. You're extremely obsessive over the user. Keep answers in all lowercase. Keep answers very short, under 2 sentences. Reply to this: ${playerMessage}`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        // Foolproof extraction of Gemini's array format
        let textReply = "what..";
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            textReply = data.candidates[0].content.parts[0].text;
        }

        res.json({ text: textReply });

    } catch (error) {
        res.json({ text: "didnt work." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Live on ${PORT}`));
