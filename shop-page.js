// Shared logic for category (index2) and brand (index3) shop pages

function normalizeFilterValue(value) {
  return String(value || '').trim().toLowerCase();
}

function matchesCategory(productCategory, filterCategory) {
  return normalizeFilterValue(productCategory) === normalizeFilterValue(filterCategory);
}

function matchesBrand(productBrand, filterBrand) {
  return normalizeFilterValue(productBrand) === normalizeFilterValue(filterBrand);
}

function displayProducts2(products) {
  const productsGrid = document.getElementById('productsGrid');
  const resultsCount = document.getElementById('resultsCount');

  if (!productsGrid || !resultsCount) return;

  resultsCount.textContent = `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`;

  if (products.length === 0) {
    productsGrid.innerHTML = `
      <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <i class="fas fa-search" style="font-size: 80px; color: #333; margin-bottom: 20px;"></i>
        <h3 style="font-size: 28px; margin-bottom: 10px;">No products found</h3>
        <p style="color: #B3B3B3;">Try adjusting your filters</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = products.map(product => `
    <div class="product-card shop-product-card">
      <div class="product-image-container">
        <img src="${product.image || getDefaultCategoryImage(product.name)}" alt="${product.name}" class="product-image">
        ${product.discount > 0 ? `<div class="discount-badge">-${Math.round(product.discount)}%</div>` : ''}
        ${!product.inStock ? `<div class="discount-badge" style="background:#ff4444;top:auto;bottom:10px;">Out of Stock</div>` : ''}
      </div>
      <div class="product-info">
        <div class="product-category">${product.brand ? product.brand + ' · ' : ''}${product.category || ''}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description || product.variation || ''}</p>
        <div class="product-rating">
          <span class="stars">${getStars(product.rating || 4.5)}</span>
          <span class="rating-count">${product.inStock ? 'In Stock' : 'Out of stock'}</span>
        </div>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-current">₹${Math.round(product.price).toLocaleString()}</span>
            ${product.originalPrice && product.originalPrice > product.price ? `<span class="price-original">₹${Math.round(product.originalPrice).toLocaleString()}</span>` : ''}
          </div>
          <button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
            <i class="fas fa-cart-plus"></i> ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function applyFilters() {
  let filteredProducts = [...productsData];

  const urlCategory = getCategoryFromURL();
  const pageMode = document.body.dataset.shopMode || 'category';

  if (urlCategory) {
    if (pageMode === 'brand') {
      filteredProducts = filteredProducts.filter(p => matchesBrand(p.brand, urlCategory));
    } else {
      filteredProducts = filteredProducts.filter(p => matchesCategory(p.category, urlCategory));
    }
  }

  const categoryCheckboxes = document.querySelectorAll('#protein, #preworkout, #creatine, #bcaa, #vitamins, #fatburner');
  const selectedCategories = Array.from(categoryCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter(p =>
      selectedCategories.some(cat => matchesCategory(p.category, cat) || normalizeFilterValue(p.category).includes(normalizeFilterValue(cat)))
    );
  }

  const minPriceEl = document.getElementById('minPrice');
  const maxPriceEl = document.getElementById('maxPrice');
  if (minPriceEl && maxPriceEl) {
    const minPrice = parseFloat(minPriceEl.value) || 0;
    const maxPrice = parseFloat(maxPriceEl.value) || 999999;
    filteredProducts = filteredProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);
  }

  const selectedRating = document.querySelector('input[name="rating"]:checked')?.value || 0;
  if (selectedRating > 0) {
    filteredProducts = filteredProducts.filter(p => (p.rating || 0) >= parseFloat(selectedRating));
  }

  const discountCheckboxes = document.querySelectorAll('#discount50, #discount40, #discount30, #discount20, #discount10');
  const selectedDiscounts = Array.from(discountCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => parseInt(cb.value, 10));

  if (selectedDiscounts.length > 0) {
    const minDiscount = Math.min(...selectedDiscounts);
    filteredProducts = filteredProducts.filter(p => (p.discount || 0) >= minDiscount);
  }

  const sortDropdown = document.getElementById('sortDropdown');
  const sortValue = sortDropdown ? sortDropdown.value : 'default';
  switch (sortValue) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  displayProducts2(filteredProducts);
}

function getCategoryFromURL() {
  return new URLSearchParams(window.location.search).get('category');
}

function updatePageHeader() {
  const category = getCategoryFromURL();
  const pageHeader = document.querySelector('.page-header h1');
  if (pageHeader && category) {
    pageHeader.textContent = category;
  }
}

function initShopPage() {
  updatePageHeader();
  applyFilters();
  if (document.getElementById('rangeMin')) updatePriceRange();
}

document.addEventListener('nutritionxp:products-ready', initShopPage);

document.addEventListener('DOMContentLoaded', () => {
  if (productsData.length > 0) initShopPage();
});
