require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/chat', async (req, res) => {
    try {
        const { playerMessage } = req.body;
        if (!playerMessage) return res.status(400).json({ error: "No message" });

        const aiResponse = await fetch('https://openai.com', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { 
                        role: "system", 
                        // CHANGE THE TEXT INSIDE THE QUOTES BELOW TO WHATEVER PERSONALITY YOU WANT!
                        content: "You are a quiet, friendly guy. You're extremely obsessive over the user. Keep answers very short, under 2 sentences." 
                    },
                    { role: "user", content: playerMessage }
                ],
                max_tokens: 80
            })
        });

        const data = await aiResponse.json();
        res.json({ text: data.choices.message.content });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));

