
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: process.env.SITE_ORIGIN
}));

app.use(express.json());

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.get("/", (req, res) => {
  res.json({ status: "running" });
});

app.post("/send-fixed", async (req, res) => {
  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({
      error: "Server configuration missing"
    });
  }

  if (req.headers.origin !== process.env.SITE_ORIGIN) {
    return res.status(403).json({
      error: "Origin not allowed"
    });
  }

  const message = "مرحبًا! تم إرسال الرسالة من الموقع بنجاح.";

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error("Telegram delivery failed");
      return res.status(502).json({
        error: "Telegram delivery failed"
      });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Telegram request failed");
    return res.status(502).json({
      error: "Telegram service unavailable"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
