const storageKeys = {
  users: 'gs_users',
  current: 'gs_current_user',
  carts: 'gs_carts',
  orders: 'gs_orders'
};

const products = [
  { id: 'P-101', name: 'Organic Apples (1kg)', price: 3.99 },
  { id: 'P-102', name: 'Brown Bread', price: 2.49 },
  { id: 'P-103', name: 'Whole Milk (1L)', price: 1.89 },
  { id: 'P-104', name: 'Free Range Eggs (12)', price: 4.25 },
  { id: 'P-105', name: 'Almond Butter', price: 6.75 },
  { id: 'P-106', name: 'Granola Cereal', price: 5.15 },
  { id: 'P-107', name: 'Olive Oil (1L)', price: 8.99 },
  { id: 'P-108', name: 'Basmati Rice (5kg)', price: 12.5 }
];

const views = {
  login: document.getElementById('login-view'),
  register: document.getElementById('register-view'),
  home: document.getElementById('home-view'),
  profile: document.getElementById('profile-view'),
  cart: document.getElementById('cart-view')
};

const nav = document.getElementById('app-nav');
const navButtons = document.querySelectorAll('[data-view]');
const userChip = document.getElementById('user-chip');
const greetingEl = document.getElementById('greeting');

const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const loginIdInput = document.getElementById('login-id');
const loginPasswordInput = document.getElementById('login-password');
const showRegisterBtn = document.getElementById('show-register');
const backToLoginBtn = document.getElementById('back-to-login');

const registerForm = document.getElementById('register-form');
const registerMessage = document.getElementById('register-message');
const registrationTable = document.getElementById('registration-table');

const profileForm = document.getElementById('profile-form');
const profileMessage = document.getElementById('profile-message');
const profileInputs = {
  id: document.getElementById('profile-id'),
  name: document.getElementById('profile-name'),
  email: document.getElementById('profile-email'),
  phone: document.getElementById('profile-phone'),
  address: document.getElementById('profile-address')
};
const editProfileBtn = document.getElementById('edit-profile');
const saveProfileBtn = document.getElementById('save-profile');

const productsGrid = document.getElementById('products-grid');

const cartItemsEl = document.getElementById('cart-items');
const cartMessage = document.getElementById('cart-message');
const summaryItems = document.getElementById('summary-items');
const summaryTotal = document.getElementById('summary-total');
const checkoutBtn = document.getElementById('checkout-btn');

const invoiceSection = document.getElementById('invoice-section');
const invoiceLines = document.getElementById('invoice-lines');
const invoiceId = document.getElementById('invoice-id');
const invoiceDate = document.getElementById('invoice-date');
const invoiceTotal = document.getElementById('invoice-total');

const logoutBtn = document.getElementById('logout-btn');

let state = {
  currentUser: null,
  cart: []
};

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.users)) || [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(storageKeys.users, JSON.stringify(users));
}

function getCarts() {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.carts)) || {};
  } catch (e) {
    return {};
  }
}

function saveCarts(carts) {
  localStorage.setItem(storageKeys.carts, JSON.stringify(carts));
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.orders)) || [];
  } catch (e) {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(storageKeys.orders, JSON.stringify(orders));
}

function setCurrentUser(user) {
  state.currentUser = user;
  if (user) {
    localStorage.setItem(storageKeys.current, user.customerId);
    state.cart = getCarts()[user.customerId] || [];
  } else {
    localStorage.removeItem(storageKeys.current);
    state.cart = [];
  }
  updateNav();
}

function hydrateSession() {
  const savedId = localStorage.getItem(storageKeys.current);
  if (!savedId) return;
  const users = loadUsers();
  const user = users.find((u) => u.customerId === savedId);
  if (user) {
    setCurrentUser(user);
    showView('home');
    renderGreeting();
    renderProducts();
    renderProfile();
    renderCart();
    return true;
  }
  return false;
}

function showView(viewKey) {
  Object.entries(views).forEach(([key, section]) => {
    section.classList.toggle('hidden', key !== viewKey);
  });
}

function updateNav() {
  const loggedIn = Boolean(state.currentUser);
  nav.classList.toggle('hidden', !loggedIn);
  userChip.textContent = loggedIn ? `Hello, ${state.currentUser.name}` : 'Hello, Guest';
}

function renderGreeting() {
  if (!state.currentUser) return;
  greetingEl.textContent = `Hello ${state.currentUser.name} to Online Grocery Store`;
}

function renderProducts() {
  productsGrid.innerHTML = '';
  products.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div>
        <p class="product-title">${product.name}</p>
        <p class="price">$${product.price.toFixed(2)}</p>
      </div>
      <button class="primary block" data-add="${product.id}">Add to Cart</button>
    `;
    productsGrid.appendChild(card);
  });
}

function generateCustomerId() {
  const users = loadUsers();
  let id;
  do {
    id = `CUST-${Math.floor(100000 + Math.random() * 900000)}`;
  } while (users.some((u) => u.customerId === id));
  return id;
}

function populateRegistrationTable(user) {
  if (!user) return;
  registrationTable.classList.remove('hidden');
  document.getElementById('tbl-id').textContent = user.customerId;
  document.getElementById('tbl-name').textContent = user.name;
  document.getElementById('tbl-email').textContent = user.email;
  document.getElementById('tbl-phone').textContent = user.phone;
  document.getElementById('tbl-address').textContent = user.address;
}

function populateProfileTable(user) {
  if (!user) return;
  document.getElementById('profile-tbl-id').textContent = user.customerId;
  document.getElementById('profile-tbl-name').textContent = user.name;
  document.getElementById('profile-tbl-email').textContent = user.email;
  document.getElementById('profile-tbl-phone').textContent = user.phone;
  document.getElementById('profile-tbl-address').textContent = user.address;
}

function renderProfile() {
  if (!state.currentUser) return;
  const user = state.currentUser;
  profileInputs.id.value = user.customerId;
  profileInputs.name.value = user.name;
  profileInputs.email.value = user.email;
  profileInputs.phone.value = user.phone;
  profileInputs.address.value = user.address;
  populateProfileTable(user);
  profileForm.classList.add('readonly');
  toggleProfileEditing(false);
  profileMessage.textContent = '';
}

function toggleProfileEditing(editing) {
  const inputs = [profileInputs.name, profileInputs.email, profileInputs.phone, profileInputs.address];
  inputs.forEach((input) => (input.disabled = !editing));
  editProfileBtn.classList.toggle('hidden', editing);
  saveProfileBtn.classList.toggle('hidden', !editing);
}

function renderCart() {
  if (!state.currentUser) return;
  const cart = state.cart;
  cartItemsEl.innerHTML = '';
  if (!cart.length) {
    cartItemsEl.innerHTML = '<p class="message">Your cart is empty.</p>';
  } else {
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return;
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <div>
          <div>${product.name}</div>
          <div class="message">$${product.price.toFixed(2)} each</div>
        </div>
        <div>Qty: ${item.qty}</div>
        <button class="ghost danger" data-remove="${product.id}">Delete</button>
      `;
      cartItemsEl.appendChild(row);
    });
  }

  const totals = cart.reduce(
    (acc, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        acc.items += item.qty;
        acc.total += item.qty * product.price;
      }
      return acc;
    },
    { items: 0, total: 0 }
  );

  summaryItems.textContent = `${totals.items}`;
  summaryTotal.textContent = `$${totals.total.toFixed(2)}`;
}

function saveCart() {
  if (!state.currentUser) return;
  const carts = getCarts();
  carts[state.currentUser.customerId] = state.cart;
  saveCarts(carts);
}

function addToCart(productId) {
  if (!state.currentUser) {
    loginMessage.textContent = 'Please login to add products to cart.';
    showView('login');
    return;
  }
  const existing = state.cart.find((item) => item.productId === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ productId, qty: 1 });
  }
  saveCart();
  renderCart();
  cartMessage.textContent = 'Item added to cart.';
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.productId !== productId);
  saveCart();
  renderCart();
  cartMessage.textContent = 'Item removed.';
}

function handleCheckout() {
  if (!state.currentUser) return;
  if (!state.cart.length) {
    cartMessage.textContent = 'Add items before checkout.';
    return;
  }

  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date();
  const order = {
    orderId,
    userId: state.currentUser.customerId,
    items: state.cart.map((item) => ({ ...item })),
    createdAt: now.toISOString()
  };

  const totals = order.items.reduce(
    (acc, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        acc.total += product.price * item.qty;
      }
      return acc;
    },
    { total: 0 }
  );

  state.cart = [];
  saveCart();
  renderCart();
  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);
  renderInvoice(order, totals.total, now);
  cartMessage.textContent = '';
}

function renderInvoice(order, total, dateObj) {
  invoiceLines.innerHTML = '';
  order.items.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product.name}</td>
      <td>${item.qty}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>$${(product.price * item.qty).toFixed(2)}</td>
    `;
    invoiceLines.appendChild(tr);
  });
  invoiceId.textContent = `Order: ${order.orderId}`;
  invoiceDate.textContent = `Date: ${dateObj.toLocaleString()}`;
  invoiceTotal.textContent = `$${total.toFixed(2)}`;
  invoiceSection.classList.remove('hidden');
  document.getElementById('checkout-success').textContent = 'Order Placed Successfully';
}

function handleLogin(event) {
  event.preventDefault();
  const id = loginIdInput.value.trim();
  const password = loginPasswordInput.value.trim();
  const users = loadUsers();
  const found = users.find((u) => u.customerId === id);

  if (!found && !password) {
    loginMessage.textContent = 'ID not valid';
    loginMessage.className = 'message error';
    return;
  }

  if (!found && password) {
    loginMessage.textContent = 'ID/password not valid';
    loginMessage.className = 'message error';
    return;
  }

  if (found && found.password !== password) {
    loginMessage.textContent = 'Password not valid';
    loginMessage.className = 'message error';
    return;
  }

  setCurrentUser(found);
  renderGreeting();
  renderProducts();
  renderProfile();
  renderCart();
  showView('home');
  loginMessage.textContent = '';
  loginMessage.className = 'message';
}

function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const address = document.getElementById('reg-address').value.trim();
  const password = document.getElementById('reg-password').value.trim();

  if (!name || !email || !phone || !address || !password) {
    registerMessage.textContent = 'Please fill all required fields.';
    registerMessage.className = 'message error';
    return;
  }

  const customerId = generateCustomerId();
  const users = loadUsers();
  const newUser = { customerId, name, email, phone, address, password };
  users.push(newUser);
  saveUsers(users);

  registerMessage.textContent = `Registration successful! Your Customer ID is ${customerId}`;
  registerMessage.className = 'message success';
  populateRegistrationTable(newUser);
  loginIdInput.value = customerId;
  loginPasswordInput.value = password;
}

function handleProfileSave(event) {
  event.preventDefault();
  if (!state.currentUser) return;

  const updated = {
    ...state.currentUser,
    name: profileInputs.name.value.trim(),
    email: profileInputs.email.value.trim(),
    phone: profileInputs.phone.value.trim(),
    address: profileInputs.address.value.trim()
  };

  const users = loadUsers();
  const idx = users.findIndex((u) => u.customerId === updated.customerId);
  if (idx >= 0) {
    users[idx] = updated;
    saveUsers(users);
    setCurrentUser(updated);
    renderProfile();
    profileMessage.textContent = 'Profile updated and saved to Registration Table.';
  }
}

function clearMessages() {
  loginMessage.textContent = '';
  cartMessage.textContent = '';
  profileMessage.textContent = '';
}

function bindEvents() {
  navButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const view = e.currentTarget.dataset.view;
      if (view === 'home') {
        renderGreeting();
        renderProducts();
      }
      if (view === 'cart') {
        renderCart();
      }
      if (view === 'profile') {
        renderProfile();
      }
      clearMessages();
      showView(view);
    });
  });

  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);
  checkoutBtn.addEventListener('click', handleCheckout);

  showRegisterBtn.addEventListener('click', () => {
    clearMessages();
    showView('register');
  });

  backToLoginBtn.addEventListener('click', () => {
    clearMessages();
    showView('login');
  });

  productsGrid.addEventListener('click', (e) => {
    const addId = e.target.dataset.add;
    if (addId) addToCart(addId);
  });

  cartItemsEl.addEventListener('click', (e) => {
    const removeId = e.target.dataset.remove;
    if (removeId) removeFromCart(removeId);
  });

  editProfileBtn.addEventListener('click', () => toggleProfileEditing(true));
  profileForm.addEventListener('submit', (e) => {
    handleProfileSave(e);
    toggleProfileEditing(false);
  });

  logoutBtn.addEventListener('click', () => {
    setCurrentUser(null);
    showView('login');
    clearMessages();
  });
}

function init() {
  bindEvents();
  renderProducts();
  if (!hydrateSession()) {
    showView('login');
  }
}

init();
