require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// السماح بجميع النطاقات للتجربة
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ تم الاتصال بقاعدة البيانات'))
.catch(err => console.log('❌ فشل الاتصال:', err));

// مسار بسيط للاختبار
app.get('/', (req, res) => {
    res.json({ message: 'الخادم يعمل', status: 'ok' });
});

// استيراد المسارات
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
});
