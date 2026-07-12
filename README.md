<div align="center">

# 🧾 HargaCerdas

**Jangan Asal Pasang Harga.**

AI Pricing & Margin Advisor untuk pelaku UMKM Indonesia — dibangun untuk **IDCamp Developer Challenge #2: Digitalization & Acceleration of MSMEs with Generative AI**.

[Live Demo](#) · [Laporkan Bug](../../issues) · [Project Brief](#project-brief)

</div>

---

## 📌 Latar Belakang

64 juta pelaku UMKM menyumbang 60% PDB Indonesia, tapi sebagian besar masih menentukan harga jual secara asal — ikut-ikutan kompetitor atau sekadar tebak-tebak, tanpa mempertimbangkan margin keuntungan yang sehat. Akibatnya: profit tipis, atau kalah bersaing tanpa tahu sebabnya.

**HargaCerdas** menyelesaikan masalah ini dengan AI generatif: masukkan nama produk, kategori, dan harga pokok produksi (HPP), AI akan menghasilkan rentang harga pasar yang wajar, rekomendasi harga jual, breakdown margin di beberapa skenario, serta strategi positioning — dalam hitungan detik, dan sepenuhnya gratis.

## ✨ Fitur

- **Analisis harga berbasis AI** — Generative AI (Gemini) menganalisis kategori, HPP, dan deskripsi produk untuk merekomendasikan harga jual dengan justifikasi berbahasa natural.
- **Breakdown margin otomatis** — 3 skenario harga (Ekonomis / Kompetitif / Premium) dihitung otomatis dari HPP.
- **Riwayat analisis** — tersimpan lokal di perangkat (IndexedDB), bisa dibuka & dihapus kapan saja.
- **Tanpa server, tanpa biaya tersembunyi** — HargaCerdas adalah static site murni; kamu memakai API key Gemini gratis milikmu sendiri, tersimpan hanya di browser kamu.
- **PWA** — bisa di-install ke home screen, shell tetap tampil saat offline.
- **Aksesibel** — navigasi keyboard penuh, focus ring terlihat, label ARIA, kontras warna sesuai WCAG AA.
- **Mobile-first & ringan** — bundle JS ~7 KB gzip, tanpa framework berat.

## 🖼️ Screenshot

> Simpan tangkapan layar berikut di folder `docs/screenshots/` sebelum submit:
> 1. `home-empty.png` — halaman utama (form kosong), mobile
> 2. `home-result.png` — hasil analisis (struk) tampil, mobile
> 3. `history.png` — halaman riwayat, mobile
> 4. `desktop-home.png` — halaman utama, desktop

## 🛠️ Tech Stack

| Layer | Teknologi | Alasan |
|---|---|---|
| Build tool | [Vite](https://vitejs.dev) | Dev server cepat, output production kecil, native ES Modules |
| UI | HTML + CSS murni + Vanilla JS (ES Modules) | Tidak overkill untuk scope MVP, performa maksimal, mudah diaudit |
| AI | [Google Gemini API](https://ai.google.dev) (`gemini-2.0-flash`) | Free tier memadai untuk demo, mendukung structured JSON output |
| Storage | IndexedDB (native) | Riwayat analisis persisten di perangkat, tanpa backend |
| PWA | `vite-plugin-pwa` | Installable, offline shell |
| Deployment | Netlify / Vercel | Static hosting gratis, auto-deploy dari GitHub |

## 📂 Struktur Proyek

```
hargacerdas/
├── public/                 # favicon, ikon PWA, robots.txt
├── src/
│   ├── components/         # UI components (form, result card, toast, dll.)
│   ├── services/           # aiService (Gemini) & dbService (IndexedDB)
│   ├── utils/               # pure functions: margin-calc, validators, formatters
│   ├── router/              # hash-based router ringan
│   ├── styles/               # design tokens + base + layout + components
│   ├── pages/                # Home, History, ResultDetail
│   ├── app.js                # app shell & route registration
│   └── main.js                # entry point
├── index.html
├── vite.config.js
└── package.json
```

## 🚀 Menjalankan Secara Lokal

```bash
git clone https://github.com/ardiwirya/hargacerdas.git
cd hargacerdas
npm install
npm run dev
```

Buka `http://localhost:5173`. Kamu memerlukan **API key Gemini gratis** — dapatkan di [aistudio.google.com/apikey](https://aistudio.google.com/apikey), lalu masukkan di panel "Pengaturan API Key AI" pada form (tersimpan hanya di localStorage browser kamu).

```bash
npm run build     # build production ke folder dist/
npm run preview   # preview hasil build
```

## ☁️ Panduan Deploy (Netlify / Vercel)

**Netlify:**
1. Push repo ini ke GitHub.
2. Di Netlify → *Add new site* → *Import from Git* → pilih repo ini.
3. Build command: `npm run build`, Publish directory: `dist`.
4. Deploy.

**Vercel:**
1. Push repo ini ke GitHub.
2. Di Vercel → *New Project* → import repo.
3. Framework preset: *Vite* (auto-terdeteksi). Deploy.

> Tidak perlu environment variable apa pun — API key Gemini diinput langsung oleh pengguna di browser.

## 🧪 Testing Checklist

- [ ] Form menolak submit jika nama produk < 3 karakter
- [ ] Form menolak submit jika HPP ≤ 0
- [ ] Form menolak submit jika API key kosong/tidak valid
- [ ] Analisis berhasil menampilkan struk hasil dengan data yang sesuai skema
- [ ] Simpan ke riwayat → data muncul di halaman Riwayat
- [ ] Hapus riwayat → item hilang dari daftar & IndexedDB
- [ ] Navigasi keyboard: Tab dapat mencapai semua elemen interaktif, focus ring terlihat
- [ ] Responsive: form & struk tetap terbaca di layar 360px
- [ ] PWA: `manifest.webmanifest` & service worker ter-generate saat build

## 📄 Project Brief

Lihat dokumen Project Brief lengkap (masalah, solusi, target pengguna, tech stack, dampak) di: `docs/Project-Brief-HargaCerdas.pdf` — link Google Docs dapat dibagikan terpisah saat submission.

## 🤝 Kontribusi

Proyek ini dibuat untuk kompetisi individu, namun saran & laporan bug tetap terbuka lewat [Issues](../../issues).

## 📜 Lisensi

[MIT License](LICENSE) © 2026 Ardi Wirya Indarto

---

<div align="center">
Dibuat dengan ❤️ untuk pelaku UMKM Indonesia — IDCamp Developer Challenge #2
</div>
