// سیستم کامل فروشگاه
const ShopSystem = {
    // محصولات نمونه (خالی)
    products: [
        { id: 1, name: "محصول نمونه ۱", price: 0, category: "دسته‌بندی ۱" },
        { id: 2, name: "محصول نمونه ۲", price: 0, category: "دسته‌بندی ۲" },
        { id: 3, name: "محصول نمونه ۳", price: 0, category: "دسته‌بندی ۱" },
        { id: 4, name: "محصول نمونه ۴", price: 0, category: "دسته‌بندی ۳" },
        { id: 5, name: "محصول نمونه ۵", price: 0, category: "دسته‌بندی ۲" },
        { id: 6, name: "محصول نمونه ۶", price: 0, category: "دسته‌بندی ۱" },
        { id: 7, name: "محصول نمونه ۷", price: 0, category: "دسته‌بندی ۳" },
        { id: 8, name: "محصول نمونه ۸", price: 0, category: "دسته‌بندی ۲" }
    ],

    // دریافت سبد خرید از localStorage
    getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },

    // دریافت علاقه‌مندی‌ها از localStorage
    getWishlist() {
        return JSON.parse(localStorage.getItem('wishlist')) || [];
    },

    // دریافت کاربر جاری
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser')) || null;
    },

    // افزودن به سبد خرید
    addToCart(productId, quantity = 1) {
        const cart = this.getCart();
        const product = this.products.find(p => p.id === productId);
        
        if (!product) {
            this.showMessage('محصول یافت نشد!', 'error');
            return;
        }

        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCounter();
        this.showMessage(`"${product.name}" به سبد خرید اضافه شد`, 'success');
    },

    // حذف از سبد خرید
    removeFromCart(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCounter();
        
        if (window.location.pathname.includes('cart.html')) {
            window.location.reload();
        }
    },

    // به‌روزرسانی تعداد محصول در سبد
    updateCartItem(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            if (quantity < 1) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                this.updateCartCounter();
            }
        }
    },

    // افزودن به علاقه‌مندی‌ها
    toggleWishlist(productId) {
        let wishlist = this.getWishlist();
        const index = wishlist.indexOf(productId);
        
        if (index === -1) {
            wishlist.push(productId);
            this.showMessage('به علاقه‌مندی‌ها اضافه شد', 'success');
        } else {
            wishlist.splice(index, 1);
            this.showMessage('از علاقه‌مندی‌ها حذف شد', 'info');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        return index === -1; // true اگر اضافه شد، false اگر حذف شد
    },

    // به‌روزرسانی شمارشگر سبد خرید
    updateCartCounter() {
        const cart = this.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // به‌روزرسانی در تمام صفحات
        document.querySelectorAll('.cart-count').forEach(counter => {
            counter.textContent = totalItems;
        });
    },

    // محاسبه جمع سبد خرید
    calculateCartTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // نمایش پیام
    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `alert alert-${type}`;
        message.innerHTML = `
            <span>${text}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            z-index: 9999;
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 300px;
            max-width: 500px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentElement) {
                message.remove();
            }
        }, 5000);
    }
};

// استایل برای انیمیشن
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', function() {
    // به‌روزرسانی شمارشگر
    ShopSystem.updateCartCounter();
    
    // اضافه کردن event listener به دکمه‌های قلب
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product'));
            const added = ShopSystem.toggleWishlist(productId);
            
            // تغییر آیکون
            if (added) {
                this.innerHTML = '<i class="fas fa-heart" style="color: #ff4757;"></i>';
            } else {
                this.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    });
    
    // اضافه کردن event listener به دکمه‌های افزودن به سبد
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product'));
            ShopSystem.addToCart(productId);
        });
    });
});

// توابع عمومی
function addToCart(productId) {
    ShopSystem.addToCart(productId);
}

function toggleWishlist(productId) {
    return ShopSystem.toggleWishlist(productId);
}
