import { renderResultCard } from '../components/ResultCard.js';
import { getAnalisisById } from '../services/dbService.js';

export async function renderResultDetail(root, { id }) {
  root.innerHTML = '';

  const record = await getAnalisisById(id);

  if (!record) {
    root.innerHTML = `
      <div class="empty-state">
        <p class="empty-state__title">Analisis tidak ditemukan</p>
        <a href="#/riwayat" class="btn btn--primary">Kembali ke Riwayat</a>
      </div>
    `;
    return;
  }

  const backLink = document.createElement('a');
  backLink.href = '#/riwayat';
  backLink.className = 'back-link';
  backLink.textContent = '← Kembali ke Riwayat';
  root.appendChild(backLink);

  root.appendChild(renderResultCard(record.produk, record.hasil, { showSave: false }));
}
