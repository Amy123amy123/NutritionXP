
function getCartItemKey(product, source) {
  if (product.cartKey) return product.cartKey;
  return `${source}-${product.id}`;
}

async function reloadCart() {
  if (!isLoggedIn()) {
    cart = [];
    updateCartCount();
    return;
  }

  try {
    const data = await apiFetch('/api/cart');
    cart = data.items || [];
  } catch {
    cart = [];
  }
  updateCartCount();
}

function updateCartCount() {
  const count = isLoggedIn()
    ? cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
    : 0;
  const cartCountEl = document.getElementById('cartCount');
  const mobileCartCount = document.getElementById('mobileCartCount');
  if (cartCountEl) cartCountEl.textContent = count;
  if (mobileCartCount) mobileCartCount.textContent = count;
}

async function addProductToCart(product, quantity, source) {
  if (typeof requireAuthForCart === 'function' && !requireAuthForCart()) {
    return false;
  }

  const cartKey = getCartItemKey(product, source);

  try {
    const data = await apiFetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({
        cartKey,
        productId: product.id,
        source,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
        quantity
      })
    });
    cart = data.items || [];
    updateCartCount();
    return true;
  } catch (err) {
    showToast(err.message || 'Could not add to cart.');
    return false;
  }
}

async function addToCart(productId) {
  const product = findProductById(productId) || productsData.find(p => p.id === productId);
  if (!product) return;

  if (!product.inStock) {
    showToast(`${product.name} is out of stock.`);
    return;
  }

  if (await addProductToCart(product, 1, 'shop')) {
    showToast(`${product.name} added to cart!`);
  }
}

// Get Stars HTML
function getStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (hasHalfStar) {
        stars += '★';
    }
    while (stars.length < 5) {
        stars += '☆';
    }
    
    return stars;
}
// Clear All Filters
function clearAllFilters() {
    // Clear category checkboxes
    document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    // Reset price range
    document.getElementById('minPrice').value = 0;
    document.getElementById('maxPrice').value = 5000;
    document.getElementById('rangeMin').value = 0;
    document.getElementById('rangeMax').value = 5000;
    updatePriceRange();
    
    // Reset rating
    document.getElementById('rating-all').checked = true;
    
    // Reset sort
    document.getElementById('sortDropdown').value = 'default';
    
    applyFilters();
}


// Update Price Range
function updatePriceRange() {
    const rangeMin = document.getElementById('rangeMin');
    const rangeMax = document.getElementById('rangeMax');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const rangeProgress = document.getElementById('rangeProgress');
    
    let minVal = parseInt(rangeMin.value);
    let maxVal = parseInt(rangeMax.value);
    
    if (maxVal - minVal < 100) {
        if (event.target === rangeMin) {
            rangeMin.value = maxVal - 100;
            minVal = maxVal - 100;
        } else {
            rangeMax.value = minVal + 100;
            maxVal = minVal + 100;
        }
    }
    
    minPrice.value = minVal;
    maxPrice.value = maxVal;
    
    const percentMin = (minVal / 5000) * 100;
    const percentMax = (maxVal / 5000) * 100;
    rangeProgress.style.left = percentMin + '%';
    rangeProgress.style.width = (percentMax - percentMin) + '%';
    
    applyFilters();
}


// MOBILE MENU FUNCTIONS
function toggleMobileMenu() {
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileNavOverlay');
  const burger = document.getElementById('burgerMenu');
  
  mobileNav.classList.toggle('active');
  overlay.classList.toggle('active');
  burger.classList.toggle('active');
  
  // Prevent body scroll when menu is open
  if (mobileNav.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}


function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('mobileNavOverlay');
    const burger = document.getElementById('burgerMenu');
      
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    burger.classList.remove('active');
    document.body.style.overflow = '';
}


function getContinueShoppingAction() {
  const isMainPage = document.getElementById('homePage');
  return isMainPage ? "showPage('home')" : "window.location.href='index.html'";
}

function goToCartPage() {
  if (typeof showPage === 'function' && document.getElementById('cartPage')) {
    showPage('cart');
    return;
  }
  window.location.href = 'index.html?page=cart';
}

// RENDER CART PAGE (single cart – only on index.html)
async function renderCartPage() {
      const container = document.getElementById('cartPageContent');
      if (!container) return;

      const continueAction = getContinueShoppingAction();

      if (!isLoggedIn()) {
        container.innerHTML = `
          <div class="empty-cart-page">
            <i class="fas fa-user-lock"></i>
            <h3>Please log in</h3>
            <p>Sign up or log in to view and manage your cart.</p>
            <button class="continue-shopping-btn" onclick="openAuthModal('login')">Login / Sign Up</button>
          </div>
        `;
        return;
      }

      await reloadCart();

      if (cart.length === 0) {
        container.innerHTML = `
          <div class="empty-cart-page">
            <i class="fas fa-shopping-cart"></i>
            <h3>Your cart is empty</h3>
            <p>Add some amazing products to get started!</p>
            <button class="continue-shopping-btn" onclick="${continueAction}">Continue Shopping</button>
          </div>
        `;
        return;
      }

      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      container.innerHTML = `
        <div class="cart-items-list">
          ${cart.map((item) => `
            <div class="cart-page-item">
              <img src="${item.image}" alt="${item.name}">
              <div class="cart-page-item-info">
                <h3>${item.name}</h3>
                <p>${item.category || ''}</p>
                <div class="item-price">₹${Math.round(item.price).toLocaleString()}</div>
                <div class="quantity-selector">
                  <button onclick="updateCartQuantity(${item.id}, -1)">-</button>
                  <span>${item.quantity}</span>
                  <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
                </div>
              </div>
              <div class="cart-page-controls">
                <div style="font-size:20px;font-weight:700;color:#FC9145;">₹${Math.round(item.price * item.quantity).toLocaleString()}</div>
                <button class="card-button" onclick="removeFromCart(${item.id})" style="background:#ff4444;">
                  <i class="fas fa-trash"></i> Remove
                </button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="cart-summary">
          <h3>Order Summary</h3>
          <p>Total Items: ${cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)}</p>
          <div class="total-amount">₹${Math.round(total).toLocaleString()}</div>
          <button class="checkout-page-btn" onclick="checkout()">
            <i class="fas fa-lock"></i> Proceed to Checkout
          </button>
        </div>
      `;
}


// UPDATE CART QUANTITY
async function updateCartQuantity(itemId, delta) {
    if (!isLoggedIn()) return;
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    const newQty = Math.max(1, (Number(item.quantity) || 0) + delta);
    try {
      const data = await apiFetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity: newQty })
      });
      cart = data.items || [];
      updateCartCount();
      renderCartPage();
    } catch (err) {
      showToast(err.message);
    }
}

// REMOVE FROM CART
async function removeFromCart(itemId) {
    if (!isLoggedIn()) return;
    try {
      const data = await apiFetch(`/api/cart/${itemId}`, { method: 'DELETE' });
      cart = data.items || [];
      updateCartCount();
      renderCartPage();
    } catch (err) {
      showToast(err.message);
    }
}

// CHECKOUT
async function checkout() {
    if (typeof requireAuthForCart === 'function' && !requireAuthForCart()) return;
    await reloadCart();
    if (cart.length === 0) return;

    try {
      const result = await apiFetch('/api/checkout', { method: 'POST' });
      cart = [];
      updateCartCount();
      if (result.order) sendOrderEmail(result.order);
      showNotification();
    } catch (err) {
      showToast(err.message);
    }
}


// SEND ORDER EMAIL
function sendOrderEmail(order) {
      // Create email content
      let itemsList = order.items.map(item => 
        `${item.name} - Qty: ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`
      ).join('\n');
      
      let emailBody = `
New Order Received!
==================

Order Number: ${order.orderNumber}
Order Date: ${order.date}

ORDER DETAILS:
--------------
${itemsList}

TOTAL AMOUNT: ₹${order.total.toLocaleString()}

Customer will be contacted soon for confirmation.
      `;

      // Using EmailJS (Free service)
      // Note: You need to set up EmailJS account and get your credentials
      // For now, we'll use a simple mailto fallback
      
      const mailtoLink = `mailto:asb.asb.asbgfd@gmail.com?subject=New Order - ${order.orderNumber}&body=${encodeURIComponent(emailBody)}`;
      
      // Try to send via EmailJS first (if configured)
      if (typeof emailjs !== 'undefined') {
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
          to_email: 'asb.asb.asbgfd@gmail.com',
          order_number: order.orderNumber,
          order_date: order.date,
          order_items: itemsList,
          order_total: '₹' + order.total.toLocaleString()
        }).then(
          function(response) {
            console.log('Email sent successfully!', response);
          },
          function(error) {
            console.log('Email failed, opening mailto...', error);
            window.open(mailtoLink, '_blank');
          }
        );
      } else {
        // Fallback to mailto
        window.open(mailtoLink, '_blank');
      }
}

// SHOW NOTIFICATION
function showNotification() {
    const overlay = document.getElementById('notificationOverlay');
    const popup = document.getElementById('notificationPopup');
    if (overlay && popup) {
      overlay.classList.add('show');
      popup.classList.add('show');
    } else if (typeof showToast === 'function') {
      showToast('Order placed successfully!');
    }
}

// CLOSE NOTIFICATION
function closeNotification() {
    const overlay = document.getElementById('notificationOverlay');
    const popup = document.getElementById('notificationPopup');
    if (overlay) overlay.classList.remove('show');
    if (popup) popup.classList.remove('show');
    if (typeof showPage === 'function') {
      showPage('orders');
    } else {
      window.location.href = 'index.html';
    }
}


// RENDER ORDER HISTORY
async function renderOrderHistory() {
    const container = document.getElementById('orderHistoryContent');
    if (!container) return;

    if (!isLoggedIn()) {
      container.innerHTML = `
        <div class="empty-order-history">
          <i class="fas fa-user-lock"></i>
          <h3>Login required</h3>
          <p>Please log in to view your order history.</p>
          <button class="continue-shopping-btn" onclick="openAuthModal('login')">Login</button>
        </div>
      `;
      return;
    }

    let orderHistory = [];
    try {
      const data = await apiFetch('/api/orders');
      orderHistory = data.orders || [];
    } catch {
      orderHistory = [];
    }

    if (orderHistory.length === 0) {
      container.innerHTML = `
        <div class="empty-order-history">
          <i class="fas fa-receipt"></i>
          <h3>No orders yet</h3>
          <p>Your order history will appear here once you place your first order.</p>
          <button class="continue-shopping-btn" onclick="showPage('home')">Start Shopping</button>
        </div>
      `;
      return;
    }
    container.innerHTML = orderHistory.map(order => `
      <div class="order-card">
        <div class="order-header">
          <div>
            <div class="order-number">${order.orderNumber}</div>
            <div class="order-date">${order.date}</div>
          </div>
          <div class="order-status">${order.status}</div>
        </div>
        <div class="order-items">
          ${order.items.map(item => `
            <div class="order-item-row">
              <img src="${item.image}" alt="${item.name}">
              <div>
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-quantity">Quantity: ${item.quantity}</div>
              </div>
              <div class="order-item-price">₹${item.price.toLocaleString()}</div>
              <div class="order-item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
            </div>
          `).join('')}
        </div>
        <div class="order-total">
          <span class="order-total-label">Total Amount:</span>
          <span class="order-total-amount">₹${order.total.toLocaleString()}</span>
        </div>
      </div>
    `).join('');
}
