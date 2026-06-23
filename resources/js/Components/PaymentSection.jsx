import React from "react";
import { formatRupiah } from "../utils/rupiah";

const PaymentSection = ({
    discount, onDiscountChange, subTotal, paymentMethod, onPaymentMethodChange,
    cash, onCashChange, change, onProcessPayment
}) => {
    return (
        <div className="payment-panel mt-3">
            <div className="payment-header">
                <h6><i className="bi bi-credit-card me-2"></i>Pembayaran</h6>
            </div>
            <div className="payment-body">
                <div className="grand-total-box">
                    <small>Total Pembayaran</small>
                    <h2>{formatRupiah(subTotal - (parseFloat(discount) || 0))}</h2>
                </div>

                <div className="form-group-custom">
                    <label>Metode Pembayaran</label>
                    <div className="d-flex gap-3">
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="paymentMethod" id="payCash" value="cash"
                                checked={paymentMethod === "cash"} onChange={onPaymentMethodChange} />
                            <label className="form-check-label" htmlFor="payCash">Tunai</label>
                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="paymentMethod" id="payOnline" value="online"
                                checked={paymentMethod === "online"} onChange={onPaymentMethodChange} />
                            <label className="form-check-label" htmlFor="payOnline">Online</label>
                        </div>
                    </div>
                </div>

                <div className="form-group-custom">
                    <label>Diskon</label>
                    <div className="input-affix">
                        <span className="prefix">Rp</span>
                        <input type="number" placeholder="0" value={discount ? parseFloat(discount) : ""} onChange={onDiscountChange} />
                    </div>
                </div>

                {paymentMethod === "cash" && (
                    <div className="form-group-custom">
                        <label>Jumlah Tunai</label>
                        <div className="input-affix">
                            <span className="prefix">Rp</span>
                            <input type="number" placeholder="0" value={cash ? parseFloat(cash) : ""} onChange={onCashChange} />
                        </div>
                    </div>
                )}

                {paymentMethod === "cash" && change > 0 && (
                    <div className="change-box">
                        <small>Kembalian</small>
                        <h4>{formatRupiah(change)}</h4>
                    </div>
                )}

                <button className="payment-btn btn btn-success" onClick={onProcessPayment}>
                    <i className="bi bi-check-lg me-2"></i>Proses Pembayaran
                </button>
            </div>
        </div>
    );
};

export default PaymentSection;

