import { Head, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";


export default function ProductStockEdit() {
    
    const { productStock, products, suppliers } = usePage().props;

    const {data, setData, put, processing, reset, errors} = useForm({
        product_id: productStock.product_id || "",
        supplier_id: productStock.supplier_id || "",
        stock_quantity: productStock.stock_quantity || 0,
        received_at: productStock.received_at ? productStock.received_at.split('T')[0] : "",
    });

    const [selectedProduct, setSelectedProduct] = useState(null); //utk menampilkan data produk
    // utk menampilkan supplier yg dipilih, dan data supplier yang diubah sudah dipilih (update)
    const [selectedSupplier, setSelectedSuppler] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // set selectedProduct dan selectedSupplier setelah data products dan supplier tersedia

    // use effect seperti initstate lagi di flutter
    useEffect(() => {
        // jika id productnya yang di database sama dengan di form maka set produk yg dipilih jika tidak maka null
        const product = products.find(p => p.id === data.product_id) || null;
        setSelectedProduct(product);

        const supplier = suppliers.find(s => s.id === data.supplier_id) || null;
        setSelectedSuppler(supplier);

        if (products.length > 0 && suppliers.length > 0) {
            setIsLoading(false);
        }
    }, [products, suppliers, data.product_id, data.supplier_id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // cek status supplier, jika inactive maka akan muncul warning
        if (selectedSupplier && selectedSupplier.status === 'inactive') {
            Swal.fire({
                title: 'Warning!',
                text: 'Supplier yang dipilih tidak aktif, apakah anda ingin melanjutkan',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, continue',
                cancelButtonText: 'No, cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    put(`/admin/stocks/${productStock.id}`, {
                        onSuccess: () => {
                            Swal.fire({
                                title: "Success!",
                                text: "Product stock updated successfully",
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1500
                            });

                            reset();
                        }
                    });
                }
            });
        } else {
            // submit form jika supplier aktif
            put(`/admin/stocks/${productStock.id}`, {
                onSuccess: () => {
                    Swal.fire({
                        title: "Success!",
                        text: "Product stock updated successfully!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });

                    reset();
                },
            });
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setData(name, value);

        // update selected supplier jika supplier_id berubah
        if (name === 'supplier_id') {
           const selected = suppliers.find(supplier => supplier.id === parseInt(value));
           setSelectedSuppler(selected); 
        }

        if (name === "product_id") {
            const selected = products.find(product => product.id === parseInt(value));
            setSelectedProduct(selected);
        }
    };

    return (
        <>
            <Head>
                <title>Edit Product Stock - EasyPOS</title>
            </Head>
            <AdminLayout>
                <div className="d-flex justify-content-center mt-5">
                    <div className="col-md-6 col-12">
                        <div className="card border-0 rounded shadow border-top-warning">
                            <div className="card-header text-center">
                                <span className="font-weight-bold">
                                    <i className="bi bi-box-seam"></i> Edit Product Stock
                                </span>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Product</label>
                                        <div className="input-group">
                                            <input type="text"
                                            className="form-control"
                                            value={selectedProduct ? selectedProduct.name : ""}
                                            placeholder="Select Product"
                                            readOnly
                                            data-bs-toggle="modal"
                                            data-bs-target="#productModal"
                                            />
                                        </div>
                                        <input type="hidden"
                                           name="product_id"
                                           value={data.product_id}
                                           onChange={handleChange}
                                        />
                                        {errors.product_id && <div className="alert alert-danger mt-2">{errors.product_id}</div> }
                                    </div>
                                    
                                    {/* menampilkan total stok */}
                                    {selectedProduct && (
                                        <div className="mb-4">
                                            <label className="form-label fw-bold">Total Stock</label>
                                            <input type="text"
                                            className="form-control"
                                            value={selectedProduct.stockTotal?.total_stock || 0}
                                            disabled
                                            />
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Supplier</label>
                                        <select name="supplier_id" className="form-select"
                                        value={data.supplier_id}
                                        onChange={handleChange}
                                        >
                                            <option value="">Select Supplier</option>
                                            {suppliers.map((supplier) => (
                                                <option key={supplier.id} value={supplier.id}>
                                                    {supplier.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.supplier_id && <div className="alert alert-danger mt-2">{errors.supplier_id}</div> }

                                        {selectedSupplier && (
                                            <div className={`mt-2 ${selectedSupplier.status === 'active' ? 'text-success' : 'text-danger'}`}>
                                                <strong>Status</strong> {selectedSupplier.status === 'active' ? 'Active' : 'Inactive'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Stock Quantity</label>
                                        <input type="number"
                                        name="stock_quantity"
                                        className="form-control"
                                        value={data.stock_quantity}
                                        onChange={handleChange}
                                        placeholder="Enter Stock Quantity"
                                        />
                                        {errors.stock_quantity && <div className="alert alert-danger mt-2">{errors.stock_quantity}</div> }
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Received Date</label>
                                        <input type="date"
                                        name="received_at"
                                        className="form-control"
                                        value={data.received_at}
                                        onChange={handleChange}
                                        />
                                        {errors.received_at && <div className="alert alert-danger mt-2">{errors.received_at}</div> }
                                    </div>

                                    <div className="d-flex justify-content-end">
                                        <button
                                        type="submit"
                                        className="btn btn-md btn-warning me-2"
                                        disabled={processing}
                                        >
                                            { processing ? (
                                                <>
                                                <div className="spinner-border spinner-border-sm text-light me-2" role="status">
                                                    <span className="visually-hidden">Loasing...</span>
                                                </div>
                                                loading...
                                                </>
                                            )
                                            :
                                            (
                                                <>
                                                    <i className="fa fa-save"></i> Update
                                                </>
                                            )
                                        }
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>

            {/* Modal Product */}
            <div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title" id="productModalLabel">Select Product</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        {isLoading ? (
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )
                            : (
                            <div className="table-responsive p-4">
                                <table className="table align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Barcode</th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id}>
                                                <td>{product.barcode}</td>
                                                <td>{product.name}</td>
                                                <td>{product.price}</td>
                                                <td>{product.stockTotal?.total_stock || 0}</td>
                                                <td>
                                                    <button
                                                    onClick={() => {
                                                        setData("product_id", product.id);
                                                        setSelectedProduct(product);
                                                    }}
                                                    className="btn btn-primary"
                                                    data-bs-dismiss="modal"
                                                    >
                                                        Select
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>                                
                            )
                        }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}