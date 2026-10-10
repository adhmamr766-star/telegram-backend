const express = require('express');
const cors = require('cors');

const app = express();

// السماح بالاتصال من موقعك بشكل آمن
app.use(cors());
app.use(express.json());

// جلب التوكن والـ ID من متغيرات البيئة الآمنة
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// نقطة الاتصال لإرسال الرسائل
app.post('/send-message', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: 'الرسالة فارغة' });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    const data = await response.json();

    if (data.ok) {
      res.status(200).json({ success: true, message: 'تم إرسال الرسالة بنجاح' });
    } else {
      res.status(500).json({ success: false, error: 'فشل الإرسال إلى تلجرام' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'حدث خطأ في السيرفر' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
