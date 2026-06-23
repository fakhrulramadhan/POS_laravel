import { Head, Link, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";
import Pagination from "../../../Components/Pagination";

export default function RolesIndex() {
    const { roles } = usePage().props;
    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda Yakin?", text: "Data ini akan dihapus secara permanen!", icon: "warning",
            showCancelButton: true, confirmButtonColor: "#3085d6", cancelButtonColor: "#d33", confirmButtonText: "Ya, hapus!"
        }).then((result) => {
            if (result.isConfirmed) { router.delete(`/admin/roles/${id}`, { onSuccess: () => { Swal.fire("Dihapus!", "Data telah dihapus", "success"); } }); }
        });
    };
    return (
        <>
            <Head><title>Roles - AkuPos</title></Head>
            <AdminLayout>
                <div className="page-header-bar">
                    <div className="header-left">
                        <div className="header-icon"><i className="bi bi-shield-lock"></i></div>
                        <div><h5>Roles</h5><p className="header-sub">Kelola hak akses pengguna</p></div>
                    </div>
                    <div className="header-actions">
                        {hasAnyPermission(["roles.create"]) && (<Link href="/admin/roles/create" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i> Tambah</Link>)}
                    </div>
                </div>
                <div className="table-card">
                    <div className="table-card-header"><h6><i className="bi bi-table me-2"></i>Daftar Role</h6><span>{roles.data.length} data</span></div>
                    <div className="table-wrap">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th className="text-center" style={{width:'60px'}}>No</th>
                                    <th>Nama Role</th>
                                    <th>Permissions</th>
                                    <th className="text-center" style={{width:'160px'}}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.data.map((role, index) => (
                                    <tr key={role.id}>
                                        <td className="text-center text-muted">{index + 1 + (roles.current_page - 1) * roles.per_page}</td>
                                        <td className="fw-semibold">{role.name}</td>
                                        <td><div className="d-flex flex-wrap gap-1">{role.permissions.map((perm, i) => (<span key={i} className="badge bg-primary bg-opacity-10 text-primary">{perm.name}</span>))}</div></td>
                                        <td className="text-center">
                                            {role.name !== "admin" && (
                                                <div className="d-flex gap-1 justify-content-center">
                                                    {hasAnyPermission(["roles.edit"]) && (<Link href={`/admin/roles/${role.id}/edit`} className="btn btn-action btn-action-edit"><i className="bi bi-pencil-fill me-1"></i>Edit</Link>)}
                                                    {hasAnyPermission(["roles.delete"]) && (<button className="btn btn-action btn-action-delete" onClick={() => handleDelete(role.id)}><i className="bi bi-trash-fill me-1"></i>Hapus</button>)}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="table-footer"><Pagination links={roles.links} /></div>
                </div>
            </AdminLayout>
        </>
    );
}



