// NutritionXP — Navbar search with live suggestions
// Works on index.html (SPA), index2.html (category page), index3.html (brand page)

(function () {
  'use strict';

  /* ── helpers ─────────────────────────────────────── */

  function norm(str) {
    return String(str || '').toLowerCase().trim();
  }

  function highlight(text, query) {
    if (!query) return escapeHtml(text);
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escapeHtml(text).replace(
      new RegExp('(' + escaped + ')', 'gi'),
      '<mark>$1</mark>'
    );
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── navigation helpers ───────────────────────────── */

  const isHomePage = !!document.getElementById('homePage');

  function navigateToProduct(productId) {
    if (isHomePage) {
      if (typeof viewDetail === 'function') {
        viewDetail(productId);
      }
    } else {
      const from = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = 'index.html?page=detail&id=' + productId + '&from=' + from;
    }
  }

  function navigateToCategory(categoryName) {
    window.location.href = 'index2.html?category=' + encodeURIComponent(categoryName);
  }

  function navigateToBrand(brandName) {
    window.location.href = 'index3.html?category=' + encodeURIComponent(brandName);
  }

  /* When the user hits Enter (no suggestion selected), navigate to a full
     search results page. On index2/index3 we pass the query as a URL param
     and let the page filter. On index.html we show a synthetic search results
     view inline. */
  function navigateSearch(query) {
    if (!query) return;
    if (isHomePage) {
      showSearchPage(query);
    } else {
      // Redirect to index2 with a search query (category page handles it)
      window.location.href = 'index2.html?search=' + encodeURIComponent(query);
    }
  }

  /* ── search results page (index.html only) ─────────── */

  function showSearchPage(query) {
    const q = norm(query);
    const products = (typeof productsData !== 'undefined' ? productsData : [])
      .filter(p =>
        norm(p.name).includes(q) ||
        norm(p.brand).includes(q) ||
        norm(p.category).includes(q) ||
        norm(p.description).includes(q)
      );

    // Reuse the detail page slot — swap content temporarily using a search page
    const detailPage = document.getElementById('detailPage');
    if (!detailPage) return;

    // Store back source so back button works
    if (typeof detailSource !== 'undefined') {
      window.detailSourceBeforeSearch = detailSource;
    }

    detailPage.innerHTML = `
      <div class="search-results-container">
        <a class="back-btn" onclick="closeSearchPage()">
          <i class="fas fa-arrow-left"></i> Back
        </a>
        <h2 style="margin-bottom:8px;">Search Results</h2>
        <p style="color:#b8a898;margin-bottom:32px;">
          ${products.length} result${products.length !== 1 ? 's' : ''} for "<strong style="color:#FF7A1A;">${escapeHtml(query)}</strong>"
        </p>
        ${products.length === 0
          ? `<div style="text-align:center;padding:60px 20px;">
               <i class="fas fa-search" style="font-size:70px;color:#333;margin-bottom:24px;display:block;"></i>
               <h3>No products found</h3>
               <p>Try a different name, category, or brand.</p>
             </div>`
          : `<div class="search-results-grid">
               ${products.map(p => `
                 <div class="search-result-card" onclick="viewDetail(${p.id})">
                   <div class="src-img-wrap">
                     <img src="${escapeHtml(p.image || '')}" alt="${escapeHtml(p.name)}">
                   </div>
                   <div class="src-info">
                     <div class="src-category">${escapeHtml(p.brand ? p.brand + ' · ' : '')}${escapeHtml(p.category || '')}</div>
                     <h3>${escapeHtml(p.name)}</h3>
                     <div class="src-price">₹${Math.round(p.price).toLocaleString()}</div>
                     <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
                       <button class="card-button" onclick="event.stopPropagation();addToCart(${p.id})">
                         <i class="fas fa-cart-plus"></i> Add to Cart
                       </button>
                       ${p.inStock
                         ? `<button class="card-button buy-now-card-btn" onclick="event.stopPropagation();buyNow(${p.id})">
                              <i class="fas fa-bolt"></i> Buy Now
                            </button>`
                         : `<span style="color:#ff4444;font-size:13px;font-weight:600;align-self:center;">Out of Stock</span>`
                       }
                     </div>
                   </div>
                 </div>
               `).join('')}
             </div>`
        }
      </div>
    `;

    if (typeof showPage === 'function') showPage('detail');
  }

  window.closeSearchPage = function () {
    const detailPage = document.getElementById('detailPage');
    if (!detailPage) return;
    // Restore original detail page HTML — reload page to restore cleanly
    if (typeof goBackFromDetail === 'function') {
      // Re-build detail page markup then go home
      detailPage.innerHTML = window._detailPageOriginalHTML || '';
      if (typeof showPage === 'function') showPage('home');
    } else {
      if (typeof showPage === 'function') showPage('home');
    }
  };

  /* ── build the dropdown ───────────────────────────── */

  let activeIndex = -1;
  let currentSuggestions = [];
  let debounceTimer = null;

  function buildSuggestions(query) {
    const q = norm(query);
    if (!q || q.length < 1) return [];

    const suggestions = [];

    // --- products (max 6) ---
    const products = typeof productsData !== 'undefined' ? productsData : [];
    const matchedProducts = products.filter(p =>
      norm(p.name).includes(q) ||
      norm(p.brand).includes(q) ||
      norm(p.category).includes(q)
    ).slice(0, 6);

    matchedProducts.forEach(p => {
      suggestions.push({
        type: 'product',
        label: p.name,
        sublabel: (p.brand ? p.brand + ' · ' : '') + (p.category || ''),
        price: '₹' + Math.round(p.price).toLocaleString(),
        image: p.image || '',
        id: p.id,
        inStock: p.inStock
      });
    });

    // --- categories (max 3) ---
    const categories = typeof categoriesData !== 'undefined' ? categoriesData : [];
    categories
      .filter(c => norm(c.name).includes(q))
      .slice(0, 3)
      .forEach(c => {
        suggestions.push({
          type: 'category',
          label: c.name,
          sublabel: c.productCount ? c.productCount + ' products' : 'Browse category',
          icon: 'fa-layer-group',
          name: c.name
        });
      });

    // --- brands (max 3) ---
    const brands = typeof brandsData !== 'undefined' ? brandsData : [];
    brands
      .filter(b => norm(b.name).includes(q))
      .slice(0, 3)
      .forEach(b => {
        suggestions.push({
          type: 'brand',
          label: b.name,
          sublabel: b.productCount ? b.productCount + ' products' : 'Browse brand',
          image: b.image || '',
          name: b.name
        });
      });

    return suggestions;
  }

  function renderDropdown(dropdown, suggestions, query) {
    if (!suggestions.length) {
      dropdown.innerHTML = `
        <div class="search-no-results">
          <i class="fas fa-search"></i> No results for "<strong>${escapeHtml(query)}</strong>"
        </div>`;
      dropdown.classList.add('open');
      return;
    }

    let html = '';
    let lastType = null;

    suggestions.forEach((s, i) => {
      // Section header
      if (s.type !== lastType) {
        const labels = { product: 'Products', category: 'Categories', brand: 'Brands' };
        html += `<div class="search-section-header">${labels[s.type]}</div>`;
        lastType = s.type;
      }

      if (s.type === 'product') {
        html += `
          <div class="search-item" data-index="${i}" role="option">
            <div class="search-item-img">
              ${s.image
                ? `<img src="${escapeHtml(s.image)}" alt="">`
                : `<i class="fas fa-box"></i>`
              }
            </div>
            <div class="search-item-text">
              <div class="search-item-name">${highlight(s.label, query)}</div>
              <div class="search-item-sub">${escapeHtml(s.sublabel)}${!s.inStock ? ' · <span style="color:#ff6b6b">Out of Stock</span>' : ''}</div>
            </div>
            <div class="search-item-price">${s.price}</div>
          </div>`;
      } else if (s.type === 'category') {
        html += `
          <div class="search-item" data-index="${i}" role="option">
            <div class="search-item-icon">
              <i class="fas fa-layer-group"></i>
            </div>
            <div class="search-item-text">
              <div class="search-item-name">${highlight(s.label, query)}</div>
              <div class="search-item-sub">${escapeHtml(s.sublabel)}</div>
            </div>
            <div class="search-item-tag">Category</div>
          </div>`;
      } else {
        html += `
          <div class="search-item" data-index="${i}" role="option">
            <div class="search-item-img">
              ${s.image
                ? `<img src="${escapeHtml(s.image)}" alt="" style="border-radius:50%;">`
                : `<i class="fas fa-tags"></i>`
              }
            </div>
            <div class="search-item-text">
              <div class="search-item-name">${highlight(s.label, query)}</div>
              <div class="search-item-sub">${escapeHtml(s.sublabel)}</div>
            </div>
            <div class="search-item-tag">Brand</div>
          </div>`;
      }
    });

    html += `<div class="search-footer-hint">Press Enter to search all results</div>`;
    dropdown.innerHTML = html;
    dropdown.classList.add('open');

    // click handlers on items
    dropdown.querySelectorAll('.search-item').forEach(el => {
      el.addEventListener('mousedown', e => {
        e.preventDefault(); // prevent blur before click fires
        const idx = parseInt(el.dataset.index, 10);
        selectSuggestion(suggestions[idx]);
      });
    });
  }

  function selectSuggestion(s) {
    if (!s) return;
    closeAllDropdowns();
    if (s.type === 'product') navigateToProduct(s.id);
    else if (s.type === 'category') navigateToCategory(s.name);
    else if (s.type === 'brand') navigateToBrand(s.name);
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.search-dropdown').forEach(d => {
      d.classList.remove('open');
      d.innerHTML = '';
    });
    activeIndex = -1;
    currentSuggestions = [];
  }

  /* ── wire each search input ───────────────────────── */

  function setupSearchInput(input) {
    // Wrap input in a relative-positioned container
    const wrapper = document.createElement('div');
    wrapper.className = 'search-wrapper';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    dropdown.setAttribute('role', 'listbox');
    wrapper.appendChild(dropdown);

    // Add search icon inside wrapper
    const icon = document.createElement('i');
    icon.className = 'fas fa-search search-input-icon';
    wrapper.appendChild(icon);

    input.setAttribute('autocomplete', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'false');

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const q = input.value.trim();
      activeIndex = -1;

      if (!q) {
        closeAllDropdowns();
        input.setAttribute('aria-expanded', 'false');
        return;
      }

      debounceTimer = setTimeout(() => {
        currentSuggestions = buildSuggestions(q);
        renderDropdown(dropdown, currentSuggestions, q);
        input.setAttribute('aria-expanded', 'true');
      }, 120);
    });

    input.addEventListener('keydown', e => {
      const items = dropdown.querySelectorAll('.search-item');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        updateActive(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, -1);
        updateActive(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && currentSuggestions[activeIndex]) {
          selectSuggestion(currentSuggestions[activeIndex]);
          input.value = '';
        } else {
          const q = input.value.trim();
          if (q) {
            closeAllDropdowns();
            input.value = '';
            navigateSearch(q);
          }
        }
      } else if (e.key === 'Escape') {
        closeAllDropdowns();
        input.blur();
      }
    });

    input.addEventListener('blur', () => {
      // Small delay so mousedown on item fires first
      setTimeout(closeAllDropdowns, 180);
      input.setAttribute('aria-expanded', 'false');
    });

    input.addEventListener('focus', () => {
      const q = input.value.trim();
      if (q && currentSuggestions.length) {
        renderDropdown(dropdown, currentSuggestions, q);
      }
    });
  }

  function updateActive(items) {
    items.forEach((el, i) => {
      el.classList.toggle('active', i === activeIndex);
      if (i === activeIndex) el.scrollIntoView({ block: 'nearest' });
    });
  }

  /* ── handle ?search= URL param on index2.html ─────── */

  function handleSearchParam() {
    if (isHomePage) return;
    const q = new URLSearchParams(window.location.search).get('search');
    if (!q) return;

    // Wait for products to load then filter
    function applySearch() {
      if (typeof productsData === 'undefined' || !productsData.length) return;
      const norm_q = norm(q);
      const filtered = productsData.filter(p =>
        norm(p.name).includes(norm_q) ||
        norm(p.brand).includes(norm_q) ||
        norm(p.category).includes(norm_q)
      );
      if (typeof displayProducts2 === 'function') {
        displayProducts2(filtered);
        const header = document.querySelector('.page-header h1');
        if (header) header.textContent = 'Search: ' + q;
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) resultsCount.textContent = `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${q}"`;
      }
    }

    document.addEventListener('nutritionxp:products-ready', applySearch, { once: true });
    if (typeof productsData !== 'undefined' && productsData.length) applySearch();
  }

  /* ── init ─────────────────────────────────────────── */

  function init() {
    // Wire all nav search inputs
    document.querySelectorAll('nav input[type="text"], nav input[placeholder*="Search"]').forEach(setupSearchInput);

    // Handle search URL param (index2 / index3)
    handleSearchParam();
  }

  // Run after DOM + products ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Also re-run if products load after DOM (API-driven)
  document.addEventListener('nutritionxp:products-ready', () => {
    // Refresh suggestions for any currently focused input
    const focused = document.activeElement;
    if (focused && focused.closest('.search-wrapper') && focused.value) {
      focused.dispatchEvent(new Event('input'));
    }
  });

})();
