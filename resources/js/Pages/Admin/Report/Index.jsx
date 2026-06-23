import { Deferred, Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function ReportIndex() {
    const { transactions, start_date = "", end_date = "", errors } = usePage().props;
    const [startDate, setStartDate] = useState(start_date);
    const [endDate, setEndDate] = useState(end_date);
    const handleSubmit = (e) => {
        e.preventDefault();
        router.get("/admin/report/generate", { start_date: startDate, end_date: endDate });
    };
    const getPaymentMethodBadge = (method) => {
        switch (method.toLowerCase()) {
            case "cash": return "bg-success bg-opacity-10 text-success";
            case "online": return "bg-primary bg-opacity-10 text-primary";
            default: return "bg-secondary bg-opacity-10 text-secondary";
        }
    };
    return (
        <>
            <Head><title>Transaction Report - AkuPos</title></Head>
            <AdminLayout>
                <div className="page-header-bar">
                    <div className="header-left">
                        <div className="header-icon"><i className="bi bi-graph-up"></i></div>
                        <div><h5>Laporan Transaksi</h5><p className="header-sub">Generate laporan penjualan</p></div>
                    </div>
                </div>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="table-card">
                            <div className="table-card-header"><h6><i className="bi bi-funnel me-2"></i>Filter</h6></div>
                            <div className="p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Dari Tanggal</label>
                                        <input type="date" id="start_date" value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="form-control" required />
                                        {errors?.start_date && <div className="alert alert-danger mt-2">{errors.start_date}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Sampai Tanggal</label>
                                        <input type="date" id="end_date" value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="form-control" required />
                                        {errors?.end_date && <div className="alert alert-danger mt-2">{errors.end_date}</div>}
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 py-3">
                                        <i className="bi bi-file-earmark-arrow-down me-2"></i>Generate Report
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="table-card">
                            <div className="table-card-header">
                                <h6><i className="bi bi-list-ul me-2"></i>Data Transaksi</h6>
                                <span>{transactions?.length ?? 0} transaksi</span>
                            </div>
                            <div className="table-wrap" style={{maxHeight:'500px', overflowY:'auto'}}>
                                <Deferred data="transactions" fallback={
                                    <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div><p className="mt-2 text-muted">Memuat data...</p></div>
                                }>
                                    {transactions && transactions.length > 0 ? (
                                        <table className="table align-middle">
                                            <thead>
                                                <tr>
                                                    <th>Pelanggan</th>
                                                    <th>Tanggal</th>
                                                    <th>Metode</th>
                                                    <th className="text-end">Total</th>
                                                    <th className="text-center">Status</th>
                                                    <th className="text-end">Qty</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions.map((transaction) => (
                                                    <tr key={transaction.id}>
                                                        <td className="fw-semibold">{transaction.customer?.name || "Guest"}</td>
                                                        <td className="text-muted">{new Date(transaction.transaction_date).toLocaleString('id-ID')}</td>
                                                        <td><span className={`badge ${getPaymentMethodBadge(transaction.payment_method)}`}>{transaction.payment_method}</span></td>
                                                        <td className="text-end fw-semibold">{Number(transaction.total_amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR'})}</td>
                                                        <td className="text-center">
                                                            <span className={`badge ${transaction.status === "success" ? "bg-success" : transaction.status === "pending" ? "bg-warning text-dark" : "bg-danger"}`}>{transaction.status}</span>
                                                        </td>
                                                        <td className="text-end">{transaction.total_quantity || 0}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="empty-state"><i className="bi bi-inbox"></i><h6>Tidak ada transaksi</h6><p>Pilih periode untuk melihat data</p></div>
                                    )}
                                </Deferred>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}



