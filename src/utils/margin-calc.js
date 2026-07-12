/**
 * Pure functions for margin & pricing math — no side effects, fully unit-testable.
 */

/**
 * @param {number} hpp - Harga Pokok Produksi (cost price)
 * @param {number} hargaJual - Selling price
 * @returns {{ profit: number, marginPercent: number, markupPercent: number }}
 */
export function hitungMargin(hpp, hargaJual) {
  const profit = hargaJual - hpp;
  const marginPercent = hargaJual > 0 ? (profit / hargaJual) * 100 : 0;
  const markupPercent = hpp > 0 ? (profit / hpp) * 100 : 0;
  return {
    profit: round2(profit),
    marginPercent: round2(marginPercent),
    markupPercent: round2(markupPercent),
  };
}

/**
 * Generate 3 pricing scenarios (hemat/kompetitif/premium) from HPP.
 * @param {number} hpp
 * @returns {Array<{ label: string, hargaJual: number, marginPercent: number }>}
 */
export function generateSkenario(hpp) {
  const multipliers = [
    { label: 'Ekonomis', factor: 1.25 },
    { label: 'Kompetitif', factor: 1.45 },
    { label: 'Premium', factor: 1.8 },
  ];
  return multipliers.map(({ label, factor }) => {
    const hargaJual = Math.round((hpp * factor) / 100) * 100;
    const { marginPercent } = hitungMargin(hpp, hargaJual);
    return { label, hargaJual, marginPercent };
  });
}

export function round2(n) {
  return Math.round(n * 100) / 100;
}

export function formatRupiah(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n || 0);
}
