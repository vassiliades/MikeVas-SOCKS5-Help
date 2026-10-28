// Apply the opening app's theme before rendering the guide. Query URLs remain supported.
(() => {
  function applyOpeningTheme() {
  const theme = new URLSearchParams(location.hash.slice(1)).get('theme')
    || new URLSearchParams(location.search).get('theme');
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.dataset.theme = theme;
    return;
  }
  const api = typeof browser !== 'undefined' ? browser : typeof chrome !== 'undefined' && chrome.storage ? chrome : null;
  if (api) api.storage.local.get(['popupTheme']).then(saved => {
    document.documentElement.dataset.theme = saved.popupTheme === 'light' ? 'light' : 'dark';
  }).catch(() => {});
  }
  applyOpeningTheme();
  window.addEventListener('hashchange', applyOpeningTheme);
})();
