import React from "react";
import { formatRupiah } from "../utils/rupiah";

const PaymentSection = ({
    discount, 
    onDiscountChange, 
    subTotal,
    paymentMethod,
    onPaymentMethodChange,
    cash,
    onCashChange,
    change,
    onProcessPayment
}) => {
    return (
        <div className="card shadow-lg">
            <div className="card-body">
                {/* berorientasi ke samping, spasinya 4 */}
                <div className="row g-4">
                    {/* kolom kiri */}
                    <div className="col-md-6">
                        {/* field diskon */}
                        <div className="mb-3">
                            <h5>Discount</h5>
                            <div className="input-group">
                                <span className="input-group-text">Rp</span>
                                <input type="number"
                                className="form-control p-3"
                                placeholder="q"
                                value={discount ? parseFloat(discount) : ""}
                                onChange={onDiscountChange}
                                />
                            </div>
                        </div>
                        {/* Payment Method */}
                        <div className="mb-3">
                            <h5>Payment Method</h5>
                            <div className="d-flex">
                                <div className="form-check me-3">
                                    <input type="radio"
                                    className="form-check-input"
                                    name="paymentMethod"
                                    id="paymentMethodCash"
                                    value="cash"
                                    checked={paymentMethod === "cash"}
                                    onChange={onPaymentMethodChange}
                                    />
                                    <label className="form-check-label"
                                    htmlFor="paymentMethodCash"
                                    > Cash</label>
                                </div>
                                <div className="form-check">
                                    <input type="radio"
                                    className="form-check-input"
                                    name="paymentMethod"
                                    id="paymentMethodOnline"
                                    value="online"
                                    checked={paymentMethod === "online"}
                                    onChange={onPaymentMethodChange}
                                    />
                                    <label className="form-check-label"
                                    htmlFor="paymentMethodOnline"
                                    >
                                        Online
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Cash Input */}
                        {paymentMethod === "cash" && (
                            <div className="mb-3">
                                <h5>Cash</h5>
                                <div className="input-group">
                                    <span className="input-group-text">Rp</span>
                                    <input type="number"
                                    className="form-control p-2"
                                    placeholder="0"
                                    value={cash ? parseFloat(cash) : ""}
                                    onChange={onCashChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Kolom Kanan */}
                    <div className="col-md-6">
                        {/* Grand TOtal */}
                        <div className="p-4 bg-light rounded-3 mb-4">
                            <h4 className="mb-2">Grand Total (Setelah diskon) </h4>
                            <h2 className="mb-0 fs-1 text-primary">
                                {formatRupiah(subTotal - discount)}
                            </h2>
                        </div>
                        {/* Field change (uang kembalian) */}
                        {paymentMethod === "cash" && (
                            <div className="p-4 bg-primary bg-opacity-10 rounded-3 mb-4">
                                <h4 className="mb-2">Change (Uang Kembalian)</h4>
                                <h2 className="mb-0 fs-1 text-primary">
                                    {formatRupiah(change)}
                                </h2>
                            </div>
                        )}

                        {/* Process Payment Button */}
                        <div className="d-grid gap-2">
                            <button
                            className="btn btn-success btn-md py-3"
                            onClick={onProcessPayment}
                            >
                                <i className="bi bi-bi-cash-stack me-2"></i> Process Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// agar bisa diakses dari file lain
export default PaymentSection;