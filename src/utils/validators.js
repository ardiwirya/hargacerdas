export function validateProductForm(data) {
  const errors = {};

  if (!data.nama || data.nama.trim().length < 3) {
    errors.nama = 'Nama produk minimal 3 karakter.';
  }
  if (!data.kategori) {
    errors.kategori = 'Pilih kategori produk.';
  }
  if (!data.hpp || Number(data.hpp) <= 0) {
    errors.hpp = 'Harga pokok produksi (HPP) harus lebih dari 0.';
  }
  if (data.deskripsi && data.deskripsi.length > 300) {
    errors.deskripsi = 'Deskripsi maksimal 300 karakter.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateApiKey(key) {
  return typeof key === 'string' && key.trim().length > 10;
}
