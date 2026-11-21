// بيانات الألعاب
const games = [
    {
        id: 1,
        name: "Warframe",
        price: 149,
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tags: ["أكشن", "فضاء", "متعددة اللاعبين"],
        description: "لعبة أكشن في عالم الفضاء مع شخصيات قابلة للتخصيص بالكامل ومعارك ملحمية."
    },
    {
        id: 2,
        name: "Space Breaker",
        price: 99,
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tags: ["مغامرة", "فضاء", "أحجية"],
        description: "أكمل المهام في الفضاء الخارجي وحل الألغاز المعقدة للوصول إلى الكنوز."
    },
    {
        id: 3,
        name: "Cyber Nexus",
        price: 199,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tags: ["سيبربانك", "مغامرة", "أكشن"],
        description: "انغمس في عالم المستقبل حيث التكنولوجيا تحكم كل شيء وأكمل المهام الخطيرة."
    },
    {
        id: 4,
        name: "Fantasy Realms",
        price: 179,
        image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tags: ["فانتازيا", "مغامرة", "لعب أدوار"],
        description: "استكشف عوالم سحرية وانهض بتحديات ملحمية في هذه اللعبة الرائعة."
    },
    {
        id: 5,
        name: "Galaxy Warriors",
        price: 159,
        image: "https://images.unsplash.com/photo-1531816458010-fb768453ea86?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tags: ["أكشن", "فضاء", "قتال"],
        description: "انضم إلى المحاربين الفضائيين وخض معارك ملحمية عبر المجرات."
    },
    {
        id: 6,
        name: "Digital Revolution",
        price: 219,
        image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tags: ["مغامرة", "تكنولوجيا", "إستراتيجية"],
        description: "قود ثورة رقمية في عالم افتراضي متكامل مليء بالتحديات."
    }
];

// سلة التسوق
let cart = JSON.parse(localStorage.getItem('warframe_cart')) || [];

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    // عرض السنة الحالية في الفوتر
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // تحميل الألعاب
    loadGames();
    
    // تحديث عداد السلة
    updateCartCount();
    
    // تحميل محتوى السلة
    loadCart();
    
    // إعداد مستمعي الأحداث
    setupEventListeners();
    
    // تأثير التمرير على النافبار
    window.addEventListener('scroll', handleScroll);
});

// تحميل الألعاب في الصفحة
function loadGames() {
    const gamesContainer = document.getElementById('games-container');
    gamesContainer.innerHTML = '';
    
    games.forEach(game => {
        const gameCard = createGameCard(game);
        gamesContainer.appendChild(gameCard);
    });
}

// إنشاء بطاقة لعبة
function createGameCard(game) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 col-xl-3 fade-in';
    
    const tagsHTML = game.tags.map(tag => 
        `<span class="game-tag">${tag}</span>`
    ).join('');
    
    // التحقق إذا كانت اللعبة في السلة
    const cartItem = cart.find(item => item.id === game.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    
    col.innerHTML = `
        <div class="game-card" data-id="${game.id}">
            <img src="${game.image}" class="game-img" alt="${game.name}">
            <div class="game-card-body">
                <h3 class="game-title">${game.name}</h3>
                <div class="game-price">${game.price} ريال</div>
                <div class="game-tags">${tagsHTML}</div>
                <p class="game-description">${game.description}</p>
                <button class="btn add-to-cart-btn" data-id="${game.id}">
                    <i class="bi bi-cart-plus me-2"></i>
                    ${quantity > 0 ? `مضافة (${quantity})` : 'أضف إلى السلة'}
                </button>
            </div>
        </div>
    `;
    
    return col;
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // أزرار إضافة إلى السلة
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart-btn')) {
            const gameId = parseInt(e.target.closest('.add-to-cart-btn').dataset.id);
            addToCart(gameId);
        }
        
        if (e.target.closest('.buy-now-btn')) {
            addToCart(1); // Warframe
        }
        
        if (e.target.closest('.bundle-btn')) {
            // إضافة الباقة (5 ألعاب)
            [1, 2, 3, 5, 6].forEach(gameId => addToCart(gameId));
            showNotification('تمت إضافة الباقة الذهبية إلى السلة!', 'success');
        }
        
        if (e.target.closest('.explore-offers-btn')) {
            scrollToElement('#offers');
        }
        
        // التنقل السلس
        if (e.target.closest('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            scrollToElement(targetId);
        }
    });
    
    // زر إتمام الشراء
    document.getElementById('checkout-btn').addEventListener('click', checkout);
    
    // تحديث السلة عند فتح المودال
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('show.bs.modal', loadCart);
    }
}

// إضافة لعبة إلى السلة
function addToCart(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;
    
    const existingItem = cart.find(item => item.id === gameId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: game.id,
            name: game.name,
            price: game.price,
            image: game.image,
            quantity: 1
        });
    }
    
    // حفظ السلة في التخزين المحلي
    saveCartToStorage();
    
    // تحديث العداد
    updateCartCount();
    
    // تحديث زر اللعبة
    updateGameButton(gameId);
    
    // عرض إشعار
    showNotification(`تم إضافة ${game.name} إلى السلة!`, 'success');
    
    // تأثير اهتزاز
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.classList.add('pulse-animation');
    setTimeout(() => cartBtn.classList.remove('pulse-animation'), 500);
}

// تحديث زر اللعبة في القائمة
function updateGameButton(gameId) {
    const gameButton = document.querySelector(`.add-to-cart-btn[data-id="${gameId}"]`);
    if (!gameButton) return;
    
    const cartItem = cart.find(item => item.id === gameId);
    const quantity = cartItem ? cartItem.quantity : 0;
    
    gameButton.innerHTML = `
        <i class="bi bi-cart-plus me-2"></i>
        ${quantity > 0 ? `مضافة (${quantity})` : 'أضف إلى السلة'}
    `;
}

// تحميل محتوى السلة
function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummary = document.getElementById('cart-summary');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-5" id="empty-cart-message">
                <i class="bi bi-cart-x display-1 text-muted"></i>
                <h5 class="mt-3">سلة التسوق فارغة</h5>
                <p class="text-muted">أضف بعض الألعاب إلى السلة لتبدأ التسوق</p>
            </div>
        `;
        cartSummary.classList.add('d-none');
        checkoutBtn.disabled = true;
        return;
    }
    
    let subtotal = 0;
    let itemsHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" class="cart-item-image" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} ريال</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">
                    <strong>${itemTotal} ريال</strong>
                </div>
                <button class="remove-item-btn" data-id="${item.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = itemsHTML;
    emptyCartMessage.classList.add('d-none');
    cartSummary.classList.remove('d-none');
    checkoutBtn.disabled = false;
    
    // حساب الخصم والمجموع
    const discount = subtotal >= 500 ? subtotal * 0.1 : 0; // خصم 10% إذا المجموع فوق 500
    const total = subtotal - discount;
    
    document.getElementById('subtotal').textContent = `${subtotal} ريال`;
    document.getElementById('discount').textContent = `${discount} ريال`;
    document.getElementById('total').textContent = `${total} ريال`;
    
    // إضافة مستمعي الأحداث للعناصر الجديدة
    document.querySelectorAll('.decrease-quantity').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.id);
            updateQuantity(itemId, -1);
        });
    });
    
    document.querySelectorAll('.increase-quantity').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.id);
            updateQuantity(itemId, 1);
        });
    });
    
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.id);
            removeFromCart(itemId);
        });
    });
}

// تحديث كمية العنصر
function updateQuantity(gameId, change) {
    const item = cart.find(item => item.id === gameId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        // إزالة العنصر إذا كانت الكمية 0
        cart = cart.filter(item => item.id !== gameId);
        showNotification('تم إزالة اللعبة من السلة', 'error');
    }
    
    saveCartToStorage();
    updateCartCount();
    loadCart();
    updateGameButton(gameId);
}

// إزالة عنصر من السلة
function removeFromCart(gameId) {
    const item = cart.find(item => item.id === gameId);
    if (!item) return;
    
    cart = cart.filter(item => item.id !== gameId);
    saveCartToStorage();
    updateCartCount();
    loadCart();
    updateGameButton(gameId);
    showNotification('تم إزالة اللعبة من السلة', 'error');
}

// إتمام عملية الشراء
function checkout() {
    if (cart.length === 0) return;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal >= 500 ? subtotal * 0.1 : 0;
    const total = subtotal - discount;
    
    // محاكاة عملية الشراء
    showNotification(`جاري معالجة طلبك بقيمة ${total} ريال...`, 'success');
    
    setTimeout(() => {
        // تفريغ السلة
        cart = [];
        saveCartToStorage();
        updateCartCount();
        loadCart();
        
        // تحديث جميع أزرار الألعاب
        games.forEach(game => updateGameButton(game.id));
        
        // إغلاق المودال
        const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        modal.hide();
        
        showNotification('تم إتمام عملية الشراء بنجاح! شكراً لشرائك من متجرنا.', 'success');
    }, 2000);
}

// تحديث عداد السلة
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'block' : 'none';
}

// حفظ السلة في التخزين المحلي
function saveCartToStorage() {
    localStorage.setItem('warframe_cart', JSON.stringify(cart));
}

// عرض الإشعارات
function showNotification(message, type = 'success') {
    // إزالة أي إشعارات سابقة
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثواني
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// التمرير السلس للعناصر
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

// التعامل مع التمرير
function handleScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}