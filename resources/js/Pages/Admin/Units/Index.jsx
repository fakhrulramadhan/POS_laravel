import { Head, Link, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import Pagination from "../../../Components/Pagination";

export default function UnitIndex() {
    const { units } = usePage().props;
    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah anda yakin?", text: "Anda tidak akan bisa membatalkan tindakan ini", icon: "warning",
            showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Ya, hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/units/${id}`, {
                    onSuccess: () => { Swal.fire("Dihapus", "Unit telah Dihapus.", "success"); },
                    onError: () => { Swal.fire("Error!", "Terjadi masalah saat menghapus unit.", "error"); }
                });
            }
        });
    };
    return (
        <>
            <Head><title>Units - AkuPos</title></Head>
            <AdminLayout>
                <div className="page-header-bar">
                    <div className="header-left">
                        <div className="header-icon"><i className="bi bi-rulers"></i></div>
                        <div><h5>Unit</h5><p className="header-sub">Kelola satuan unit produk</p></div>
                    </div>
                    <div className="header-actions">
                        <Link href="/admin/units/create" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i> Tambah</Link>
                    </div>
                </div>
                <div className="table-card">
                    <div className="table-card-header"><h6><i className="bi bi-table me-2"></i>Daftar Unit</h6><span>{units.data.length} data</span></div>
                    <div className="table-wrap">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th className="text-center" style={{width:'60px'}}>No</th>
                                    <th>Nama Unit</th>
                                    <th className="text-center" style={{width:'180px'}}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {units.data.length > 0 ? (
                                    units.data.map((unit, index) => (
                                        <tr key={unit.id}>
                                            <td className="text-center text-muted">{index + 1 + (units.current_page - 1) * units.per_page}</td>
                                            <td className="fw-semibold">{unit.name || "-"}</td>
                                            <td className="text-center">
                                                <div className="d-flex gap-1 justify-content-center">
                                                    <Link href={`/admin/units/${unit.id}/edit`} className="btn btn-action btn-action-edit"><i className="bi bi-pencil-fill me-1"></i>Edit</Link>
                                                    <button className="btn btn-action btn-action-delete" onClick={() => handleDelete(unit.id)}><i className="bi bi-trash-fill me-1"></i>Hapus</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3"><div className="empty-state"><i className="bi bi-rulers"></i><h6>Tidak ada unit</h6><p>Belum ada data unit</p></div></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="table-footer"><Pagination links={units.links} /></div>
                </div>
            </AdminLayout>
        </>
    );
}



