const express = require('express');
const router = express.Router();
const User = require('../models/User');

// تسجيل جديد
router.post('/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        
        // التحقق من وجود المستخدم
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                error: 'البريد الإلكتروني مسجل بالفعل' 
            });
        }
        
        // إنشاء مستخدم جديد (سيتم تشفير كلمة المرور تلقائياً)
        const user = await User.create({
            fullname,
            email,
            password  // سيتم تشفيرها في pre-save hook
        });
        
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
        console.error('خطأ في التسجيل:', error);
        res.status(500).json({ 
            success: false, 
            error: 'حدث خطأ أثناء إنشاء الحساب' 
        });
    }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // البحث عن المستخدم مع جلب كلمة المرور
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                error: 'البريد الإلكتروني غير صحيح' 
            });
        }
        
        // التحقق من كلمة المرور باستخدام comparePassword
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                error: 'كلمة المرور غير صحيحة' 
            });
        }
        
        // تحديث آخر تسجيل دخول
        user.lastLogin = new Date();
        await user.save();
        
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
        console.error('خطأ في تسجيل الدخول:', error);
        res.status(500).json({ 
            success: false, 
            error: 'حدث خطأ أثناء تسجيل الدخول' 
        });
    }
});

module.exports = router;