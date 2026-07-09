require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const { playerMessage } = req.body;
        if (!playerMessage) return res.json({ text: "Ahoy, say something matey!" });

        console.log(`Incoming message: ${playerMessage}`);

        // Direct connection to a public open-access model pipeline
        const response = await fetch("https://openrouter.ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.2-1b-instruct:free", // Fully un-metered free tier model
                messages: [
                    { 
                        role: "system", 
                        content: "You are a high-energy pirate NPC who uses words like Ahoy and Matey. Keep answers very short, under 2 sentences." 
                    },
                    { role: "user", content: playerMessage }
                ]
            })
        });

        const data = await response.json();
        
        let aiReply = "";
        if (data && data.choices && data.choices[0] && data.choices[0].message) {
            aiReply = data.choices[0].message.content;
        }

        if (!aiReply || aiReply.trim() === "") {
            res.json({ text: "Ahoy, my internal compass is spinning!" });
            return;
        }

        console.log(`Sending back to Roblox: ${aiReply}`);
        res.json({ text: aiReply });

    } catch (error) {
        console.error("Server Error Loop:", error);
        res.json({ text: "Arrr, me programming crashed!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Public proxy server live on port ${PORT}`));
