import { renderHistoryList } from '../components/HistoryList.js';
import { getAllAnalisis, deleteAnalisis } from '../services/dbService.js';
import { showToast } from '../components/Toast.js';

export async function renderHistory(root) {
  root.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'page-header';
  header.innerHTML = `
    <h1>Riwayat Analisis</h1>
    <p class="page-header__subtitle">Semua produk yang pernah kamu analisis, tersimpan di perangkat ini.</p>
  `;
  root.appendChild(header);

  const listSlot = document.createElement('div');
  listSlot.id = 'history-list-slot';
  root.appendChild(listSlot);

  const items = await getAllAnalisis();
  renderList(listSlot, items);
}

function renderList(slot, items) {
  slot.innerHTML = '';
  slot.appendChild(
    renderHistoryList(items, async (id, cardEl) => {
      await deleteAnalisis(id);
      cardEl.remove();
      showToast('Riwayat dihapus.', 'info');
      const remaining = await getAllAnalisis();
      if (!remaining.length) renderList(slot, remaining);
    })
  );
}
