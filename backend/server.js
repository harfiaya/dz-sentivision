require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
    origin: ['https://dz-sentivision.netlify.app', 'http://localhost:5500'],
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