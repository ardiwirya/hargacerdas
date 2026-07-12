import { formatRupiah } from '../utils/margin-calc.js';

/**
 * @param {Array<object>} items
 * @param {(id:string) => void} onDelete
 */
export function renderHistoryList(items, onDelete) {
  const wrapper = document.createElement('div');

  if (!items.length) {
    wrapper.className = 'empty-state';
    wrapper.innerHTML = `
      <p class="empty-state__title">Belum ada riwayat analisis</p>
      <p class="empty-state__text">Hasil analisis yang kamu simpan akan muncul di sini.</p>
      <a href="#/" class="btn btn--primary">Analisis Produk Pertama</a>
    `;
    return wrapper;
  }

  wrapper.className = 'history-list';
  wrapper.setAttribute('role', 'list');

  items.forEach((item) => {
    const card = document.createElement('a');
    card.href = `#/hasil/${item.id}`;
    card.className = 'history-item';
    card.setAttribute('role', 'listitem');
    card.innerHTML = `
      <div class="history-item__main">
        <p class="history-item__name">${escapeHtml(item.produk.nama)}</p>
        <p class="history-item__meta">${escapeHtml(item.produk.kategori)} &middot; ${formatDate(item.createdAt)}</p>
      </div>
      <div class="history-item__price">
        <span class="mono">${formatRupiah(item.hasil.hargaRekomendasi)}</span>
      </div>
      <button type="button" class="icon-btn history-item__delete" aria-label="Hapus ${escapeHtml(item.produk.nama)} dari riwayat">✕</button>
    `;
    card.querySelector('.history-item__delete').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onDelete(item.id, card);
    });
    wrapper.appendChild(card);
  });

  return wrapper;
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function escapeHtml(str = '') {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
