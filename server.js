require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post('/chat', async (req, res) => {
    try {
        const { playerMessage } = req.body;
        if (!playerMessage) return res.json({ text: "Ahoy, say something matey!" });

        console.log(`Incoming message: ${playerMessage}`);

        if (!GROQ_API_KEY) {
            return res.json({ text: "Arrr, your GROQ_API_KEY variable is missing on Render!" });
        }

        // CORRECTED ENDPOINT PATH DIRECT TO THE DEV SERVERS
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // High-speed unmetered free-tier engine
                messages: [
                    { 
                        role: "system", 
                        content: "You are a high-energy pirate NPC who uses words like Ahoy and Matey. Keep answers very short, under 2 sentences." 
                    },
                    { role: "user", content: playerMessage }
                ],
                max_tokens: 80
            })
        });

        const data = await response.json();
        console.log("Raw response from Groq:", JSON.stringify(data));

        // Safely extract the generation data layers
        let aiReply = "";
        if (data && data.choices && data.choices[0] && data.choices[0].message) {
            aiReply = data.choices[0].message.content;
        }

        if (!aiReply || aiReply.trim() === "") {
            aiReply = "Ahoy, me skull gears are a bit rusty! Try chatting again.";
        }

        console.log(`Sending back to Roblox: ${aiReply}`);
        res.json({ text: aiReply });

    } catch (error) {
        console.error("Groq Server Error Loop:", error);
        res.json({ text: `Arrr, error code: ${error.message || "Unknown Failure"}` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Groq Proxy live on port ${PORT}`));
