// Authentication via database API (session cookie shared across all pages).

async function loadAuthModal() {
  const mount = document.getElementById('auth-modal-mount');
  if (!mount || mount.dataset.loaded === 'true') return;

  try {
    const res = await fetch('/auth-modal.html');
    mount.innerHTML = await res.text();
    mount.dataset.loaded = 'true';

    const authOverlay = document.getElementById('authOverlay');
    if (authOverlay) authOverlay.addEventListener('click', closeAuthModal);
  } catch {
    console.error('Could not load sign-up form. Is the server running?');
  }
}

function requireAuthForCart() {
  if (isLoggedIn()) return true;
  openAuthModal('login');
  showToast('Please sign up or log in to add items to your cart.');
  return false;
}

function updateAuthUI() {
  const authButtons = document.getElementById('authButtons');
  const userMenu = document.getElementById('userMenu');
  const userDisplayName = document.getElementById('userDisplayName');
  const mobileAuthSection = document.getElementById('mobileAuthSection');

  const user = getCurrentUser();

  if (authButtons) authButtons.style.display = user ? 'none' : 'flex';
  if (userMenu) userMenu.style.display = user ? 'flex' : 'none';
  if (userDisplayName && user) userDisplayName.textContent = user.name.split(' ')[0];

  if (mobileAuthSection) {
    if (user) {
      mobileAuthSection.innerHTML = `
        <span class="mobile-user-name"><i class="fas fa-user"></i> ${user.name}</span>
        <a href="#" onclick="logoutUser(); closeMobileMenu(); return false;">
          <i class="fas fa-sign-out-alt"></i> Logout
        </a>
      `;
    } else {
      mobileAuthSection.innerHTML = `
        <a href="#" onclick="openAuthModal('login'); closeMobileMenu(); return false;">
          <i class="fas fa-sign-in-alt"></i> Login
        </a>
        <a href="#" onclick="openAuthModal('signup'); closeMobileMenu(); return false;">
          <i class="fas fa-user-plus"></i> Sign Up
        </a>
      `;
    }
  }

  updateCartCount();
}

function openAuthModal(mode) {
  const overlay = document.getElementById('authOverlay');
  const modal = document.getElementById('authModal');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const authError = document.getElementById('authError');

  if (!overlay || !modal) return;

  authError.textContent = '';
  authError.style.display = 'none';

  if (mode === 'signup') {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    document.getElementById('authModalTitle').textContent = 'Create Account';
  } else {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    document.getElementById('authModalTitle').textContent = 'Login';
  }

  overlay.classList.add('show');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  const overlay = document.getElementById('authOverlay');
  const modal = document.getElementById('authModal');
  if (overlay) overlay.classList.remove('show');
  if (modal) modal.classList.remove('show');
  document.body.style.overflow = '';

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  if (loginForm) loginForm.reset();
  if (signupForm) signupForm.reset();
  const authError = document.getElementById('authError');
  if (authError) {
    authError.textContent = '';
    authError.style.display = 'none';
  }
}

function switchAuthMode(mode) {
  openAuthModal(mode);
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const authError = document.getElementById('authError');
  const btn = e.target.querySelector('.auth-submit-btn');
  btn.disabled = true;

  try {
    const result = await apiFetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    currentUser = result.user;
    closeAuthModal();
    updateAuthUI();
    await reloadCart();
    showToast(result.message);
  } catch (err) {
    authError.textContent = err.message;
    authError.style.display = 'block';
  } finally {
    btn.disabled = false;
  }
}

async function handleSignupSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const phone = document.getElementById('signupPhone').value;
  const address = document.getElementById('signupAddress').value;
  const city = document.getElementById('signupCity').value;
  const country = document.getElementById('signupCountry').value;
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;
  const authError = document.getElementById('authError');
  const btn = e.target.querySelector('.auth-submit-btn');

  if (password !== confirm) {
    authError.textContent = 'Passwords do not match.';
    authError.style.display = 'block';
    return;
  }

  btn.disabled = true;
  try {
    const result = await apiFetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password, address, city, country })
    });
    currentUser = result.user;
    closeAuthModal();
    updateAuthUI();
    await reloadCart();
    showToast(result.message);
  } catch (err) {
    authError.textContent = err.message;
    authError.style.display = 'block';
  } finally {
    btn.disabled = false;
  }
}

async function logoutUser() {
  try {
    await apiFetch('/api/logout', { method: 'POST' });
  } catch {
    // still clear local state
  }
  currentUser = null;
  cart = [];
  updateAuthUI();
  if (typeof renderCartPage === 'function') renderCartPage();
  showToast('You have been logged out.');
}

function showToast(message) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-info-circle"></i><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadAuthModal();
  initSession();
});
