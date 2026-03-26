import { Head, Link, router, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import Pagination from "../../../Components/Pagination";
import Barcode from "react-barcode";

export default function ProductIndex() {
    
    const { products } = usePage().props;
    const [filterText, setFilterText] = useState("");
    
    const filteredProducts = products.data.filter((product) =>
        product.name && product.name.toLowerCase().includes(filterText.toLowerCase())
    );

    // menambahkan ref untuk setiap barcode 
    const barcodeRefs = useRef({});

    // fungsi untuk menangani penghapusan produk
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You wont be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/products/${id}`, {
                    onSuccess: () => {
                        Swal.fire("Deleted!", "Product has been deleted", "success");
                        window.location.reload();
                    },
                    onError: () => {
                        Swal.fire("Error!", "There was a problem deleting the product", "error");
                    }
                });
            }
        });
    };

    // fungsi untuk handle download barcode
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
                canvas.width = img.width;
                canvas.height = img.height;
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
            <Head>
                <title>Products - EasyPOS</title>
            </Head>
            <AdminLayout>
                {/* Navigasi breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/admin">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Products
                        </li>
                    </ol>
                </nav>

                {/* judul halaman */}
                <div className="row mb-3">
                    <div className="col-md-12">
                        <h3 className="font-weight-bold">
                            <i className="bi bi-box-seam-fill"></i> Products
                        </h3>
                    </div>
                </div>

                {/* Pencarian dan tombol tambah produk */}
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <input type="text"
                            className="form-control me-2 w-25"
                            placeholder="Cari berdasarkan Nama"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            />
                            <Link href="/admin/products/create" className="btn btn-success">
                                <i className="bi bi-plus-circle-fill me-2"></i> Tambah Produk
                            </Link>
                        </div>
                    </div>
                </div>

                {/* tabel produk */}
                <div className="row">
                    <div className="col-12">
                        <div className="card border rounded">
                            <div className="card-body p-0">
                                <div className="table-responsive p-4">
                                    <table className="table align-middle table-hover">
                                        <thead className="bg-light text-white">
                                            <tr>
                                                <th className="text-center">No. </th>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Barcode</th>
                                                <th>Category</th>
                                                <th>Price</th>
                                                <th>Stock</th>
                                                <th className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map((product, index) => (
                                                    <tr key={product.id}>
                                                        <td className="text-center">
                                                            {index + 1 + (products.current_page - 1) * products.per_page}
                                                        </td>
                                                        <td>
                                                            <img src={product.image} alt={product.name} width="50"/>
                                                        </td>
                                                        <td>
                                                            {product.name || "Nama tidak tersedia"}
                                                        </td>
                                                        <td>
                                                            {/* menambahkan ref pada svg barcode */}
                                                            <svg
                                                            ref={(el) => (barcodeRefs.current[product.id] = el)}
                                                            >
                                                                <Barcode
                                                                value={product.barcode}
                                                                width={3}
                                                                height={80}
                                                                fontSize={12}
                                                                displayValue={false}
                                                                renderer="svg"
                                                                />
                                                            </svg>
                                                        </td>
                                                        <td>
                                                            {product.category.name || "Tidak ada kategori"}
                                                        </td>
                                                        <td>
                                                            {`Rp. ${product.selling_price}`}
                                                        </td>
                                                        {/* join ke tabel stock total */}
                                                        <td>
                                                        {product.stock_total ? 
                                                            product.stock_total.total_stock : 0    
                                                        }
                                                        </td>
                                                        <td className="text-center">
                                                            <Link
                                                            href={`/admin/products/${product.id}/edit`}
                                                            className="btn btn-outline-primary btn-sm me-2 rounded"
                                                            aria-label={`Edit productL ${product.name}`}
                                                            >
                                                                <i className="bi bi-pencil-fill"></i> Edit
                                                            </Link>
                                                            <button
                                                            className="btn btn-outline-danger btn-sm rounded me-2"
                                                            onClick={() => handleDelete(product.id)}
                                                            aria-label={`Delete product ${product.name}`}
                                                            >
                                                                <i className="bi bi-trash-fill"></i> Delete
                                                            </button>
                                                            <button
                                                            className="btn btn-outline-secondary btn-sm rounded"
                                                            onClick={() => handleDownloadBarcode(product.id, product.barcode)}
                                                            aria-label={`Download Barcode untuk produk: ${product.name}`}
                                                            >
                                                                <i className="bi bi-download"></i> Download Barcode
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )
                                            :
                                            (
                                                <tr>
                                                    <td colSpan="8" className="text-center">
                                                        Tidak ada produk ditemukan
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination */}
                                <Pagination links={products.links}/>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}