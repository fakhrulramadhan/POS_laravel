import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";

export default function CustomerIndex() {
    const { customers } = usePage().props;
    const [filterText, setFilterText] = useState("");
    const filteredCustomers = customers.data.filter(
        (customer) => (customer.name && customer.name.toLowerCase().includes(filterText.toLowerCase())) ||
        (customer.phone && customer.phone.toLowerCase().includes(filterText.toLowerCase()))
    );
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?", text: "You won't be able to revert this", icon: "warning",
            showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: "#3085d6", confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/customers/${id}`, {
                    onSuccess: () => { Swal.fire("Deleted!", "Customer has been deleted", "success"); window.location.reload(); },
                    onError: () => { Swal.fire("Error!", "There was a problem deleting the customers.", "error"); }
                });
            }
        });
    };
    return (
        <>
            <Head><title>Customers - AkuPos</title></Head>
            <AdminLayout>
                <div className="page-header-bar">
                    <div className="header-left">
                        <div className="header-icon"><i className="bi bi-people"></i></div>
                        <div><h5>Pelanggan</h5><p className="header-sub">Kelola data pelanggan</p></div>
                    </div>
                    <div className="header-actions">
                        {hasAnyPermission(["customers.create"]) && (
                            <Link href="/admin/customers/create" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i> Tambah</Link>
                        )}
                    </div>
                </div>
                <div className="toolbar-bar">
                    <div className="search-wrapper">
                        <i className="bi bi-search"></i>
                        <input type="text" className="form-control" placeholder="Cari pelanggan..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
                    </div>
                </div>
                <div className="table-card">
                    <div className="table-card-header"><h6><i className="bi bi-table me-2"></i>Daftar Pelanggan</h6><span>{filteredCustomers.length} data</span></div>
                    <div className="table-wrap">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th className="text-center" style={{width:'60px'}}>No</th>
                                    <th>Nama</th>
                                    <th>Telepon</th>
                                    <th>Alamat</th>
                                    <th className="text-center">Gender</th>
                                    <th className="text-center" style={{width:'180px'}}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer, index) => (
                                        <tr key={customer.id}>
                                            <td className="text-center text-muted">{index + 1 + (customers.current_page - 1) * customers.per_page}</td>
                                            <td className="fw-semibold">{customer.name || "-"}</td>
                                            <td>{customer.phone || "-"}</td>
                                            <td className="text-muted">{customer.address || "-"}</td>
                                            <td className="text-center"><span className="badge" style={{background: customer.gender === 'pria' ? '#e3f2fd' : '#fce4ec', color: customer.gender === 'pria' ? '#1565c0' : '#c62828'}}>{customer.gender ? customer.gender.charAt(0).toUpperCase() + customer.gender.slice(1) : "-"}</span></td>
                                            <td className="text-center">
                                                <div className="d-flex gap-1 justify-content-center">
                                                    {hasAnyPermission(["customers.edit"]) && (<Link href={`/admin/customers/${customer.id}/edit`} className="btn btn-action btn-action-edit"><i className="bi bi-pencil-fill me-1"></i>Edit</Link>)}
                                                    {hasAnyPermission(["customers.delete"]) && (<button className="btn btn-action btn-action-delete" onClick={() => handleDelete(customer.id)}><i className="bi bi-trash-fill me-1"></i>Hapus</button>)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6"><div className="empty-state"><i className="bi bi-people"></i><h6>Tidak ada pelanggan</h6><p>Belum ada data pelanggan</p></div></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
