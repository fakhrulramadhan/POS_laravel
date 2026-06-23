import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import Pagination from "../../../Components/Pagination";
import hasAnyPermission from "../../../utils/hasAnyPermission";

export default function CateogoryIndex() {
    const { categories } = usePage().props;
    const [filterText, setFilterText] = useState("");
    const filteredCategories = categories.data.filter((category) => 
        category.name.toLowerCase().includes(filterText.toLowerCase())
    );
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You wont be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/categories/${id}`, {
                    onSuccess: () => { Swal.fire("Deleted!", "Category has been Deleted", "success"); window.location.reload(); },
                    onError: () => { Swal.fire("Error!", "There was a problem deleting the category.", "error"); }
                });
            }
        })
    };
    return (
        <>
            <Head><title>Category - AkuPos</title></Head>
            <AdminLayout>
                <div className="page-header-bar">
                    <div className="header-left">
                        <div className="header-icon"><i className="bi bi-list-ul"></i></div>
                        <div><h5>Categories</h5><p className="header-sub">Kelola kategori produk</p></div>
                    </div>
                    <div className="header-actions">
                        {hasAnyPermission(["categories.create"]) && (
                            <Link href="/admin/categories/create" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i> Tambah</Link>
                        )}
                    </div>
                </div>
                <div className="toolbar-bar">
                    <div className="search-wrapper">
                        <i className="bi bi-search"></i>
                        <input type="text" className="form-control" placeholder="Cari kategori..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
                    </div>
                </div>
                <div className="table-card">
                    <div className="table-card-header"><h6><i className="bi bi-table me-2"></i>Daftar Kategori</h6><span>{filteredCategories.length} data</span></div>
                    <div className="table-wrap">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th className="text-center" style={{width: '60px'}}>No</th>
                                    <th>Nama Kategori</th>
                                    <th>Deskripsi</th>
                                    <th className="text-center" style={{width: '180px'}}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((category, index) => (
                                        <tr key={category.id}>
                                            <td className="text-center text-muted">{index + 1 + (categories.current_page - 1) * categories.per_page}</td>
                                            <td className="fw-semibold">{category.name}</td>
                                            <td className="text-muted">{category.description || '-'}</td>
                                            <td className="text-center">
                                                <div className="d-flex gap-1 justify-content-center">
                                                    {hasAnyPermission(["categories.edit"]) && (
                                                        <Link href={`/admin/categories/${category.id}/edit`} className="btn btn-action btn-action-edit"><i className="bi bi-pencil-fill me-1"></i>Edit</Link>
                                                    )}
                                                    {hasAnyPermission(["categories.delete"]) && (
                                                        <button className="btn btn-action btn-action-delete" onClick={() => handleDelete(category.id)}><i className="bi bi-trash-fill me-1"></i>Hapus</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4"><div className="empty-state"><i className="bi bi-inbox"></i><h6>Tidak ada kategori</h6><p>Belum ada data kategori yang tersedia</p></div></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="table-footer"><Pagination links={categories.links} /></div>
                </div>
            </AdminLayout>
        </>
    );
}
