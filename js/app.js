// سیستم اصلی JavaScript

// بارگذاری داده‌ها از localStorage
function loadData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

// ذخیره داده‌ها در localStorage
function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch {
        return false;
    }
}

// تابع پیگیری سفارش
function trackOrder() {
    const user = loadData('currentUser');
    if (user) {
        saveData('trackOrderMessage', `سفارش من در چه حالتی هست؟ لطفاً وضعیت سفارش من را بررسی کنید. نام: ${user.firstName} ${user.lastName} - شماره: ${user.phone}`);
        window.location.href = 'support.html';
        return false; // جلوگیری از رفتن به #
    } else {
        alert('لطفاً ابتدا وارد حساب کاربری خود شوید');
        window.location.href = 'profile.html';
        return false;
    }
}

// سیستم منوی موبایل
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (menuBtn && mainNav) {
        // در موبایل منو را مخفی کن
        if (window.innerWidth <= 768) {
            mainNav.style.display = 'none';
        }
        
        menuBtn.addEventListener('click', function() {
            if (mainNav.style.display === 'none' || mainNav.style.display === '') {
                mainNav.style.display = 'block';
            } else {
                mainNav.style.display = 'none';
            }
        });
        
        // تطبیق با تغییر سایز پنجره
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mainNav.style.display = 'block';
            } else {
                mainNav.style.display = 'none';
            }
        });
    }
}

// به‌روزرسانی شمارشگر سبد خرید
function updateCartCounter() {
    const cart = loadData('cart');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(counter => {
        counter.textContent = totalItems;
    });
}

// افزودن به سبد خرید
function addToCart(productId, productName = 'محصول') {
    let cart = loadData('cart');
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: 0,
            quantity: 1
        });
    }
    
    saveData('cart', cart);
    updateCartCounter();
    
    // نمایش پیام
    showMessage(`${productName} به سبد خرید اضافه شد`, 'success');
    return false;
}

// مدیریت علاقه‌مندی‌ها
function toggleWishlist(productId) {
    let wishlist = loadData('wishlist');
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
        wishlist.push(productId);
        saveData('wishlist', wishlist);
        showMessage('به علاقه‌مندی‌ها اضافه شد', 'success');
        return true;
    } else {
        wishlist.splice(index, 1);
        saveData('wishlist', wishlist);
        showMessage('از علاقه‌مندی‌ها حذف شد', 'info');
        return false;
    }
}

// نمایش پیام
function showMessage(text, type = 'info') {
    // حذف پیام‌های قبلی
    document.querySelectorAll('.shop-message').forEach(el => el.remove());
    
    const message = document.createElement('div');
    message.className = `shop-message shop-message-${type}`;
    message.innerHTML = `
        <span>${text}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // استایل پیام
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : 
                    type === 'error' ? '#f8d7da' : 
                    type === 'warning' ? '#fff3cd' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : 
                type === 'error' ? '#721c24' : 
                type === 'warning' ? '#856404' : '#0c5460'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        z-index: 9999;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 300px;
        max-width: 500px;
        animation: slideInRight 0.3s ease;
        border: 1px solid ${type === 'success' ? '#c3e6cb' : 
                        type === 'error' ? '#f5c6cb' : 
                        type === 'warning' ? '#ffeaa7' : '#bee5eb'};
    `;
    
    document.body.appendChild(message);
    
    // حذف خودکار بعد از 5 ثانیه
    setTimeout(() => {
        if (message.parentElement) {
            message.remove();
        }
    }, 5000);
}

// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', function() {
    // راه‌اندازی منوی موبایل
    initMobileMenu();
    
    // به‌روزرسانی شمارشگر سبد خرید
    updateCartCounter();
    
    // بررسی وضعیت کاربر
    const user = loadData('currentUser');
    const authText = document.getElementById('authText');
    if (authText && user) {
        authText.textContent = `${user.firstName} ${user.lastName}`;
    }
    
    // بررسی علاقه‌مندی‌ها
    const wishlist = loadData('wishlist');
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = parseInt(btn.getAttribute('data-product'));
        if (wishlist.includes(productId)) {
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        }
    });
    
    // اضافه کردن استایل انیمیشن
    if (!document.querySelector('#shopStyles')) {
        const style = document.createElement('style');
        style.id = 'shopStyles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .shop-message button {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: inherit;
            }
        `;
        document.head.appendChild(style);
    }
});
