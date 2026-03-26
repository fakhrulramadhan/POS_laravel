export const formatRupiah = (number) => {
    if (!number || number === 0) return 'Rp';

    // sen ,00 nya dibuang (ganti sama spasi kosong)
    return new Intl.NumberFormat('id-Id', {
        style: 'currency',
        currency: 'IDR',
    }).format(number).replace(/,00$/, '');
};