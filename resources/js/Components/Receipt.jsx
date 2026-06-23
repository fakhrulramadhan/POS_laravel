import React from "react";
import { formatRupiah } from "../utils/rupiah";

const Receipt = React.forwardRef(
    ({ cartItems, subTotal, discount = 0, totalAmount, cash, change}, ref) => {
        return (
            <div ref={ref} className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
                <div className="bg-white border rounded shadow p-4 small" style={{ maxWidth: "350px" }}>
                    {/* Header Struk */}
                    <div className="text-center mb-3">
                        <h3 className="mb-1 fw-bold">AkuPos</h3>
                        <p className="mb-1">Jl. Raya No. 133, Sleman, Yogyakarta</p>
                        <p className="mb-1">Tel: (021) 12345678</p>
                        {/* garis pembatas */}
                        <div className="border-bottom border-dark mb-2">
                            <small>Tanggal: {new Date().toLocaleDateString()}</small>
                        </div>
                    </div>

                    {/* tabel item pembelian */}
                    <table className="table table-borderless mb-3">
                        <thead>
                            <tr className="border-bottom border-secondary">
                                <th className="pb-2 text-start">Item</th>
                                <th className="pb-2 text-end">Harga</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-2">
                                        <div className="fw-semibold">
                                            {item.name || "Produk Tidak ditemukan"}
                                        </div>
                                        <div>
                                            {item.quantity} x {formatRupiah(item.selling_price)}
                                        </div>
                                    </td>
                                    <td className="py-2 text-end">
                                        {formatRupiah(item.total_price)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Informasi Pembayaram */}
                    <div className="border-top border-dark pt-2">
                        {/* orientasinya kebawah */}
                        {/* Subtotal */}
                        <div className="d-flex justify-content-between mb-1">
                            <span className="fw-semibold">Subtotal</span>
                            <span className="fw-semibold">{formatRupiah(subTotal)}</span>
                        </div>
                        {/* Diskon (jika ada) */}
                        {discount > 0 && (
                            <div className="d-flex justify-content-between mb-1">
                                <span>Discount</span>
                                <span className="text-danger">{formatRupiah(discount)}</span>
                            </div>
                        )}

                        {/* Total setelah diskon */}
                        {discount > 0 ? (
                            <div className="d-flex justify-content-between mb-1">
                                <span className="fw-bold">Total:</span>
                                <span className="fw-bold">{formatRupiah(totalAmount)}</span>
                            </div>
                        )
                        :
                        (
                            <div className="d-flex justify-content-between mb-1">
                                <span className="fw-bold">Total</span>
                                <span className="fw-bold">{formatRupiah(subTotal)}</span>
                            </div>
                        )    
                    }
                    {/* Cash yang dibayarkan */}
                    <div className="d-flex justify-content-between mb-1">
                        <span>Cash</span>
                        <span>{formatRupiah(cash)}</span>
                    </div>

                    {/* Kembalian */}
                    <div className="d-flex justify-content-between">
                        <span>Change</span>
                        <span>{formatRupiah(change)}</span>
                    </div>
                    </div>

                    {/* Footer Struk */}
                    <div className="text-center border-top border-dark mt-3 pt-2">
                        <p className="mb-1">*** Terima Kasih ***</p>
                        <small>Barang yang sudah dibeli, tidak dapat dikembalikan</small>
                    </div>
                </div>
            </div>
        );
    }
);

// agar bisa diakses dari file lain
export default Receipt;