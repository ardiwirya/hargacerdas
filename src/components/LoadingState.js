export function renderLoadingState() {
  const el = document.createElement('div');
  el.className = 'loading-state';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.innerHTML = `
    <div class="loading-state__spinner" aria-hidden="true"></div>
    <p class="loading-state__text">AI sedang menghitung harga terbaik untuk produkmu…</p>
  `;
  return el;
}
