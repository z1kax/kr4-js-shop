const orderForm = document.querySelector('.order-form');

if (orderForm) {
  const nameInput = orderForm.querySelector('#order-name');
  const emailInput = orderForm.querySelector('#order-email');
  const phoneInput = orderForm.querySelector('#order-phone');
  const consentInput = orderForm.querySelector('#order-consent');
  const nameError = orderForm.querySelector('#order-name-error');
  const emailError = orderForm.querySelector('#order-email-error');
  const phoneError = orderForm.querySelector('#order-phone-error');
  const consentError = orderForm.querySelector('#order-consent-error');
  const formMessage = orderForm.querySelector('.form-message');
  const submitButton = orderForm.querySelector('button[type="submit"]');

  function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorElement.id);
  }

  function clearError(input, errorElement) {
    errorElement.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  function clearAllErrors() {
    const pairs = [
      [nameInput, nameError],
      [emailInput, emailError],
      [phoneInput, phoneError],
      [consentInput, consentError]
    ];
    pairs.forEach(([input, errorElement]) => {
      if (input && errorElement) {
        clearError(input, errorElement);
      }
    });
  }

  function validateName() {
    const value = nameInput.value.trim();
    if (value.length < 2) {
      showError(nameInput, nameError, 'Введите имя не короче 2 символов.');
      return false;
    }
    clearError(nameInput, nameError);
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      showError(emailInput, emailError, 'Введите корректный e-mail.');
      return false;
    }
    clearError(emailInput, emailError);
    return true;
  }

  function validatePhone() {
    const value = phoneInput.value.trim();
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 11 || !['7', '8'].includes(digits[0])) {
      showError(phoneInput, phoneError, 'Введите корректный номер телефона.');
      return false;
    }
    clearError(phoneInput, phoneError);
    return true;
  }

  function validateConsent() {
    if (!consentInput || !consentError) {
      return true;
    }
    if (!consentInput.checked) {
      showError(consentInput, consentError, 'Подтвердите согласие на обработку данных.');
      return false;
    }
    clearError(consentInput, consentError);
    return true;
  }

  function setSending(isSending) {
    if (!submitButton) {
      return;
    }
    submitButton.disabled = isSending;
    submitButton.textContent = isSending ? 'Отправка...' : 'Отправить заявку';
  }

  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isConsentValid = validateConsent();
    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isConsentValid;
    if (!isFormValid) {
      formMessage.textContent = 'Проверьте поля формы.';
      return;
    }
    const requestData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      consent: consentInput ? consentInput.checked : false
    };
    setSending(true);
    formMessage.textContent = 'Отправляем заявку...';
    setTimeout(() => {
      console.log('Учебная отправка формы; данные не передаются на сервер.');
      console.table(requestData);
      setSending(false);
      formMessage.textContent = 'Заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.';
      orderForm.reset();
      clearAllErrors();
    }, 800);
  });

  nameInput.addEventListener('input', validateName);
  emailInput.addEventListener('input', validateEmail);
  phoneInput.addEventListener('input', validatePhone);
  if (consentInput) {
    consentInput.addEventListener('change', validateConsent);
  }
}