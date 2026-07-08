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
      if (typeof viewDetail === 'function') viewDetail(productId);
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

  function navigateSearch(query) {
    if (!query) return;
    if (isHomePage) {
      showSearchPage(query);
    } else {
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

    const detailPage = document.getElementById('detailPage');
    if (!detailPage) return;

    detailPage.innerHTML = `
      <div class="search-results-container">
        <a class="back-btn" onclick="closeSearchPage()">
          <i class="fas fa-arrow-left"></i> Back
        </a>
        <h2 style="margin-bottom:8px;">Search Results</h2>
        <p style="color:#b8a898;margin-bottom:32px;">
          ${products.length} result${products.length !== 1 ? 's' : ''} for
          "<strong style="color:#FF7A1A;">${escapeHtml(query)}</strong>"
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
                         ? `<button class="card-button buy-now-card-btn"
                              onclick="event.stopPropagation();buyNow(${p.id})">
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
    if (typeof showPage === 'function') showPage('home');
  };

  /* ── single body-level dropdown shared across all inputs ── */

  // One dropdown lives on <body> so it is never trapped inside a
  // stacking context created by position:sticky / position:fixed headers.
  const bodyDropdown = document.createElement('div');
  bodyDropdown.className = 'search-dropdown';
  bodyDropdown.setAttribute('role', 'listbox');
  document.body.appendChild(bodyDropdown);

  let activeInput    = null;   // which input currently owns the dropdown
  let activeIndex    = -1;
  let currentSuggestions = [];
  let debounceTimer  = null;

  /* Position the dropdown directly below whichever input is active */
  function positionDropdown(input) {
    const rect = input.getBoundingClientRect();
    bodyDropdown.style.position = 'fixed';
    bodyDropdown.style.top      = (rect.bottom + 6) + 'px';
    bodyDropdown.style.left     = rect.left + 'px';
    bodyDropdown.style.width    = Math.max(rect.width, 320) + 'px';
    bodyDropdown.style.zIndex   = '999999';
  }

  /* Reposition on scroll / resize so dropdown tracks the input */
  function onScrollResize() {
    if (activeInput && bodyDropdown.classList.contains('open')) {
      positionDropdown(activeInput);
    }
  }
  window.addEventListener('scroll', onScrollResize, true);
  window.addEventListener('resize', onScrollResize);

  /* ── build the dropdown ───────────────────────────── */

  function buildSuggestions(query) {
    const q = norm(query);
    if (!q) return [];
    const suggestions = [];

    const products = typeof productsData !== 'undefined' ? productsData : [];
    products.filter(p =>
      norm(p.name).includes(q) || norm(p.brand).includes(q) || norm(p.category).includes(q)
    ).slice(0, 6).forEach(p => {
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

    const categories = typeof categoriesData !== 'undefined' ? categoriesData : [];
    categories.filter(c => norm(c.name).includes(q)).slice(0, 3).forEach(c => {
      suggestions.push({
        type: 'category',
        label: c.name,
        sublabel: c.productCount ? c.productCount + ' products' : 'Browse category',
        name: c.name
      });
    });

    const brands = typeof brandsData !== 'undefined' ? brandsData : [];
    brands.filter(b => norm(b.name).includes(q)).slice(0, 3).forEach(b => {
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

  function renderDropdown(suggestions, query) {
    if (!suggestions.length) {
      bodyDropdown.innerHTML = `
        <div class="search-no-results">
          <i class="fas fa-search"></i>
          No results for "<strong>${escapeHtml(query)}</strong>"
        </div>`;
      bodyDropdown.classList.add('open');
      return;
    }

    let html = '';
    let lastType = null;

    suggestions.forEach((s, i) => {
      if (s.type !== lastType) {
        const labels = { product: 'Products', category: 'Categories', brand: 'Brands' };
        html += `<div class="search-section-header">${labels[s.type]}</div>`;
        lastType = s.type;
      }

      if (s.type === 'product') {
        html += `
          <div class="search-item" data-index="${i}" role="option">
            <div class="search-item-img">
              ${s.image ? `<img src="${escapeHtml(s.image)}" alt="">` : `<i class="fas fa-box"></i>`}
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
            <div class="search-item-icon"><i class="fas fa-layer-group"></i></div>
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
                : `<i class="fas fa-tags"></i>`}
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
    bodyDropdown.innerHTML = html;
    bodyDropdown.classList.add('open');

    bodyDropdown.querySelectorAll('.search-item').forEach(el => {
      el.addEventListener('mousedown', e => {
        e.preventDefault();
        const idx = parseInt(el.dataset.index, 10);
        selectSuggestion(suggestions[idx]);
      });
      /* Touch devices — fire on touchend so the tap registers */
      el.addEventListener('touchend', e => {
        e.preventDefault();
        const idx = parseInt(el.dataset.index, 10);
        selectSuggestion(suggestions[idx]);
      });
    });
  }

  function selectSuggestion(s) {
    if (!s) return;
    closeDropdown();
    if (s.type === 'product')  navigateToProduct(s.id);
    else if (s.type === 'category') navigateToCategory(s.name);
    else if (s.type === 'brand')    navigateToBrand(s.name);
  }

  function closeDropdown() {
    bodyDropdown.classList.remove('open');
    bodyDropdown.innerHTML = '';
    activeIndex = -1;
    currentSuggestions = [];
    activeInput = null;
  }

  function updateActive() {
    const items = bodyDropdown.querySelectorAll('.search-item');
    items.forEach((el, i) => {
      el.classList.toggle('active', i === activeIndex);
      if (i === activeIndex) el.scrollIntoView({ block: 'nearest' });
    });
  }

  /* ── wire each search input ───────────────────────── */

  function setupSearchInput(input) {
    // Minimal wrapper — only for the search-icon positioning, no z-index
    const wrapper = document.createElement('div');
    wrapper.className = 'search-wrapper';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

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

      if (!q) { closeDropdown(); input.setAttribute('aria-expanded', 'false'); return; }

      debounceTimer = setTimeout(() => {
        activeInput = input;
        currentSuggestions = buildSuggestions(q);
        positionDropdown(input);
        renderDropdown(currentSuggestions, q);
        input.setAttribute('aria-expanded', 'true');
      }, 120);
    });

    input.addEventListener('keydown', e => {
      const items = bodyDropdown.querySelectorAll('.search-item');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        updateActive();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, -1);
        updateActive();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && currentSuggestions[activeIndex]) {
          selectSuggestion(currentSuggestions[activeIndex]);
          input.value = '';
        } else {
          const q = input.value.trim();
          if (q) { closeDropdown(); input.value = ''; navigateSearch(q); }
        }
      } else if (e.key === 'Escape') {
        closeDropdown(); input.blur();
      }
    });

    input.addEventListener('blur', () => {
      // Delay so mousedown/touchend on an item fires first
      setTimeout(closeDropdown, 220);
      input.setAttribute('aria-expanded', 'false');
    });

    input.addEventListener('focus', () => {
      const q = input.value.trim();
      if (q && currentSuggestions.length) {
        activeInput = input;
        positionDropdown(input);
        renderDropdown(currentSuggestions, q);
      }
    });
  }

  /* ── handle ?search= URL param on index2 / index3 ─── */

  function handleSearchParam() {
    if (isHomePage) return;
    const q = new URLSearchParams(window.location.search).get('search');
    if (!q) return;

    function applySearch() {
      if (typeof productsData === 'undefined' || !productsData.length) return;
      const nq = norm(q);
      const filtered = productsData.filter(p =>
        norm(p.name).includes(nq) || norm(p.brand).includes(nq) || norm(p.category).includes(nq)
      );
      if (typeof displayProducts2 === 'function') {
        displayProducts2(filtered);
        const h = document.querySelector('.page-header h1');
        if (h) h.textContent = 'Search: ' + q;
        const rc = document.getElementById('resultsCount');
        if (rc) rc.textContent = `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${q}"`;
      }
    }

    document.addEventListener('nutritionxp:products-ready', applySearch, { once: true });
    if (typeof productsData !== 'undefined' && productsData.length) applySearch();
  }

  /* ── init ─────────────────────────────────────────── */

  function init() {
    document.querySelectorAll('nav input[type="text"], nav input[placeholder*="Search"]')
      .forEach(setupSearchInput);

    const mobileInput = document.getElementById('mobileSearchInput');
    if (mobileInput) setupSearchInput(mobileInput);

    handleSearchParam();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('nutritionxp:products-ready', () => {
    const focused = document.activeElement;
    if (focused && focused.closest('.search-wrapper') && focused.value) {
      focused.dispatchEvent(new Event('input'));
    }
  });

})();
