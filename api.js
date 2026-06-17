// Shared API client – all pages use the same server session (cookie).

let currentUser = null;
let cart = [];

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    throw err;
  }

  return data;
}

function isLoggedIn() {
  return currentUser !== null;
}

function getCurrentUser() {
  return currentUser;
}

async function initSession() {
  try {
    const data = await apiFetch('/api/me');
    currentUser = data.user;
  } catch {
    currentUser = null;
  }

  if (typeof updateAuthUI === 'function') updateAuthUI();
  await reloadCart();
  document.dispatchEvent(new CustomEvent('nutritionxp:ready'));
}

function goToCartPage() {
  window.location.href = 'index.html?page=cart';
}

function goToOrdersPage() {
  window.location.href = 'index.html?page=orders';
}
