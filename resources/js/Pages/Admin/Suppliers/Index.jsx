import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";
import Pagination from "../../../Components/Pagination";

export default function SupplierIndex() {
    const { suppliers } = usePage().props;
    const [filterText, setFilterText] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const filteredSuppliers = suppliers.data.filter(
        (supplier) => 
        (supplier.name.toLowerCase().includes(filterText.toLowerCase()) || supplier.phone.toLowerCase().includes(filterText.toLowerCase())) &&
        (statusFilter ? supplier.status === statusFilter : true) 
    );
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?", text: "You won't be able to revert this", icon: "warning",
            showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/suppliers/${id}`, {
                    onSuccess: () => { Swal.fire("Deleted!", "Supplier has been deleted", "success"); window.location.reload(); },
                    onError: () => { Swal.fire("Error", "There was a problem deleting the supplier.", "error"); }
                });
            }
        });
    };
    return (
        <>
            <Head><title>Suppliers - AkuPos</title></Head>
            <AdminLayout>
                <div className="page-header-bar">
                    <div className="header-left">
                        <div className="header-icon"><i className="bi bi-truck"></i></div>
                        <div><h5>Supplier</h5><p className="header-sub">Kelola data supplier</p></div>
                    </div>
                    <div className="header-actions">
                        {hasAnyPermission(["suppliers.create"]) && (<Link href="/admin/suppliers/create" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i> Tambah</Link>)}
                    </div>
                </div>
                <div className="toolbar-bar">
                    <div className="search-wrapper">
                        <i className="bi bi-search"></i>
                        <input type="text" className="form-control" placeholder="Cari supplier..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
                    </div>
                    <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">Semua Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="table-card">
                    <div className="table-card-header"><h6><i className="bi bi-table me-2"></i>Daftar Supplier</h6><span>{filteredSuppliers.length} data</span></div>
                    <div className="table-wrap">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th className="text-center" style={{width:'60px'}}>No</th>
                                    <th>Nama</th>
                                    <th>Telepon</th>
                                    <th>Alamat</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center" style={{width:'180px'}}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSuppliers.length > 0 ? (
                                    filteredSuppliers.map((supplier, index) => (
                                        <tr key={supplier.id}>
                                            <td className="text-center text-muted">{index + 1 + (suppliers.current_page - 1) * suppliers.per_page}</td>
                                            <td className="fw-semibold">{supplier.name || "-"}</td>
                                            <td>{supplier.phone || "-"}</td>
                                            <td className="text-muted">{supplier.address || "-"}</td>
                                            <td className="text-center"><span className={`badge ${supplier.status === "active" ? "bg-success" : "bg-secondary"}`}>{supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}</span></td>
                                            <td className="text-center">
                                                <div className="d-flex gap-1 justify-content-center">
                                                    {hasAnyPermission(["suppliers.edit"]) && (<Link href={`/admin/suppliers/${supplier.id}/edit`} className="btn btn-action btn-action-edit"><i className="bi bi-pencil-fill me-1"></i>Edit</Link>)}
                                                    {hasAnyPermission(["suppliers.delete"]) && (<button className="btn btn-action btn-action-delete" onClick={() => handleDelete(supplier.id)}><i className="bi bi-trash-fill me-1"></i>Hapus</button>)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6"><div className="empty-state"><i className="bi bi-truck"></i><h6>Tidak ada supplier</h6><p>Belum ada data supplier</p></div></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="table-footer"><Pagination links={suppliers.links} /></div>
                </div>
            </AdminLayout>
        </>
    );
}



