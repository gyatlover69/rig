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

        // Alternative public connection directly to the high-speed Llama engine
        const response = await fetch("https://openrouter.ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "HTTP-Referer": "https://render.com",
                "X-Title": "Roblox AI NPC Proxy"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3-8b-instruct:free", // Completely un-metered free fallback model
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
        console.log("Raw response from public gateway:", JSON.stringify(data));

        // Direct key text string checker
        let aiReply = "";
        const rawString = JSON.stringify(data);
        
        if (rawString.includes('"content":"')) {
            aiReply = rawString.split('"content":"')[1].split('"')[0];
            aiReply = aiReply.replace(/\\n/g, " ").replace(/\\"/g, '"').replace(/\\'/g, "'");
        }

        if (!aiReply || aiReply.trim() === "") {
            aiReply = "Ahoy! Give me another sentence, matey!";
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
