import { registerRoute, registerNotFound, initRouter } from './router/router.js';
import { renderHome } from './pages/Home.js';
import { renderHistory } from './pages/History.js';
import { renderResultDetail } from './pages/ResultDetail.js';

const BRAND_MARK = `
<svg class="brand__mark" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="3" y="6" width="26" height="20" rx="3" fill="#0F6B5C"/>
  <path d="M8 6 12 2h8l4 4" stroke="#0F6B5C" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="16" cy="16" r="6" fill="#FAF7F0"/>
  <text x="16" y="19.5" font-family="IBM Plex Mono, monospace" font-size="8" font-weight="700" fill="#0F6B5C" text-anchor="middle">Rp</text>
</svg>`;

export function mountApp(appRoot) {
  appRoot.innerHTML = `
    <a href="#main-content" class="skip-link">Langsung ke konten</a>
    <header class="site-header">
      <div class="site-header__inner">
        <a href="#/" class="brand">${BRAND_MARK}<span>HargaCerdas</span></a>
        <nav class="main-nav" aria-label="Navigasi utama">
          <a href="#/" data-nav-link><span>Analisis</span></a>
          <a href="#/riwayat" data-nav-link><span>Riwayat</span></a>
        </nav>
      </div>
    </header>
    <main id="main-content" class="page" tabindex="-1"></main>
    <footer class="site-footer">
      <p>Dibuat untuk IDCamp Developer Challenge #2 &middot; Data tersimpan lokal di perangkatmu, bukan di server.</p>
    </footer>
  `;

  const main = appRoot.querySelector('main');

  registerRoute('/', () => renderHome(main));
  registerRoute('/riwayat', () => renderHistory(main));
  registerRoute('/hasil/:id', (params) => renderResultDetail(main, params));
  registerNotFound(() => {
    main.innerHTML = `
      <div class="empty-state">
        <p class="empty-state__title">404 — Halaman tidak ditemukan</p>
        <a href="#/" class="btn btn--primary">Kembali ke Beranda</a>
      </div>
    `;
  });

  initRouter();
}
