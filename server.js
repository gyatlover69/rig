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

        console.log(`Incoming message: ${playerMessage}`);

        const response = await fetch(`https://googleapis.com{GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a high-energy pirate NPC who uses words like Ahoy and Matey. Keep answers very short, under 2 sentences. Reply to this: ${playerMessage}`
                    }]
                }]
            })
        });

        // Convert the raw data stream directly to text format
        const rawText = await response.text();
        console.log("Raw Response received:", rawText);

        // Fail-safe keyword string extractor to completely bypass structural array reading
        let aiReply = "";
        const partsTextSplit = rawText.split('"text": "');
        
        if (partsTextSplit.length > 1) {
            const extractContent = partsTextSplit[1].split('"');
            aiReply = extractContent[0];
            
            // Clean up basic JSON escaping characters
            aiReply = aiReply.replace(/\\n/g, " ").replace(/\\"/g, '"');
        }

        // If the string search fails, display a diagnostic hint instead of a generic crash message
        if (!aiReply || aiReply.trim() === "") {
            res.json({ text: `API Response Structure: ${rawText.substring(0, 40)}...` });
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
app.listen(PORT, () => console.log(`Gemini server live on port ${PORT}`));
