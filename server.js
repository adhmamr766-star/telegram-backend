
module.exports = async (req, res) => {
  const allowedOrigin = process.env.SITE_ORIGIN;

  res.setHeader(
    "Access-Control-Allow-Origin",
    allowedOrigin || "null"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!allowedOrigin || req.headers.origin !== allowedOrigin) {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "Server configuration missing" });
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
      console.error("Telegram API request failed");
      return res.status(502).json({ error: "Telegram delivery failed" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Telegram request failed");
    return res.status(502).json({ error: "Telegram service unavailable" });
  }
};
