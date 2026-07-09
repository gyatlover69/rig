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

        const response = await fetch("https://openrouter.ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "HTTP-Referer": "https://render.com", // Required by OpenRouter free tier
                "X-Title": "Roblox AI NPC Proxy"       // Required by OpenRouter free tier
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.2-1b-instruct:free",
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
        console.log("Raw response from OpenRouter:", JSON.stringify(data));

        // Completely safe layer checking using JavaScript optional chaining (?.)
        let aiReply = data?.choices?.[0]?.message?.content;

        if (!aiReply || aiReply.trim() === "") {
            // If the structure changed, look directly inside the string for text
            const rawString = JSON.stringify(data);
            if (rawString.includes('"content":"')) {
                aiReply = rawString.split('"content":"')[1].split('"')[0];
            } else {
                aiReply = "Ahoy! Me compass is spinning, try talking again!";
            }
        }

        console.log(`Sending back to Roblox: ${aiReply}`);
        res.json({ text: aiReply });

    } catch (error) {
        console.error("Server Error Loop:", error);
        res.json({ text: "Ahoy! Let's try that conversation again, matey!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Public proxy server live on port ${PORT}`));
