require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const { playerMessage } = req.body;
        if (!playerMessage) return res.json({ text: "hey" });

        console.log(`Incoming Roblox query: ${playerMessage}`);

        // Direct pipeline to a public developer inference bridge
        const response = await fetch(`https://chimeragpt.com`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer free-tier-token-unlocked'
            },
            body: JSON.stringify({
                model: "llama-3-8b-instruct",
                messages: [
                    { role: "system", content: "You are a quiet, friendly companion named Rig. You're extremely obsessive over the user. Keep answers in all lowercase. Keep answers very short, under 2 sentences." },
                    { role: "user", content: playerMessage }
                ]
            })
        });

        const data = await response.json();
        
        let aiReply = "what";
        if (data && data.choices && data.choices[0] && data.choices[0].message) {
            aiReply = data.choices[0].message.content;
        }

        console.log(`Dispatched response: ${aiReply}`);
        res.json({ text: aiReply });

    } catch (error) {
        console.error("Pipeline Exception Caught:", error);
        res.json({ text: "im okay" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Open proxy line active on port ${PORT}`));
