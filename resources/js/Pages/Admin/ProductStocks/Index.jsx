import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import Pagination from "../../../Components/Pagination";

export default function ProductStockIndex() {
    const { productStocks = { data: [] }, suppliers = []} = usePage().props;
    const [filterText, setFilterText] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const filteredStocks = productStocks.data.filter((stock) => stock.supplier.name.toLowerCase().includes(filterText.toLowerCase()) && (selectedSupplier ? stock.supplier.id === parseInt(selectedSupplier) : true));
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are You Sure', text: "You won't be able to revert this!", icon: "warning",
            showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/stocks/${id}`, {
                    onSuccess: () => { Swal.fire("Deleted!", "Product stock has been deleted.", "success"); },
                    onError: () => { Swal.fire("Error!", "There was a problem deleting the product stock.", "error"); }
                });
            }
        });
    };
    return (
        <>
            <Head><title>Stok Produk - AkuPos</title></Head>
            <AdminLayout>
                <div className="page-header-bar">
                    <div className="header-left">
                        <div className="header-icon"><i className="bi bi-box-seam"></i></div>
                        <div><h5>Stok Produk</h5><p className="header-sub">Manajemen stok masuk</p></div>
                    </div>
                    <div className="header-actions">
                        <Link href="/admin/stocks/create" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i> Tambah Stok</Link>
                    </div>
                </div>
                <div className="toolbar-bar">
                    <div className="search-wrapper">
                        <i className="bi bi-search"></i>
                        <input type="text" className="form-control" placeholder="Cari supplier..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
                    </div>
                    <select className="filter-select" value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
                        <option value="">Semua Supplier</option>
                        {suppliers.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                    </select>
                </div>
                <div className="table-card">
                    <div className="table-card-header"><h6><i className="bi bi-table me-2"></i>Riwayat Stok Masuk</h6><span>{filteredStocks.length} data</span></div>
                    <div className="table-wrap">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th className="text-center" style={{width:'60px'}}>No</th>
                                    <th>Produk</th>
                                    <th>Supplier</th>
                                    <th className="text-center">Jumlah</th>
                                    <th>Tanggal Diterima</th>
                                    <th className="text-center" style={{width:'100px'}}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStocks.length > 0 ? (
                                    filteredStocks.map((stock, index) => (
                                        <tr key={stock.id}>
                                            <td className="text-center text-muted">{index + 1 + (productStocks.current_page - 1) * productStocks.per_page}</td>
                                            <td className="fw-semibold">{stock.product?.name || "-"}</td>
                                            <td>{stock.supplier?.name || "-"}</td>
                                            <td className="text-center"><span className="badge bg-info bg-opacity-10 text-info fw-bold">{stock.stock_quantity || 0}</span></td>
                                            <td className="text-muted">{stock.received_at || "-"}</td>
                                            <td className="text-center">
                                                <button className="btn btn-action btn-action-delete" onClick={() => handleDelete(stock.id)}><i className="bi bi-trash-fill me-1"></i>Hapus</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6"><div className="empty-state"><i className="bi bi-box-seam"></i><h6>Tidak ada data</h6><p>Belum ada stok masuk</p></div></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="table-footer"><Pagination links={productStocks.links} /></div>
                </div>
            </AdminLayout>
        </>
    );
}



