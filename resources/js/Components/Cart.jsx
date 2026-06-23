import React from "react";
import { formatRupiah } from "../utils/rupiah";

const Cart = ({ cartItems, onDelete}) => {
    return (
        <div className="table-responsive">
            <table className="table align-middle mb-0" style={{fontSize:'0.85rem'}}>
                <thead style={{background:'#f8f9fc'}}>
                    <tr>
                        <th style={{width:'40px'}}>#</th>
                        <th>Item</th>
                        <th className="text-end">Qty</th>
                        <th className="text-end">Total</th>
                        <th className="text-center" style={{width:'60px'}}></th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <tr key={item.id}>
                                <td className="text-muted">{index + 1}</td>
                                <td className="fw-semibold">{item.name}</td>
                                <td className="text-end">{item.quantity}</td>
                                <td className="text-end fw-semibold">{formatRupiah(item.total_price)}</td>
                                <td className="text-center">
                                    <button className="btn btn-sm p-1 text-danger border-0 bg-transparent"
                                        onClick={() => onDelete(item.id)}
                                        title="Hapus"
                                    >
                                        <i className="bi bi-x-circle-fill"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5" className="text-center text-muted py-4">
                            <i className="bi bi-cart-x d-block mb-2" style={{fontSize:'1.5rem'}}></i>
                            Keranjang masih kosong
                        </td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Cart;
