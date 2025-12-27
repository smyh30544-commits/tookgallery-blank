// سیستم کاربری ساده (ذخیره در localStorage)
class UserSystem {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.products = [
            { id: 1, name: "پک گوشواره ریز هالوت", price: 168000, image: "💎" },
            { id: 2, name: "اکسسوری زببی طلایی", price: 138000, image: "✨" },
            { id: 3, name: "گیره انبری بی‌نهایت", price: 104000, image: "🔗" },
            { id: 4, name: "جوراب فوق لطيف", price: 98000, image: "🧦" }
        ];
    }

    // ثبت نام کاربر
    register(userData) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(userData));
        this.currentUser = userData;
        return true;
    }

    // ورود کاربر
    login(phone) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.phone === phone);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUser = user;
            return user;
        }
        return null;
    }

    // خروج کاربر
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
    }

    // افزودن به سبد خرید
    addToCart(productId, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.image
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartUI();
    }

    // حذف از سبد خرید
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartUI();
    }

    // محاسبه مجموع
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // افزودن به علاقه‌مندی
    addToWishlist(productId) {
        if (!this.wishlist.includes(productId)) {
            this.wishlist.push(productId);
            localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
        }
    }

    // حذف از علاقه‌مندی
    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(id => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }

    // به‌روزرسانی UI
    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
}

// ایجاد نمونه سیستم
const userSystem = new UserSystem();
