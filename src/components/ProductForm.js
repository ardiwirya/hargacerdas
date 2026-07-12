import { validateProductForm, validateApiKey } from '../utils/validators.js';
import { getStoredApiKey, storeApiKey } from '../services/aiService.js';

const KATEGORI_OPTIONS = [
  'Makanan & Minuman',
  'Fashion & Aksesoris',
  'Kerajinan Tangan',
  'Kecantikan & Perawatan',
  'Rumah Tangga',
  'Jasa',
  'Lainnya',
];

/**
 * @param {(data: object) => void} onSubmit
 */
export function renderProductForm(onSubmit) {
  const wrapper = document.createElement('section');
  wrapper.className = 'card form-card';
  wrapper.setAttribute('aria-labelledby', 'form-title');

  const savedKey = getStoredApiKey();

  wrapper.innerHTML = `
    <h2 id="form-title" class="form-card__title">Analisis Harga Produkmu</h2>
    <p class="form-card__subtitle">Isi detail produk, AI akan menghitung rentang harga wajar &amp; margin keuntungan.</p>

    <form novalidate id="product-form">
      <div class="field">
        <label for="nama">Nama produk</label>
        <input type="text" id="nama" name="nama" placeholder="Contoh: Keripik Singkong Balado 200g" autocomplete="off" required />
        <p class="field__error" id="nama-error" role="alert"></p>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="kategori">Kategori</label>
          <select id="kategori" name="kategori" required>
            <option value="" disabled selected>Pilih kategori</option>
            ${KATEGORI_OPTIONS.map((k) => `<option value="${k}">${k}</option>`).join('')}
          </select>
          <p class="field__error" id="kategori-error" role="alert"></p>
        </div>

        <div class="field">
          <label for="hpp">Harga Pokok Produksi (HPP)</label>
          <div class="input-prefix">
            <span aria-hidden="true">Rp</span>
            <input type="number" id="hpp" name="hpp" placeholder="15000" min="0" step="100" inputmode="numeric" required />
          </div>
          <p class="field__error" id="hpp-error" role="alert"></p>
        </div>
      </div>

      <div class="field">
        <label for="deskripsi">Deskripsi singkat <span class="field__optional">(opsional)</span></label>
        <textarea id="deskripsi" name="deskripsi" rows="2" maxlength="300" placeholder="Bahan utama, keunikan, target pembeli, dll."></textarea>
        <p class="field__error" id="deskripsi-error" role="alert"></p>
      </div>

      <details class="api-key-panel" ${savedKey ? '' : 'open'}>
        <summary>Pengaturan API Key AI ${savedKey ? '✅' : ''}</summary>
        <p class="api-key-panel__hint">
          HargaCerdas berjalan tanpa server — kamu perlu API key Gemini gratis milikmu sendiri, tersimpan hanya di perangkatmu.
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Dapatkan API key gratis di sini ↗</a>
        </p>
        <div class="field">
          <label for="apiKey">Gemini API Key</label>
          <input type="password" id="apiKey" name="apiKey" placeholder="AIza..." value="${savedKey}" autocomplete="off" />
          <p class="field__error" id="apiKey-error" role="alert"></p>
        </div>
      </details>

      <button type="submit" class="btn btn--primary btn--block">
        <span>Analisis Sekarang</span>
      </button>
    </form>
  `;

  const form = wrapper.querySelector('#product-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = {
      nama: fd.get('nama')?.trim(),
      kategori: fd.get('kategori'),
      hpp: Number(fd.get('hpp')),
      deskripsi: fd.get('deskripsi')?.trim(),
    };
    const apiKey = fd.get('apiKey')?.trim();

    clearErrors(wrapper);
    const { isValid, errors } = validateProductForm(data);
    let apiKeyValid = validateApiKey(apiKey);

    if (!apiKeyValid) {
      showError(wrapper, 'apiKey', 'Masukkan API key Gemini yang valid.');
    }
    if (!isValid) {
      Object.entries(errors).forEach(([field, msg]) => showError(wrapper, field, msg));
    }
    if (!isValid || !apiKeyValid) return;

    storeApiKey(apiKey);
    onSubmit(data, apiKey);
  });

  return wrapper;
}

function showError(wrapper, field, message) {
  const el = wrapper.querySelector(`#${field}-error`);
  const input = wrapper.querySelector(`#${field}`);
  if (el) el.textContent = message;
  if (input) input.setAttribute('aria-invalid', 'true');
}

function clearErrors(wrapper) {
  wrapper.querySelectorAll('.field__error').forEach((el) => (el.textContent = ''));
  wrapper.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
}
