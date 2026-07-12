import { renderProductForm } from '../components/ProductForm.js';
import { renderResultCard } from '../components/ResultCard.js';
import { renderLoadingState } from '../components/LoadingState.js';
import { analisisHarga } from '../services/aiService.js';
import { saveAnalisis } from '../services/dbService.js';
import { showToast } from '../components/Toast.js';

export function renderHome(root) {
  root.innerHTML = '';

  const hero = document.createElement('section');
  hero.className = 'hero';
  hero.innerHTML = `
    <p class="hero__eyebrow">HargaCerdas &middot; AI Pricing Advisor</p>
    <h1 class="hero__title">Jangan Asal Pasang Harga.</h1>
    <p class="hero__subtitle">Masukkan detail produkmu, AI menghitung rentang harga wajar, margin keuntungan, dan strategi jual dalam hitungan detik.</p>
  `;
  root.appendChild(hero);

  const resultSlot = document.createElement('div');
  resultSlot.id = 'result-slot';
  resultSlot.className = 'result-slot';

  const form = renderProductForm(async (produk, apiKey) => {
    resultSlot.innerHTML = '';
    resultSlot.appendChild(renderLoadingState());
    resultSlot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
      const hasil = await analisisHarga(produk, apiKey);
      resultSlot.innerHTML = '';
      const record = {
        id: crypto.randomUUID(),
        produk,
        hasil,
        createdAt: Date.now(),
      };
      const card = renderResultCard(produk, hasil, {
        onSave: async () => {
          await saveAnalisis(record);
          showToast('Analisis disimpan ke riwayat.', 'success');
        },
      });
      resultSlot.appendChild(card);
    } catch (err) {
      resultSlot.innerHTML = '';
      resultSlot.appendChild(renderErrorState(err));
      showToast(err.message || 'Terjadi kesalahan.', 'error');
    }
  });

  root.appendChild(form);
  root.appendChild(resultSlot);
}

function renderErrorState(err) {
  const el = document.createElement('div');
  el.className = 'error-state';
  el.setAttribute('role', 'alert');
  el.innerHTML = `
    <p class="error-state__title">Analisis gagal dijalankan</p>
    <p class="error-state__text">${escapeHtml(err.message || 'Terjadi kesalahan tak terduga.')}</p>
  `;
  return el;
}

function escapeHtml(str = '') {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
