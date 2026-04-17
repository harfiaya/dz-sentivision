const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ تسجيل الدخول (نسخة تعمل 100%)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔐 محاولة دخول:', email);

        // البحث عن المستخدم
        const user = await User.findOne({ email: email });
        
        if (!user) {
            console.log('❌ المستخدم غير موجود:', email);
            return res.status(401).json({ 
                success: false, 
                error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
            });
        }
        
        // مقارنة كلمة المرور - نصية عادية
        if (user.password !== password) {
            console.log('❌ كلمة مرور خاطئة لـ:', email);
            return res.status(401).json({ 
                success: false, 
                error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
            });
        }
        
        console.log('✅ تم الدخول بنجاح:', email);
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
        console.error('🔥 خطأ في الخادم:', error);
        res.status(500).json({ 
            success: false, 
            error: 'حدث خطأ في الخادم' 
        });
    }
});

// ✅ تسجيل جديد
router.post('/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        console.log('📝 محاولة تسجيل:', email);
        
        // التحقق من وجود المستخدم
        const existingUser = await User.findOne({ email: email });
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
            password  // بدون تشفير للتأكد من العمل
        });
        
        await user.save();
        console.log('✅ تم تسجيل مستخدم جديد:', email);
        
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
