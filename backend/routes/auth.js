const express = require('express');
const router = express.Router();
const User = require('../models/User');

// تسجيل الدخول (نسخة مبسطة للتجربة)
router.post('/login', async (req, res) => {
    try {
        console.log('📩 طلب تسجيل دخول:', req.body);
        
        const { email, password } = req.body;
        
        // البحث عن المستخدم
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('❌ مستخدم غير موجود:', email);
            return res.status(401).json({ 
                success: false, 
                error: 'البريد الإلكتروني غير صحيح' 
            });
        }
        
        // مقارنة بسيطة (بدون تشفير للتجربة)
        const isPasswordValid = (password === user.password);
        
        if (!isPasswordValid) {
            console.log('❌ كلمة مرور خاطئة للمستخدم:', email);
            return res.status(401).json({ 
                success: false, 
                error: 'كلمة المرور غير صحيحة' 
            });
        }
        
        // تحديث آخر تسجيل دخول
        user.lastLogin = new Date();
        await user.save();
        
        console.log('✅ تسجيل دخول ناجح:', email);
        
        res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                lastLogin: user.lastLogin
            }
        });
        
    } catch (error) {
        console.error('🔥 خطأ في الخادم:', error);
        res.status(500).json({ 
            success: false, 
            error: 'حدث خطأ داخلي في الخادم: ' + error.message 
        });
    }
});

// تسجيل جديد
router.post('/signup', async (req, res) => {
    try {
        console.log('📩 طلب تسجيل جديد:', req.body);
        
        const { fullname, email, password } = req.body;
        
        // التحقق من وجود المستخدم
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                error: 'البريد الإلكتروني مسجل بالفعل' 
            });
        }
        
        // إنشاء مستخدم جديد
        const user = await User.create({
            fullname,
            email,
            password  // لاحظ: هذا بدون تشفير للتجربة
        });
        
        console.log('✅ تم إنشاء مستخدم جديد:', email);
        
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
        res.status(500).json({ 
            success: false, 
            error: 'حدث خطأ أثناء إنشاء الحساب' 
        });
    }
});

module.exports = router;
