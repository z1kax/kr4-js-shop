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
    themeToggle.textContent = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
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