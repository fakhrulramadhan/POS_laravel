import { Head, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function CategoryCreate() {
    const {data, setData, post, processing, errors, reset} = useForm({ name: "", description: "" });
    const handleSubmit = (e) => {
        e.preventDefault();
        post("/admin/categories", {
            onSuccess: () => {
                Swal.fire({ title: "Success!", text: "Category created Successfully!", icon: "success", showConfirmButton: false, timer:1500 });
                reset();
            }
        });
    };
    const handleBack = () => window.history.back();
    return (
        <>
            <Head><title>Create Category - AkuPos</title></Head>
            <AdminLayout>
                <div className="form-card">
                    <div className="form-card-header">
                        <button onClick={handleBack} className="back-btn"><i className="bi bi-arrow-left"></i></button>
                        <h6><i className="bi bi-folder-plus me-2"></i>Tambah Kategori</h6>
                        <div style={{width:'36px'}}></div>
                    </div>
                    <div className="form-card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="form-label">Nama Kategori</label>
                                    <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                        placeholder="Masukkan nama kategori" value={data.name}
                                        onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Deskripsi</label>
                                    <input type="text" className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                        placeholder="Masukkan deskripsi (opsional)" value={data.description}
                                        onChange={(e) => setData('description', e.target.value)} />
                                    {errors.description && <div className="text-danger small mt-1">{errors.description}</div>}
                                </div>
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                <button type="button" className="btn btn-outline-secondary px-4" onClick={() => reset()}>
                                    <i className="bi bi-arrow-counterclockwise me-1"></i>Reset
                                </button>
                                <button type="submit" className="btn btn-primary px-4" disabled={processing}>
                                    {processing ? (<><span className="spinner-border spinner-border-sm me-2"></span>Menyimpan...</>) : (<><i className="bi bi-check-lg me-1"></i>Simpan</>)}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
