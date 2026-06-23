import { Head, Link, router, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import Pagination from "../../../Components/Pagination";
import Barcode from "react-barcode";

export default function ProductIndex() {
    const { products } = usePage().props;
    const [filterText, setFilterText] = useState("");
    const filteredProducts = products.data.filter((product) => product.name && product.name.toLowerCase().includes(filterText.toLowerCase()));
    const barcodeRefs = useRef({});
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?", text: "You wont be able to revert this!", icon: "warning",
            showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/products/${id}`, {
                    onSuccess: () => { Swal.fire("Deleted!", "Product has been deleted", "success"); window.location.reload(); },
                    onError: () => { Swal.fire("Error!", "There was a problem deleting the product", "error"); }
                });
            }
        });
    };
    const handleDownloadBarcode = (productId, barcodeValue) => {
        const svg = barcodeRefs.current[productId];
        if (svg) {
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svg);
            const canvas = document.createElement("canvas");
            const img = new Image();
            const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8"});
            const url = URL.createObjectURL(svgBlob);
            img.onload = () => {
                canvas.width = img.width; canvas.height = img.height;
                const context = canvas.getContext("2d");
                context.drawImage(img, 0, 0);
                URL.revokeObjectURL(url);
                const pngUrl = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                downloadLink.download = `barcode-${barcodeValue}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            };
            img.src = url;
        }
    };
    return (
        <>
            <Head><title>Products - AkuPos</title></Head>
            <AdminLayout>
                <div className="page-header-bar">
                    <div className="header-left">
                        <div className="header-icon"><i className="bi bi-box"></i></div>
                        <div><h5>Produk</h5><p className="header-sub">Kelola data produk</p></div>
                    </div>
                    <div className="header-actions">
                        <Link href="/admin/products/create" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i> Tambah</Link>
                    </div>
                </div>
                <div className="toolbar-bar">
                    <div className="search-wrapper">
                        <i className="bi bi-search"></i>
                        <input type="text" className="form-control" placeholder="Cari produk..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
                    </div>
                </div>
                <div className="table-card">
                    <div className="table-card-header"><h6><i className="bi bi-table me-2"></i>Daftar Produk</h6><span>{filteredProducts.length} data</span></div>
                    <div className="table-wrap">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th className="text-center" style={{width:'50px'}}>No</th>
                                    <th style={{width:'70px'}}>Gambar</th>
                                    <th>Nama</th>
                                    <th>Kategori</th>
                                    <th>Harga</th>
                                    <th className="text-center">Stok</th>
                                    <th className="text-center" style={{width:'200px'}}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product, index) => (
                                        <tr key={product.id}>
                                            <td className="text-center text-muted">{index + 1 + (products.current_page - 1) * products.per_page}</td>
                                            <td><img src={product.image} alt={product.name} style={{width:'45px', height:'45px', objectFit:'cover', borderRadius:'8px'}}/></td>
                                            <td className="fw-semibold">{product.name || "-"}</td>
                                            <td>{product.category?.name || "-"}</td>
                                            <td className="text-muted">{`Rp. ${product.selling_price}`}</td>
                                            <td className="text-center"><span className="badge bg-info bg-opacity-10 text-info">{product.stock_total ? product.stock_total.total_stock : 0}</span></td>
                                            <td className="text-center">
                                                <div className="d-flex gap-1 justify-content-center flex-wrap">
                                                    <Link href={`/admin/products/${product.id}/edit`} className="btn btn-action btn-action-edit"><i className="bi bi-pencil-fill me-1"></i>Edit</Link>
                                                    <button className="btn btn-action btn-action-delete" onClick={() => handleDelete(product.id)}><i className="bi bi-trash-fill me-1"></i>Hapus</button>
                                                    <button className="btn btn-action btn-action-view" onClick={() => handleDownloadBarcode(product.id, product.barcode)}><i className="bi bi-download me-1"></i>Barcode</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="7"><div className="empty-state"><i className="bi bi-box"></i><h6>Tidak ada produk</h6><p>Belum ada data produk</p></div></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="table-footer"><Pagination links={products.links} /></div>
                </div>
            </AdminLayout>
        </>
    );
}



