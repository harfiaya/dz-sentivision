// ملف JavaScript الموحد للمصادقة
const API_URL = 'http://localhost:5000/api/auth';

// دالة مساعدة للتعامل مع الـ API
async function apiRequest(endpoint, method, data) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    // إضافة رمز الدخول إذا كان موجوداً
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined
    });
    
    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(result.error || 'حدث خطأ في الاتصال');
    }
    
    return result;
}

// دالة تسجيل الدخول
async function login(email, password) {
    try {
        const result = await apiRequest('/login', 'POST', { email, password });
        
        if (result.success) {
            // حفظ بيانات المستخدم
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            
            return {
                success: true,
                message: 'تم تسجيل الدخول بنجاح'
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// دالة التسجيل
async function signup(fullname, email, password) {
    try {
        const result = await apiRequest('/signup', 'POST', { fullname, email, password });
        
        if (result.success) {
            // حفظ بيانات المستخدم
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            
            return {
                success: true,
                message: 'تم إنشاء الحساب بنجاح'
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
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
async function checkAuth() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return false;
    }
    
    try {
        const result = await apiRequest('/verify', 'GET');
        return result.success;
    } catch (error) {
        logout();
        return false;
    }
}

// حماية الصفحات (تأكد من تسجيل الدخول)
async function requireAuth() {
    const isAuthenticated = await checkAuth();
    
    if (!isAuthenticated) {
        alert('الرجاء تسجيل الدخول أولاً');
        window.location.href = 'login.html';
    }
}

// حماية الصفحات من المستخدمين المسجلين (لصفحات login/signup)
function redirectIfAuthenticated() {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'analysis-page.html';
    }
}
