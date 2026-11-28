const productsContainer = document.querySelector('[data-products-container]');
const searchInput = document.querySelector('#catalog-search');
const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#sort-select');
const catalogCount = document.querySelector('.catalog-count');
const catalogEmpty = document.querySelector('.catalog-empty');



if (!productsContainer) {
  console.warn('Контейнер товаров не найден. Проверьте data-products-container.');
}

const catalogState = {
  query: '',
  category: 'all',
  sort: 'default'
};

function getProductTitles(products) {
  return products.map((product) => product.title);
}

function getAvailableProducts(products) {
  return products.filter((product) => product.isAvailable);
}

function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === '') {
    return products;
  }
  return products.filter((product) => {
    return product.title.toLowerCase().includes(normalizedQuery);
  });
}

function filterProductsByCategory(products, category) {
  if (category === 'all') {
    return products;
  }
  return products.filter((product) => {
    return product.category === category;
  });
}

function sortProductsByPrice(products, direction = 'asc') {
  const productsCopy = [...products];
  if (direction === 'desc') {
    return productsCopy.sort((a, b) => b.price - a.price);
  }
  return productsCopy.sort((a, b) => a.price - b.price);
}

function findProductById(products, id) {
  return products.find((product) => product.id === id);
}

function calculateTotalPrice(products) {
  return products.reduce((sum, product) => sum + product.price, 0);
}

function countAvailableProducts(products) {
  return products.filter((product) => product.isAvailable).length;
}

function calculateAveragePrice(products) {
  if (products.length === 0) {
    return 0;
  }
  const totalPrice = calculateTotalPrice(products);
  return Math.round(totalPrice / products.length);
}

function calculateDiscount(price, discountPercent) {
  return price * discountPercent / 100;
}

function calculateFinalPrice(price, discountPercent) {
  const discountValue = calculateDiscount(price, discountPercent);
  return price - discountValue;
}

function sortProducts(products, sortType) {
  const productsCopy = [...products];
  if (sortType === 'price-asc') {
    return productsCopy.sort((a, b) => a.price - b.price);
  }
  if (sortType === 'price-desc') {
    return productsCopy.sort((a, b) => b.price - a.price);
  }
  if (sortType === 'title-asc') {
    return productsCopy.sort((a, b) => a.title.localeCompare(b.title));
  }
  return productsCopy;
}

function getPreparedProducts(products, state) {
  let result = [...products];
  result = searchProducts(result, state.query);
  result = filterProductsByCategory(result, state.category);
  result = sortProducts(result, state.sort);
  return result;
}

function formatPrice(price) {
  return `${price.toLocaleString('ru-RU')} руб.`;
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.classList.add('product-card');

  const imageWrap = document.createElement('div');
  imageWrap.classList.add('product-card__image-wrap');

  const image = document.createElement('img');
  image.classList.add('product-card__image');
  image.src = product.image;
  image.alt = product.title;
  image.loading = 'lazy';
  imageWrap.append(image);

    if (product.discountPercent > 0) {
    card.classList.add('product-card--discount');
  }
  const badgeType = product.discountPercent > 0 ? 'discount' : product.badge;
  if (badgeType) {
    const badgeLabels = { discount: 'Скидка', hit: 'Хит', new: 'Новинка' };
    const badge = document.createElement('span');
    badge.classList.add('product-card__badge', `product-card__badge--${badgeType}`);
    badge.textContent = badgeLabels[badgeType];
    imageWrap.append(badge);
  }

  const title = document.createElement('h3');
  title.classList.add('product-card__title');
  title.textContent = product.title;

  const description = document.createElement('p');
  description.classList.add('product-card__description');
  description.textContent = product.description;

  const price = document.createElement('p');
  price.classList.add('product-card__price');
  if (product.discountPercent > 0) {
    const oldPrice = document.createElement('span');
    oldPrice.classList.add('product-card__price-old');
    oldPrice.textContent = formatPrice(product.price);
    price.append(oldPrice, formatPrice(Math.round(calculateFinalPrice(product.price, product.discountPercent))));
  } else {
    price.textContent = formatPrice(product.price);
  }

  const status = document.createElement('p');
  status.classList.add('product-card__status');
  status.textContent = product.isAvailable ? 'В наличии' : 'Нет в наличии';

    const actions = document.createElement('div');
  actions.classList.add('product-card__actions');

  const cartButton = document.createElement('button');
  cartButton.classList.add('product-card__cart-button');
  cartButton.type = 'button';
  cartButton.textContent = 'В корзину';
  cartButton.dataset.action = 'add-to-cart';
  cartButton.dataset.productId = String(product.id);

  const orderButton = document.createElement('button');
  orderButton.classList.add('button', 'button--primary', 'product-card__button');
  orderButton.type = 'button';
  orderButton.dataset.product = product.title;
  orderButton.dataset.action = 'open-order';
  orderButton.dataset.productId = String(product.id);

  if (product.isAvailable) {
    orderButton.textContent = 'Заказать';
  } else {
    orderButton.textContent = 'Недоступно';
    orderButton.disabled = true;
    cartButton.disabled = true;
  }

  actions.append(cartButton, orderButton);
  card.append(imageWrap, title, description, price, status, actions);
  return card;
}

function renderProducts(productsToRender) {
  productsContainer.textContent = '';
  if (catalogCount) {
    catalogCount.textContent = `Найдено товаров: ${productsToRender.length}`;
  }
  if (catalogEmpty) {
    catalogEmpty.hidden = productsToRender.length > 0;
  }
  productsToRender.forEach((product) => {
    const card = createProductCard(product);
    productsContainer.append(card);
  });
}

function updateCatalog() {
  const preparedProducts = getPreparedProducts(products, catalogState);
  renderProducts(preparedProducts);
}

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    catalogState.query = event.target.value;
    updateCatalog();
  });
}

if (categoryFilter) {
  categoryFilter.addEventListener('change', (event) => {
    catalogState.category = event.target.value;
    updateCatalog();
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', (event) => {
    catalogState.sort = event.target.value;
    updateCatalog();
  });
}

if (productsContainer) {
  updateCatalog();
}

if (productsContainer) {
  productsContainer.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) {
      return;
    }
    const productId = Number(button.dataset.productId);
    const selectedProduct = products.find((product) => product.id === productId);
    if (!selectedProduct) {
      console.warn('Товар не найден:', productId);
      return;
    }
    if (button.dataset.action === 'add-to-cart') {
      addToCart(selectedProduct);
      return;
    }
    if (button.dataset.action === 'open-order') {
      const dialog = document.querySelector('#order-dialog');
      const productInput = document.querySelector('#selected-product');
      if (productInput) {
        productInput.value = selectedProduct.title;
      }
      if (dialog) {
        dialog.showModal();
      }
    }
  });
}