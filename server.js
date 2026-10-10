module.exports = async (req, res) => {
  // السماح بروابط موقعك (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ success: false, error: 'الرسالة فارغة' });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
    });

    const data = await response.json();
    if (data.ok) {
      res.status(200).json({ success: true, message: 'تم الإرسال بنجاح' });
    } else {
      res.status(500).json({ success: false, error: 'فشل الإرسال لتلجرام' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في السيرفر' });
  }
};
