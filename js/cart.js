const CART_STORAGE_KEY = 'keystore-cart';

function restoreCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw === null) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item) => {
      return (
        typeof item.id === 'number' &&
        typeof item.title === 'string' &&
        typeof item.price === 'number' &&
        typeof item.quantity === 'number'
      );
    });
  } catch (error) {
    console.warn('Не удалось прочитать корзину:', error);
    return [];
  }
}

let cartItems = restoreCart();

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

function getCartCount() {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

function calculateCartTotal() {
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCartCounter() {
  const counters = document.querySelectorAll('.cart-counter');
  counters.forEach((counter) => {
    counter.textContent = `В корзине: ${getCartCount()}`;
  });
}

function addToCart(product) {
  const existing = cartItems.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartItems.push({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1
    });
  }
  saveCart();
  updateCartCounter();
  renderCart();
}

function removeFromCart(productId) {
  cartItems = cartItems.filter((item) => item.id !== productId);
  saveCart();
  updateCartCounter();
  renderCart();
}

function clearCart() {
  cartItems = [];
  saveCart();
  updateCartCounter();
  renderCart();
}

function renderCart() {
  const cartContainer = document.querySelector('[data-cart-container]');
  if (!cartContainer) {
    return;
  }
  const cartTotal = document.querySelector('[data-cart-total]');
  const cartEmpty = document.querySelector('.cart-empty');
  cartContainer.textContent = '';
  if (cartEmpty) {
    cartEmpty.hidden = cartItems.length > 0;
  }
  cartItems.forEach((item) => {
    const line = document.createElement('article');
    line.classList.add('cart-item');

    const title = document.createElement('h3');
    title.classList.add('cart-item__title');
    title.textContent = item.title;

    const details = document.createElement('p');
    details.classList.add('cart-item__details');
    details.textContent = `${formatPrice(item.price)} × ${item.quantity}`;

    const removeButton = document.createElement('button');
    removeButton.classList.add('cart-item__remove');
    removeButton.type = 'button';
    removeButton.textContent = 'Удалить';
    removeButton.dataset.action = 'remove-from-cart';
    removeButton.dataset.productId = String(item.id);

    line.append(title, details, removeButton);
    cartContainer.append(line);
  });
  if (cartTotal) {
    cartTotal.textContent = `Итого: ${formatPrice(calculateCartTotal())}`;
  }
}

const cartClearButton = document.querySelector('[data-cart-clear]');
if (cartClearButton) {
  cartClearButton.addEventListener('click', () => {
    clearCart();
  });
}

const cartContainerElement = document.querySelector('[data-cart-container]');
if (cartContainerElement) {
  cartContainerElement.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="remove-from-cart"]');
    if (!button) {
      return;
    }
    removeFromCart(Number(button.dataset.productId));
  });
}

updateCartCounter();
renderCart();