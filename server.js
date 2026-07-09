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

        // Direct request to the most reliable public open-inference endpoint available
        const response = await fetch("https://openrouter.ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "HTTP-Referer": "https://render.com",
                "X-Title": "Roblox AI NPC Proxy"
            },
            body: JSON.stringify({
                model: "microsoft/phi-3-medium-128k-instruct:free", // Ultra-stable high-availability model
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
        console.log("Raw response from server:", JSON.stringify(data));

        // Flat string extraction logic to completely bypass structure errors
        let aiReply = "";
        const rawString = JSON.stringify(data);
        
        if (rawString.includes('"content":"')) {
            // Safely slice the text out of the text transmission layer
            aiReply = rawString.split('"content":"')[1].split('"')[0];
            // Clean up backslashes and json formats automatically
            aiReply = aiReply.replace(/\\n/g, " ").replace(/\\"/g, '"').replace(/\\'/g, "'");
        }

        if (!aiReply || aiReply.trim() === "") {
            aiReply = "Ahoy, me skull gears are a bit rusty! Try chatting again.";
        }

        console.log(`Sending back to Roblox: ${aiReply}`);
        res.json({ text: aiReply });

    } catch (error) {
        console.error("Server Error Loop:", error);
        res.json({ text: "Ahoy! Give me another sentence, matey!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Public proxy server live on port ${PORT}`));
