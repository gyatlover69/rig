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
                        text: `You are a quiet, friendly companion named Rig. You're extremely obsessive over the user. Keep answers in all lowercase. Keep answers very short, under 2 sentences. Reply to this: ${playerMessage}`
                    }]
                }]
            })
        });

        const data = await response.json();
        console.log("Raw response data from Gemini:", JSON.stringify(data));

        // Absolute foolproof unpacking of Gemini's internal text layer lists
        let aiReply = "Ahoy! Me brain box got confused.";
        
        if (data && data.candidates && data.candidates[0]) {
            const firstCandidate = data.candidates[0];
            if (firstCandidate.content && firstCandidate.content.parts && firstCandidate.content.parts[0]) {
                aiReply = firstCandidate.content.parts[0].text;
            }
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

