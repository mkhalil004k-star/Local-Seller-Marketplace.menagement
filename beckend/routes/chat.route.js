import express from "express";
import { getAIReply } from "../services/ai.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages required" });
    }
    const reply = await getAIReply(messages);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chatbot error" });
  }
});

export default router;