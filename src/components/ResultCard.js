import { formatRupiah, generateSkenario, hitungMargin } from '../utils/margin-calc.js';

/**
 * Renders the AI analysis result as a "struk" (receipt) styled card —
 * the app's signature visual element, echoing the physical price tags
 * UMKM owners already know from the market.
 *
 * @param {object} produk - { nama, kategori, hpp, deskripsi }
 * @param {object} hasil - AI analysis result
 * @param {{onSave?: Function, showSave?: boolean}} opts
 */
export function renderResultCard(produk, hasil, opts = {}) {
  const { onSave, showSave = true } = opts;
  const skenario = generateSkenario(produk.hpp);
  const rekomendasiMargin = hitungMargin(produk.hpp, hasil.hargaRekomendasi);

  const el = document.createElement('article');
  el.className = 'receipt';
  el.setAttribute('aria-label', `Hasil analisis harga untuk ${produk.nama}`);

  el.innerHTML = `
    <div class="receipt__edge receipt__edge--top" aria-hidden="true"></div>
    <div class="receipt__body">
      <header class="receipt__header">
        <p class="receipt__eyebrow">Struk Analisis Harga</p>
        <h3 class="receipt__product">${escapeHtml(produk.nama)}</h3>
        <p class="receipt__meta">${escapeHtml(produk.kategori)} &middot; HPP ${formatRupiah(produk.hpp)}</p>
      </header>

      <div class="receipt__divider" aria-hidden="true"></div>

      <div class="receipt__hero">
        <p class="receipt__label">Rekomendasi Harga Jual</p>
        <p class="receipt__price">${formatRupiah(hasil.hargaRekomendasi)}</p>
        <p class="receipt__range">Rentang wajar: ${formatRupiah(hasil.rentangHargaMin)} – ${formatRupiah(hasil.rentangHargaMax)}</p>
        <span class="badge badge--primary">Margin ${rekomendasiMargin.marginPercent}%</span>
      </div>

      <div class="receipt__divider" aria-hidden="true"></div>

      <section aria-labelledby="justifikasi-h-${el.id || ''}">
        <p class="receipt__label">Kenapa harga ini?</p>
        <p class="receipt__text">${escapeHtml(hasil.justifikasi)}</p>
      </section>

      <section>
        <p class="receipt__label">Strategi Positioning</p>
        <p class="receipt__text">${escapeHtml(hasil.strategiPositioning)}</p>
      </section>

      <section>
        <p class="receipt__label">Risiko yang perlu diwaspadai</p>
        <p class="receipt__text">${escapeHtml(hasil.risiko)}</p>
      </section>

      <div class="receipt__divider" aria-hidden="true"></div>

      <section>
        <p class="receipt__label">Skenario Harga Lain</p>
        <table class="scenario-table">
          <thead>
            <tr><th scope="col">Skenario</th><th scope="col">Harga</th><th scope="col">Margin</th></tr>
          </thead>
          <tbody>
            ${skenario
              .map(
                (s) => `
              <tr>
                <td>${s.label}</td>
                <td class="mono">${formatRupiah(s.hargaJual)}</td>
                <td class="mono">${s.marginPercent}%</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </section>

      <div class="receipt__divider" aria-hidden="true"></div>

      <section>
        <p class="receipt__label">Tips Cepat</p>
        <ul class="tips-list">
          ${(hasil.tips || []).map((t) => `<li>${escapeHtml(t)}</li>`).join('')}
        </ul>
      </section>

      ${
        showSave
          ? `<button type="button" class="btn btn--accent btn--block receipt__save">Simpan ke Riwayat</button>`
          : ''
      }
    </div>
    <div class="receipt__edge receipt__edge--bottom" aria-hidden="true"></div>
  `;

  if (showSave) {
    el.querySelector('.receipt__save').addEventListener('click', (e) => {
      e.target.disabled = true;
      e.target.textContent = 'Tersimpan ✓';
      onSave?.();
    });
  }

  return el;
}

function escapeHtml(str = '') {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
