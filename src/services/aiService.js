/**
 * aiService — thin wrapper around Google Gemini's generateContent REST API.
 * MVP is intentionally backend-less: the user supplies their own free
 * Gemini API key (aistudio.google.com/apikey), stored only in localStorage
 * on their device. This keeps the app a static site (Netlify/Vercel-ready)
 * while still calling a *real* generative AI model — no mocked responses.
 *
 * Auth: as of mid-2026 Google issues "Auth keys" (AQ. prefix) alongside the
 * legacy "Standard keys" (AIza prefix). Auth keys are unreliable when passed
 * as a `?key=` query param, so we send the key via the `x-goog-api-key`
 * header instead — this is also Google's current documented method and
 * works for both key formats.
 *
 * Model fallback chain: gemini-2.5-flash has better reasoning quality but a
 * small free-tier daily quota (~20-25 req/day). If that's exhausted, we
 * automatically retry with gemini-2.5-flash-lite, which has a much larger
 * free quota (~1000 req/day) — keeps the demo resilient during judging.
 */
const MODELS = ['gemini-3.5-flash', 'gemini-3.1-flash-lite'];
const ENDPOINT_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    rentangHargaMin: { type: 'NUMBER' },
    rentangHargaMax: { type: 'NUMBER' },
    hargaRekomendasi: { type: 'NUMBER' },
    justifikasi: { type: 'STRING' },
    strategiPositioning: { type: 'STRING' },
    risiko: { type: 'STRING' },
    tips: {
      type: 'ARRAY',
      items: { type: 'STRING' },
    },
  },
  required: [
    'rentangHargaMin',
    'rentangHargaMax',
    'hargaRekomendasi',
    'justifikasi',
    'strategiPositioning',
    'risiko',
    'tips',
  ],
};

function buildPrompt({ nama, kategori, hpp, deskripsi }) {
  return `Kamu adalah konsultan bisnis UMKM Indonesia yang ahli strategi harga jual.
Analisis produk berikut dan berikan rekomendasi harga jual yang realistis untuk pasar Indonesia.

Nama produk: ${nama}
Kategori: ${kategori}
Harga Pokok Produksi (HPP): Rp${hpp}
Deskripsi tambahan: ${deskripsi || '-'}

Berikan analisis dalam Bahasa Indonesia yang mudah dipahami pelaku UMKM awam (hindari jargon).
Pertimbangkan harga pasar wajar untuk kategori sejenis di Indonesia, margin keuntungan yang sehat (idealnya 25-45%), dan daya beli target pasar.
justifikasi maksimal 3 kalimat. strategiPositioning maksimal 2 kalimat. risiko maksimal 2 kalimat. tips berisi 3 butir singkat dan actionable.`;
}

async function callModel(model, produk, apiKey) {
  const body = {
    contents: [{ parts: [{ text: buildPrompt(produk) }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.4,
    },
  };

  let res;
  try {
    res = await fetch(`${ENDPOINT_BASE}/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });
  } catch {
    const err = new Error('Tidak bisa terhubung ke server AI. Periksa koneksi internet kamu.');
    err.code = 'NETWORK_ERROR';
    throw err;
  }

  if (res.status === 400 || res.status === 401 || res.status === 403) {
    const err = new Error('API key tidak valid atau ditolak. Periksa kembali API key kamu di Google AI Studio.');
    err.code = 'INVALID_KEY';
    throw err;
  }
  if (res.status === 404) {
    const err = new Error(`Model ${model} sudah tidak tersedia di API Google.`);
    err.code = "MODEL_UNAVAILABLE";
    throw err;
  }
  if (res.status === 429) {
    const err = new Error(`Kuota gratis model ${model} tercapai.`);
    err.code = 'RATE_LIMIT';
    throw err;
  }
  if (!res.ok) {
    const err = new Error('Terjadi kesalahan pada server AI. Coba lagi nanti.');
    err.code = 'SERVER_ERROR';
    throw err;
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    const err = new Error('Respons AI kosong atau tidak dikenali.');
    err.code = 'EMPTY_RESPONSE';
    throw err;
  }

  try {
    return JSON.parse(text);
  } catch {
    const err = new Error('Gagal membaca hasil analisis AI.');
    err.code = 'PARSE_ERROR';
    throw err;
  }
}

/**
 * @param {{nama:string, kategori:string, hpp:number, deskripsi?:string}} produk
 * @param {string} apiKey
 * @returns {Promise<object>} structured pricing analysis
 */
export async function analisisHarga(produk, apiKey) {
  if (!apiKey) {
    const err = new Error('API key belum diatur.');
    err.code = 'NO_API_KEY';
    throw err;
  }

  let lastErr;
  for (const model of MODELS) {
    try {
      return await callModel(model, produk, apiKey);
    } catch (err) {
      lastErr = err;
      // Only fall through to the next model on a quota error — any other
      // error (invalid key, network, parse) applies to all models equally.
      if (err.code !== 'RATE_LIMIT') throw err;
    }
  }

  lastErr.message = 'Batas pemakaian API gratis tercapai untuk semua model. Coba lagi beberapa saat lagi, atau aktifkan billing di Google AI Studio untuk kuota lebih besar.';
  throw lastErr;
}

export function getStoredApiKey() {
  return localStorage.getItem('hargacerdas:apiKey') || '';
}

export function storeApiKey(key) {
  localStorage.setItem('hargacerdas:apiKey', key.trim());
}