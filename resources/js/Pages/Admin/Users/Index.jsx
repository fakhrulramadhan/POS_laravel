import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import Pagination from "../../../Components/Pagination";
import hasAnyPermission from "../../../utils/hasAnyPermission";

export default function UserIndex() {
    const { users } = usePage().props;
    const [filterText, setFilterText] = useState("");
    const filteredUsers = users.data.filter((user) => user.name.toLowerCase().includes(filterText.toLowerCase()) || user.email.toLowerCase().includes(filterText.toLowerCase()));
    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah anda yakin?", text: "Data ini akan dihapus secara permanen", icon: "warning",
            showCancelButton: true, confirmButtonColor: "#3085d6", cancelButtonColor: "#d33", confirmButtonText: "Ya, hapus!"
        }).then((result) => {
            if (result.isConfirmed) { router.delete(`/admin/users/${id}`, { onSuccess: () => { Swal.fire("Dihapus!", "Data telah dihapus.", "success"); } }); }
        });
    };
    const isAdminEmail = (user) => user.email.toLowerCase() === "admin@gmail.com";
    return (
        <>
            <Head><title>Users - AkuPos</title></Head>
            <AdminLayout>
                <div className="page-header-bar">
                    <div className="header-left">
                        <div className="header-icon"><i className="bi bi-person"></i></div>
                        <div><h5>Pengguna</h5><p className="header-sub">Kelola data pengguna</p></div>
                    </div>
                    <div className="header-actions">
                        {hasAnyPermission(["users.create"]) && (<Link href="/admin/users/create" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i> Tambah</Link>)}
                    </div>
                </div>
                <div className="toolbar-bar">
                    <div className="search-wrapper">
                        <i className="bi bi-search"></i>
                        <input type="text" className="form-control" placeholder="Cari pengguna..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
                    </div>
                </div>
                <div className="table-card">
                    <div className="table-card-header"><h6><i className="bi bi-table me-2"></i>Daftar Pengguna</h6><span>{filteredUsers.length} data</span></div>
                    <div className="table-wrap">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th className="text-center" style={{width:'60px'}}>No</th>
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th className="text-center" style={{width:'160px'}}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr key={user.id}>
                                        <td className="text-center text-muted">{index + 1 + (users.current_page - 1) * users.per_page}</td>
                                        <td className="fw-semibold">{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.roles.map((role, i) => (<span key={i} className="badge bg-success me-1">{role.name}</span>))}</td>
                                        <td className="text-center">
                                            {!isAdminEmail(user) && (
                                                <div className="d-flex gap-1 justify-content-center">
                                                    {hasAnyPermission(["users.edit"]) && (<Link href={`/admin/users/${user.id}/edit`} className="btn btn-action btn-action-edit"><i className="bi bi-pencil-fill me-1"></i>Edit</Link>)}
                                                    {hasAnyPermission(["users.delete"]) && (<button className="btn btn-action btn-action-delete" onClick={() => handleDelete(user.id)}><i className="bi bi-trash-fill me-1"></i>Hapus</button>)}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="table-footer"><Pagination links={users.links} /></div>
                </div>
            </AdminLayout>
        </>
    );
}



