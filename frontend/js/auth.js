// رابط الخادم على الإنترنت (وليس localhost)
const API_URL = 'https://dz-sentivision-api.onrender.com/api/auth';

// دالة مساعدة للتواصل مع الخادم
async function apiRequest(endpoint, method, data) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined
        });
        
        return await response.json();
    } catch (error) {
        console.error('خطأ في الاتصال:', error);
        throw error;
    }
}

// دالة تسجيل الدخول
async function login(email, password) {
    try {
        console.log('محاولة تسجيل الدخول:', email);
        
        const result = await apiRequest('/login', 'POST', { email, password });

        if (result.success) {
            localStorage.setItem('token', result.token || 'dummy-token');
            localStorage.setItem('user', JSON.stringify(result.user));

            return {
                success: true,
                message: 'تم تسجيل الدخول بنجاح'
            };
        } else {
            return {
                success: false,
                message: result.error || 'فشل تسجيل الدخول'
            };
        }
    } catch (error) {
        console.error('خطأ:', error);
        return {
            success: false,
            message: 'فشل الاتصال بالخادم'
        };
    }
}

// دالة تسجيل مستخدم جديد
async function signup(fullname, email, password) {
    try {
        console.log('محاولة تسجيل جديد:', email);
        
        const result = await apiRequest('/signup', 'POST', { fullname, email, password });

        if (result.success) {
            localStorage.setItem('token', result.token || 'dummy-token');
            localStorage.setItem('user', JSON.stringify(result.user));

            return {
                success: true,
                message: 'تم إنشاء الحساب بنجاح'
            };
        } else {
            return {
                success: false,
                message: result.error || 'فشل إنشاء الحساب'
            };
        }
    } catch (error) {
        console.error('خطأ:', error);
        return {
            success: false,
            message: 'فشل الاتصال بالخادم'
        };
    }
}

// دالة تسجيل الخروج
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// التحقق من حالة تسجيل الدخول
function checkAuth() {
    const user = localStorage.getItem('user');
    return !!user;
}
