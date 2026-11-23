console.log('Файл main.js подключён');

const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');

orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!orderDialog || !selectedProductInput) return;
    const productName = button.dataset.product;
    selectedProductInput.value = productName;
    orderDialog.showModal();
  });
});

if (closeDialogButton && orderDialog) {
  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });
}

const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formElements = Array.from(orderForm.elements);
    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });
    if (!orderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });
      orderForm.reportValidity();
      return;
    }
    if (successMessage) {
      successMessage.hidden = false;
    }
    orderForm.reset();
    if (orderDialog) {
      orderDialog.close();
    }
  });
}

const messageElement = document.querySelector('.js-message');
const productOutputElement = document.querySelector('.product-output');

if (messageElement) {
  messageElement.textContent = 'Массив товаров и функции обработки данных подключены.';
}

if (productOutputElement) {
  productOutputElement.textContent = [
    `Всего товаров: ${products.length}`,
    `Товаров в наличии: ${countAvailableProducts(products)}`,
    `Средняя цена: ${calculateAveragePrice(products)} руб.`,
    `Результатов поиска "ardor": ${searchProducts(products, 'ardor').length}`
  ].join('\n');
}