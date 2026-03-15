const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ تسجيل الدخول (نسخة مبسطة للغاية)
router.post('/login', async (req, res) => {
    try {
        console.log('📩 طلب تسجيل دخول:', req.body.email);
        
        const { email, password } = req.body;
        
        // البحث عن المستخدم
        const user = await User.findOne({ email });
        
        // إذا لم يوجد المستخدم
        if (!user) {
            console.log('❌ مستخدم غير موجود');
            return res.status(401).json({ 
                success: false, 
                error: 'البريد الإلكتروني غير صحيح' 
            });
        }
        
        // تحقق بسيط جداً (كلمات المرور نصية للتجربة)
        if (password !== user.password) {
            console.log('❌ كلمة مرور خاطئة');
            return res.status(401).json({ 
                success: false, 
                error: 'كلمة المرور غير صحيحة' 
            });
        }
        
        console.log('✅ تسجيل دخول ناجح:', email);
        
        // رد نجاح
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
        console.error('🔥 خطأ جسيم:', error);
        res.status(500).json({ 
            success: false, 
            error: 'خطأ في الخادم: ' + error.message 
        });
    }
});

// ✅ تسجيل جديد
router.post('/signup', async (req, res) => {
    try {
        console.log('📩 طلب تسجيل جديد:', req.body.email);
        
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
        const user = new User({
            fullname,
            email,
            password // بدون تشفير للتجربة
        });
        
        await user.save();
        
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
            error: 'حدث خطأ: ' + error.message 
        });
    }
});

module.exports = router;
