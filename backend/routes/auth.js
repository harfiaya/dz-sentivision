const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ تسجيل الدخول - نسخة آمنة ومبسطة
router.post('/login', async (req, res) => {
    try {
        console.log('📩 طلب وارد للـ /api/auth/login:', req.body);
        
        const { email, password } = req.body;

        // التحقق من إرسال البريد وكلمة المرور
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
        }

        // البحث عن المستخدم في قاعدة البيانات
        const user = await User.findOne({ email: email });

        // إذا لم يوجد المستخدم
        if (!user) {
            console.log('❌ المستخدم غير موجود:', email);
            return res.status(401).json({ success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // مقارنة كلمة المرور (نصياً، بدون تشفير)
        if (user.password !== password) {
            console.log('❌ كلمة مرور خاطئة لـ:', email);
            return res.status(401).json({ success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // إذا وصلنا إلى هنا، فهذا يعني أن البيانات صحيحة
        console.log('✅ تسجيل دخول ناجح:', email);
        res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email
            }
        });

    } catch (error) {
        // هذا سيلتقط أي خطأ غير متوقع ويمنع الخادم من التعطل (الخطأ 500)
        console.error('🔥 خطأ في الخادم:', error);
        res.status(500).json({ 
            success: false, 
            error: 'حدث خطأ داخلي في الخادم. يرجى المحاولة لاحقاً.' 
        });
    }
});

// ✅ تسجيل جديد
router.post('/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // التحقق من وجود المستخدم
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'البريد الإلكتروني مسجل بالفعل' });
        }

        // إنشاء مستخدم جديد
        const user = new User({
            fullname,
            email,
            password // بدون تشفير للتبسيط
        });

        await user.save();

        console.log('✅ تم إنشاء حساب جديد:', email);
        res.json({
            success: true,
            message: 'تم إنشاء الحساب بنجاح',
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email
            }
        });

    } catch (error) {
        console.error('🔥 خطأ في التسجيل:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء إنشاء الحساب' });
    }
});

module.exports = router;
