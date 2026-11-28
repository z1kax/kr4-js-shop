const THEME_STORAGE_KEY = 'keystore-theme';
const themeToggle = document.querySelector('[data-theme-toggle]');

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'dark' ? 'dark' : 'light';
  } catch (error) {
    console.warn('Не удалось прочитать тему:', error);
    return 'light';
  }
}

function applyTheme(theme) {
  document.body.classList.toggle('theme-dark', theme === 'dark');
  if (themeToggle) {
    const icon = themeToggle.querySelector('.theme-toggle__icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    themeToggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'
    );
  }
}

let currentTheme = getStoredTheme();
applyTheme(currentTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    applyTheme(currentTheme);
  });
}