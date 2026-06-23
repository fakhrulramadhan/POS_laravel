import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function StockOpnameIndex() {
    const { stockOpnames } = usePage().props;
    const [filterText, setFilterText] = useState("");
    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-warning text-dark';
            case 'success': return 'bg-success';
            case 'canceled': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric'};
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    const filteredStockOpnames = stockOpnames.data.filter((so) => formatDate(so.opname_date).toLowerCase().includes(filterText.toLowerCase()) || so.status.toLowerCase().includes(filterText.toLowerCase()));
    return (
        <>
            <Head><title>Stock Opnames - AkuPos</title></Head>
            <AdminLayout>
                <div className="page-header-bar">
                    <div className="header-left">
                        <div className="header-icon"><i className="bi bi-journal-check"></i></div>
                        <div><h5>Stock Opname</h5><p className="header-sub">Manajemen stok opname</p></div>
                    </div>
                    <div className="header-actions">
                        <Link href="/admin/stock-opnames/create" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i> Baru</Link>
                    </div>
                </div>
                <div className="toolbar-bar">
                    <div className="search-wrapper">
                        <i className="bi bi-search"></i>
                        <input type="text" className="form-control" placeholder="Cari berdasarkan tanggal atau status..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
                    </div>
                </div>
                <div className="table-card">
                    <div className="table-card-header"><h6><i className="bi bi-table me-2"></i>Riwayat Stock Opname</h6><span>{filteredStockOpnames.length} data</span></div>
                    <div className="table-wrap">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th className="text-center" style={{width:'60px'}}>No</th>
                                    <th>Tanggal</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center" style={{width:'200px'}}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStockOpnames.length > 0 ? (
                                    filteredStockOpnames.map((so, index) => (
                                        <tr key={so.id}>
                                            <td className="text-center text-muted">{index + 1 + (stockOpnames.current_page - 1) * stockOpnames.per_page}</td>
                                            <td className="fw-semibold">{formatDate(so.opname_date)}</td>
                                            <td className="text-center"><span className={`badge ${getStatusBadge(so.status)}`}>{so.status}</span></td>
                                            <td className="text-center">
                                                <div className="d-flex gap-1 justify-content-center">
                                                    <Link href={`/admin/stock-opnames/${so.id}/edit`} className="btn btn-action btn-action-edit"><i className="bi bi-pencil-fill me-1"></i>Edit</Link>
                                                    <Link href={`/admin/stock-opnames/${so.id}`} className="btn btn-action btn-action-view"><i className="bi bi-eye-fill me-1"></i>Detail</Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4"><div className="empty-state"><i className="bi bi-journal-check"></i><h6>Tidak ada data</h6><p>Belum ada stock opname</p></div></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="table-footer"><Pagination links={stockOpnames.links} /></div>
                </div>
            </AdminLayout>
        </>
    );
}



