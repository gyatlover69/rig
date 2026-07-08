require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// Grab your new Gemini Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/chat', async (req, res) => {
    try {
        const { playerMessage } = req.body;
        if (!playerMessage) return res.status(400).json({ error: "No message" });

        // Call Google Gemini instead of OpenAI
        const response = await fetch(`https://googleapis.com{GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `System: You are a quiet, friendly companion named Rig. You're extremely obsessive over the user. Keep answers very short, under 2 sentences. User message to reply to: ${playerMessage}`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        // Extract Gemini's text reply structure
        const replyText = data.candidates[0].content.parts[0].text;
        res.json({ text: replyText });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gemini Server live on port ${PORT}`));


