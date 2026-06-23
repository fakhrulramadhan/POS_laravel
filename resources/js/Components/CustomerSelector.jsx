import React from "react";

const CustomerSelector = ({customers, selectedCustomer, onSelectCustomer, cashierName}) => {
    return (
        <div className="customer-selector-bar">
            <div className="cs-left">
                <div className="cs-icon"><i className="bi bi-person-badge"></i></div>
                <div className="cs-info">
                    <small>Kasir</small>
                    <div className="cs-name">{cashierName}</div>
                </div>
            </div>
            <div className="cs-right">
                <select className="form-select"
                    onChange={(e) => onSelectCustomer(e.target.value || null)}
                    value={selectedCustomer || ""}
                >
                    <option value="">Pilih Customer (Opsional)</option>
                    {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default CustomerSelector;

