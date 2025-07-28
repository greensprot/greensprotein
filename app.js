// Application Data
const appData = {
    menuItems: [
        {"name":"15g Sprout Bowl","protein":15,"base":"Sprouts","price":75,"image":"sprout15.jpg","type":"bowl"},
        {"name":"20g Sprout Bowl","protein":20,"base":"Sprouts","price":90,"image":"sprout20.jpg","type":"bowl"},
        {"name":"25g Sprout Bowl","protein":25,"base":"Sprouts","price":105,"image":"sprout25.jpg","type":"bowl"},
        {"name":"30g Sprout Bowl","protein":30,"base":"Sprouts","price":120,"image":"sprout30.jpg","type":"bowl"},
        {"name":"15g Paneer Bowl","protein":15,"base":"Paneer","price":80,"image":"paneer15.jpg","type":"bowl"},
        {"name":"20g Paneer Bowl","protein":20,"base":"Paneer","price":95,"image":"paneer20.jpg","type":"bowl"},
        {"name":"25g Paneer Bowl","protein":25,"base":"Paneer","price":110,"image":"paneer25.jpg","type":"bowl"},
        {"name":"30g Paneer Bowl","protein":30,"base":"Paneer","price":130,"image":"paneer30.jpg","type":"bowl"},
        {"name":"Protein Buttermilk","protein":20,"base":"Buttermilk","price":100,"image":"buttermilk.jpg","type":"beverage"},
        {"name":"Protein Minty Buttermilk","protein":20,"base":"Buttermilk","price":110,"image":"buttermilk_mint.jpg","type":"beverage"}
    ],
    deliveryAreas: [
        {"area":"Dombivli East","time":"20-25 min"},
        {"area":"Dombivli West","time":"25-30 min"},
        {"area":"Kalyan","time":"25-30 min"},
        {"area":"Thane","time":"35-40 min"},
        {"area":"Ulhasnagar","time":"30-35 min"},
        {"area":"Ambarnath","time":"35-40 min"}
    ],
    testimonials: [
        {"quote":"Best protein bowls in entire Mumbai!","name":"Priya Sharma","role":"Fitness Trainer","location":"Dombivli East","rating":5},
        {"quote":"Finally found healthy food that tastes incredible!","name":"Rahul Patel","role":"Software Engineer","location":"Kalyan","rating":5},
        {"quote":"Perfect for my weight loss journey.","name":"Anjali Singh","role":"Marketing Manager","location":"Thane","rating":5}
    ],
    faqs: [
        {"q":"What areas do you deliver protein bowls in Mumbai?","a":"We deliver across Dombivli, Kalyan, Thane, Ulhasnagar, Ambarnath, Badlapur."},
        {"q":"How fresh are the ingredients?","a":"All ingredients are sourced daily from local farms and prepared fresh to order."},
        {"q":"Can I customise bowls?","a":"Yes, build-your-own with 25+ ingredients and dietary options."},
        {"q":"What are the delivery charges?","a":"Free delivery on orders above ₹200. Below that, ₹30 delivery charges apply."},
        {"q":"How long does delivery take?","a":"Delivery takes 20-40 minutes depending on your location."},
        {"q":"Do you accept UPI payments?","a":"Yes, we accept UPI, cards, net banking through our secure payment gateway."}
    ]
};

// Application State
let currentPage = 'home';
let cart = [];
let customBowl = {
    base: '',
    protein: 0,
    toppings: [],
    step: 1
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }
    
    initializeApp();
    setupEventListeners();
    updateCartCount();
    loadTheme();
    
    // Handle URL hash changes
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
});

// Initialize App Components
function initializeApp() {
    renderFeaturedBowls();
    renderDeliveryAreas();
    renderTestimonials();
    renderMenu();
    renderFAQ();
    setupCustomBowlBuilder();
    updateCartDisplay();
}

// Event Listeners Setup
function setupEventListeners() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('href').substring(1);
            navigateToPage(targetPage);
        });
    });
    
    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            navigateToPage('cart');
        });
    }
    
    // Forms
    setupFormHandlers();
    
    // Menu filters
    setupMenuFilters();
    
    // Custom bowl builder
    setupCustomBowlHandlers();
    
    // Checkout
    setupCheckoutHandlers();
    
    // Close modals on outside click
    document.addEventListener('click', handleModalClick);
}

// Navigation Functions
function navigateToPage(pageId) {
    console.log('Navigating to page:', pageId);
    
    // Update URL hash
    window.location.hash = pageId;
    
    // Update active states
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${pageId}`) {
            link.classList.add('active');
        }
    });
    
    // Show/hide pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            page.classList.add('active');
            // Scroll to top of page
            window.scrollTo(0, 0);
        }
    });
    
    currentPage = pageId;
    
    // Page-specific actions
    if (pageId === 'cart') {
        updateCartDisplay();
    } else if (pageId === 'checkout') {
        updateCheckoutSummary();
    } else if (pageId === 'thank-you') {
        displayOrderDetails();
    }
    
    // Close mobile menu
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // Track page view
    if (typeof gtag !== 'undefined') {
        gtag('config', 'G-XXXXXXXXXX', {
            page_title: pageId,
            page_location: window.location.href
        });
    }
}

function handleHashChange() {
    const hash = window.location.hash.substring(1) || 'home';
    if (hash !== currentPage) {
        navigateToPage(hash);
    }
}

// Theme Functions
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-color-scheme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update theme toggle icon
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-color-scheme', savedTheme);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = savedTheme === 'light' ? '🌙' : '☀️';
    }
}

// Render Functions
function renderFeaturedBowls() {
    const container = document.getElementById('featuredBowls');
    if (!container) return;
    
    const featuredItems = appData.menuItems.filter(item => item.type === 'bowl').slice(0, 4);
    
    container.innerHTML = featuredItems.map(item => `
        <div class="bowl-card fade-in">
            <div class="bowl-image">
                <div style="width: 100%; height: 200px; background: var(--color-bg-3); border-radius: var(--radius-base); display: flex; align-items: center; justify-content: center; color: var(--color-text-secondary); margin-bottom: var(--space-16);">
                    🥗 ${item.name}
                </div>
            </div>
            <h3>${item.name}</h3>
            <div class="bowl-protein">${item.protein}g Protein</div>
            <div class="bowl-price">₹${item.price}</div>
            <p class="bowl-description">Fresh ${item.base.toLowerCase()} with organic vegetables and our signature healthy dressing.</p>
            <button class="btn btn--primary btn--full-width" onclick="addToCart('${item.name}', ${item.price}, ${item.protein}, '${item.base}')">
                Add to Cart
            </button>
        </div>
    `).join('');
}

function renderDeliveryAreas() {
    const container = document.getElementById('deliveryAreas');
    if (!container) return;
    
    container.innerHTML = appData.deliveryAreas.map(area => `
        <div class="area-card fade-in">
            <h3>${area.area}</h3>
            <div class="area-time">🚚 ${area.time}</div>
        </div>
    `).join('');
}

function renderTestimonials() {
    const container = document.getElementById('testimonials');
    if (!container) return;
    
    container.innerHTML = appData.testimonials.map(testimonial => `
        <div class="testimonial-card fade-in">
            <div class="testimonial-rating">${'⭐'.repeat(testimonial.rating)}</div>
            <p class="testimonial-quote">"${testimonial.quote}"</p>
            <div class="testimonial-author">${testimonial.name}</div>
            <div class="testimonial-role">${testimonial.role}, ${testimonial.location}</div>
        </div>
    `).join('');
}

function renderMenu() {
    const container = document.getElementById('menuGrid');
    if (!container) return;
    
    function renderItems(items) {
        container.innerHTML = items.map(item => `
            <div class="menu-item-card fade-in" data-type="${item.type}">
                <div class="menu-image">
                    <div style="width: 100%; height: 200px; background: var(--color-bg-${item.type === 'bowl' ? '3' : '2'}); border-radius: var(--radius-base); display: flex; align-items: center; justify-content: center; color: var(--color-text-secondary); margin-bottom: var(--space-16);">
                        ${item.type === 'bowl' ? '🥗' : '🥤'} ${item.name}
                    </div>
                </div>
                <h3>${item.name}</h3>
                <div class="menu-protein">${item.protein}g Protein</div>
                <div class="menu-price">₹${item.price}</div>
                <p class="menu-description">Made with fresh ${item.base.toLowerCase()}, perfect for your protein needs.</p>
                <button class="btn btn--primary btn--full-width" onclick="addToCart('${item.name}', ${item.price}, ${item.protein}, '${item.base}')">
                    Add to Cart
                </button>
            </div>
        `).join('');
    }
    
    renderItems(appData.menuItems);
}

function renderFAQ() {
    const container = document.getElementById('faqList');
    if (!container) return;
    
    container.innerHTML = appData.faqs.map((faq, index) => `
        <div class="faq-item" data-index="${index}">
            <button class="faq-question" onclick="toggleFAQ(${index})">
                ${faq.q}
                <span class="faq-toggle">+</span>
            </button>
            <div class="faq-answer">
                <p>${faq.a}</p>
            </div>
        </div>
    `).join('');
}

// Menu Filter Functions
function setupMenuFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter menu items
            filterMenuItems(filter);
        });
    });
}

function filterMenuItems(filter) {
    const menuItems = document.querySelectorAll('.menu-item-card');
    
    menuItems.forEach(item => {
        const itemType = item.getAttribute('data-type');
        if (filter === 'all' || filter === itemType) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// FAQ Functions
function toggleFAQ(index) {
    const faqItem = document.querySelector(`[data-index="${index}"]`);
    if (!faqItem) return;
    
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const toggle = item.querySelector('.faq-toggle');
        if (toggle) toggle.textContent = '+';
    });
    
    // Open clicked FAQ if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
        const toggle = faqItem.querySelector('.faq-toggle');
        if (toggle) toggle.textContent = '-';
    }
}

// Cart Functions
function addToCart(name, price, protein, base, isCustom = false, toppings = []) {
    console.log('Adding to cart:', name, price, protein, base);
    
    const existingItem = cart.find(item => 
        item.name === name && 
        JSON.stringify(item.toppings || []) === JSON.stringify(toppings)
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            name,
            price,
            protein,
            base,
            quantity: 1,
            isCustom,
            toppings: toppings || []
        });
    }
    
    saveCart();
    updateCartCount();
    showAddToCartFeedback(name);
    
    // Track add to cart event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'add_to_cart', {
            currency: 'INR',
            value: price,
            items: [{
                item_id: name.toLowerCase().replace(/\s+/g, '-'),
                item_name: name,
                category: base,
                quantity: 1,
                price: price
            }]
        });
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function updateCartQuantity(id, quantity) {
    const item = cart.find(item => item.id === id);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(id);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartCount();
            updateCartDisplay();
        }
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function updateCartDisplay() {
    const container = document.getElementById('cartContent');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <button class="btn btn--primary" onclick="navigateToPage('menu')">Browse Menu</button>
            </div>
        `;
        return;
    }
    
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalProtein = cart.reduce((sum, item) => sum + (item.protein * item.quantity), 0);
    
    container.innerHTML = `
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-details">
                            ${item.protein}g protein • ${item.base}
                            ${item.toppings && item.toppings.length > 0 ? 
                                `<br>Toppings: ${item.toppings.join(', ')}` : ''}
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-price">₹${item.price}</div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" 
                                   onchange="updateCartQuantity(${item.id}, parseInt(this.value))" min="1">
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Total Items:</span>
                <span>${cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div class="summary-row">
                <span>Total Protein:</span>
                <span>${totalProtein}g</span>
            </div>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹${cartTotal}</span>
            </div>
            <div class="summary-row">
                <span>Delivery:</span>
                <span>${cartTotal >= 200 ? 'Free' : '₹30'}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>₹${cartTotal >= 200 ? cartTotal : cartTotal + 30}</span>
            </div>
            
            <button class="btn btn--primary btn--full-width mt-16" onclick="navigateToPage('checkout')" ${cart.length === 0 ? 'disabled' : ''}>
                Proceed to Checkout
            </button>
        </div>
    `;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showAddToCartFeedback(itemName) {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.textContent = `${itemName} added to cart!`;
    feedback.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--color-success);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

// Custom Bowl Builder Functions
function setupCustomBowlBuilder() {
    customBowl = {
        base: '',
        protein: 0,
        toppings: [],
        step: 1
    };
    updateCustomBowlDisplay();
}

function setupCustomBowlHandlers() {
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const addCustomBtn = document.getElementById('addCustomBowl');
    
    if (nextBtn) nextBtn.addEventListener('click', nextCustomBowlStep);
    if (prevBtn) prevBtn.addEventListener('click', prevCustomBowlStep);
    if (addCustomBtn) addCustomBtn.addEventListener('click', addCustomBowlToCart);
    
    // Base selection
    document.querySelectorAll('[data-base]').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('[data-base]').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            customBowl.base = this.getAttribute('data-base');
        });
    });
    
    // Protein selection
    document.querySelectorAll('input[name="protein"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                customBowl.protein = parseInt(this.value);
                updateCustomBowlPrice();
            }
        });
    });
    
    // Toppings selection
    document.querySelectorAll('input[name="toppings"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const topping = this.value;
            if (this.checked) {
                if (!customBowl.toppings.includes(topping)) {
                    customBowl.toppings.push(topping);
                }
            } else {
                customBowl.toppings = customBowl.toppings.filter(t => t !== topping);
            }
            updateCustomBowlSummary();
        });
    });
}

function nextCustomBowlStep() {
    if (!validateCustomBowlStep(customBowl.step)) {
        return;
    }
    
    if (customBowl.step < 3) {
        customBowl.step++;
        updateCustomBowlDisplay();
    }
}

function prevCustomBowlStep() {
    if (customBowl.step > 1) {
        customBowl.step--;
        updateCustomBowlDisplay();
    }
}

function validateCustomBowlStep(step) {
    switch (step) {
        case 1:
            if (!customBowl.base) {
                alert('Please select a base for your bowl');
                return false;
            }
            break;
        case 2:
            if (!customBowl.protein) {
                alert('Please select protein amount');
                return false;
            }
            break;
    }
    return true;
}

function updateCustomBowlDisplay() {
    // Update step indicators
    document.querySelectorAll('.builder-steps .step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 === customBowl.step);
    });
    
    // Update step content
    document.querySelectorAll('.step-content').forEach((content, index) => {
        content.classList.toggle('active', index + 1 === customBowl.step);
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    
    if (prevBtn) prevBtn.style.display = customBowl.step > 1 ? 'inline-flex' : 'none';
    if (nextBtn) nextBtn.style.display = customBowl.step < 3 ? 'inline-flex' : 'none';
    
    if (customBowl.step === 3) {
        updateCustomBowlSummary();
    }
}

function updateCustomBowlPrice() {
    let basePrice = 0;
    if (customBowl.base === 'sprouts') {
        basePrice = customBowl.protein === 15 ? 75 : 
                   customBowl.protein === 20 ? 90 :
                   customBowl.protein === 25 ? 105 : 120;
    } else if (customBowl.base === 'paneer') {
        basePrice = customBowl.protein === 15 ? 80 : 
                   customBowl.protein === 20 ? 95 :
                   customBowl.protein === 25 ? 110 : 130;
    }
    
    const addCustomBtn = document.getElementById('addCustomBowl');
    if (addCustomBtn) {
        addCustomBtn.textContent = `Add to Cart - ₹${basePrice}`;
    }
    
    return basePrice;
}

function updateCustomBowlSummary() {
    const summaryContainer = document.getElementById('customBowlSummary');
    const price = updateCustomBowlPrice();
    
    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <div class="summary-item"><strong>Base:</strong> ${customBowl.base || 'Not selected'}</div>
            <div class="summary-item"><strong>Protein:</strong> ${customBowl.protein}g</div>
            <div class="summary-item"><strong>Toppings:</strong> ${customBowl.toppings.length > 0 ? customBowl.toppings.join(', ') : 'None'}</div>
            <div class="summary-item"><strong>Price:</strong> ₹${price}</div>
        `;
    }
}

function addCustomBowlToCart() {
    if (!validateCustomBowlStep(1) || !validateCustomBowlStep(2)) {
        return;
    }
    
    const price = updateCustomBowlPrice();
    const name = `Custom ${customBowl.protein}g ${customBowl.base} Bowl`;
    
    addToCart(name, price, customBowl.protein, customBowl.base, true, customBowl.toppings);
    
    // Reset custom bowl builder
    setupCustomBowlBuilder();
    navigateToPage('cart');
}

// Form Handlers
function setupFormHandlers() {
    // Waitlist form
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', handleWaitlistSubmit);
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleWaitlistSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('waitlistName').value;
    const email = document.getElementById('waitlistEmail').value;
    const phone = document.getElementById('waitlistPhone').value;
    
    // Simulate API call
    showLoading();
    setTimeout(() => {
        hideLoading();
        alert('Thank you for joining our waitlist! We\'ll notify you when subscriptions are available.');
        e.target.reset();
    }, 1000);
    
    // Track event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'generate_lead', {
            currency: 'INR',
            value: 0
        });
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    // Simulate API call
    showLoading();
    setTimeout(() => {
        hideLoading();
        alert('Thank you for your message! We\'ll get back to you within 24 hours.');
        e.target.reset();
    }, 1000);
}

// Checkout Functions
function setupCheckoutHandlers() {
    const razorpayBtn = document.getElementById('razorpayBtn');
    if (razorpayBtn) {
        razorpayBtn.addEventListener('click', initiatePayment);
    }
}

function updateCheckoutSummary() {
    const container = document.getElementById('checkoutSummary');
    if (!container) return;
    
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = cartTotal >= 200 ? 0 : 30;
    const total = cartTotal + deliveryFee;
    
    container.innerHTML = `
        <div class="checkout-items">
            ${cart.map(item => `
                <div class="checkout-item">
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-qty">Qty: ${item.quantity}</div>
                    </div>
                    <div class="item-price">₹${item.price * item.quantity}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="checkout-totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${cartTotal}</span>
            </div>
            <div class="total-row">
                <span>Delivery:</span>
                <span>${deliveryFee === 0 ? 'Free' : '₹' + deliveryFee}</span>
            </div>
            <div class="total-row final-total">
                <span><strong>Total:</strong></span>
                <span><strong>₹${total}</strong></span>
            </div>
        </div>
    `;
}

function initiatePayment() {
    // Validate checkout form
    const form = document.getElementById('checkoutForm');
    if (!form || !form.checkValidity()) {
        if (form) form.reportValidity();
        return;
    }
    
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = cartTotal >= 200 ? 0 : 30;
    const total = cartTotal + deliveryFee;
    
    const customerData = {
        name: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        email: document.getElementById('customerEmail').value,
        address: document.getElementById('deliveryAddress').value,
        area: document.getElementById('deliveryArea').value,
        slot: document.getElementById('deliverySlot').value
    };
    
    // Configure Razorpay
    const options = {
        key: 'rzp_test_1234567890abcdef',
        amount: total * 100,
        currency: 'INR',
        name: 'GreensNProtein',
        description: 'Protein Bowl Order',
        order_id: 'order_' + Date.now(),
        handler: function(response) {
            handlePaymentSuccess(response, customerData, total);
        },
        prefill: {
            name: customerData.name,
            email: customerData.email,
            contact: customerData.phone
        },
        theme: {
            color: '#0f766e'
        },
        modal: {
            ondismiss: function() {
                hideLoading();
            }
        }
    };
    
    showLoading();
    
    if (typeof Razorpay !== 'undefined') {
        const razorpay = new Razorpay(options);
        razorpay.on('payment.failed', function(response) {
            hideLoading();
            alert('Payment failed. Please try again.');
            
            // Show UPI fallback
            const upiAmount = document.getElementById('upiAmount');
            if (upiAmount) upiAmount.textContent = total;
            openModal('upiModal');
        });
        
        razorpay.open();
    } else {
        // Fallback if Razorpay not loaded
        hideLoading();
        alert('Payment gateway not available. Please try again.');
    }
}

function handlePaymentSuccess(response, customerData, total) {
    hideLoading();
    
    // Create order summary
    const orderSummary = {
        orderId: response.razorpay_payment_id || 'GNP' + Date.now(),
        items: [...cart],
        customer: customerData,
        total: total,
        totalProtein: cart.reduce((sum, item) => sum + (item.protein * item.quantity), 0),
        timestamp: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Save order to localStorage
    localStorage.setItem('lastOrder', JSON.stringify(orderSummary));
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    
    // Track purchase
    if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
            transaction_id: orderSummary.orderId,
            value: total,
            currency: 'INR'
        });
    }
    
    // Redirect to thank you page
    navigateToPage('thank-you');
}

function displayOrderDetails() {
    const container = document.getElementById('orderDetails');
    const orderData = JSON.parse(localStorage.getItem('lastOrder') || '{}');
    
    if (!container || !orderData.orderId) return;
    
    container.innerHTML = `
        <div class="order-header">
            <h3>Order Confirmation</h3>
            <div class="order-id">Order ID: ${orderData.orderId}</div>
        </div>
        
        <div class="order-items">
            <h4>Items Ordered:</h4>
            ${orderData.items.map(item => `
                <div class="order-item">
                    <span>${item.name} (${item.quantity}x)</span>
                    <span>₹${item.price * item.quantity}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="order-totals">
            <div class="total-protein">Total Protein: ${orderData.totalProtein}g</div>
            <div class="total-amount">Total Amount: ₹${orderData.total}</div>
        </div>
        
        <div class="delivery-info">
            <h4>Delivery Details:</h4>
            <p><strong>Name:</strong> ${orderData.customer.name}</p>
            <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
            <p><strong>Address:</strong> ${orderData.customer.address}</p>
            <p><strong>Area:</strong> ${orderData.customer.area}</p>
            <p><strong>Time Slot:</strong> ${orderData.customer.slot}</p>
        </div>
    `;
    
    // Add confetti effect
    triggerConfetti();
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
    }
}

function handleModalClick(e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
}

// Loading Functions
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Utility Functions
function triggerConfetti() {
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}%;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                z-index: 1000;
                pointer-events: none;
                animation: confettiFall 3s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 100);
    }
}

// Add CSS for animations
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
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
document.head.appendChild(animationStyle);

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal:not(.hidden)');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleFAQ = toggleFAQ;
window.openModal = openModal;
window.closeModal = closeModal;
window.navigateToPage = navigateToPage;