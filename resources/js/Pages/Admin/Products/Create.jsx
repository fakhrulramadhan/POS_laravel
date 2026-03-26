import { Head, useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function ProductsCreate() {
    
    const { categories, units } = usePage().props;

    const {data, setData, post, processing, reset, errors} = useForm({
        barcode: '',
        name: '',
        category_id: '',
        unit_id: '',
        selling_price: '',
        image: null
    });

    const submit = (e) => {
        e.preventDefault();

        post(`/admin/products`, {
            onSuccess: () => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Product created successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });

                reset();
            }
        });
    };

    return (
        <>
            <Head>
                <title>Create Product - EasyPOS</title>
            </Head>
            <AdminLayout>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 rounded shadow-sm border-top-success">
                            <div className="card-header">
                                <span className="font-weight-bold"><i className="bi bi-box-seam-fill"></i> Add New</span>
                            </div>

                            <div className="card-body">
                                <form onSubmit={submit} encType="multipart/form-data">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Product Image</label>
                                                <input type="file"
                                                className="form-control"
                                                onChange={e => setData('image', e.target.files[0])}
                                                />
                                                {errors.image && <div className="alert alert-danger">{errors.image}</div>}
                                            </div>
                                             
                                             {/* inputan barcode */}
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Barcode</label>
                                                <input type="text"
                                                className="form-control"
                                                placeholder="Enter Barcode"
                                                value={data.barcode}
                                                onChange={e => setData('barcode', e.target.value)}
                                                />
                                                {errors.barcode && <div className="alert alert-danger">{errors.barcode}</div> }
                                            </div>
                                            
                                            {/*nama produk inputan  */}
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Product Name</label>
                                                <input type="text"
                                                className="form-control"
                                                placeholder="Enter Product Name"
                                                value={data.name}
                                                onChange={(e) =>setData('name', e.target.value)}
                                                />
                                                {errors.name && <div className="alert alert-danger">{errors.name}</div> }

                                            </div>
                                        </div>

                                        {/* kolom kedua */}
                                        <div className="col-md-6">
                                            {/* kategori select */}
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Category</label>
                                                <select className="form-select"
                                                value={data.category_id}
                                                onChange={e => setData('category_id', e.target.value)}
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map(category => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.category_id && <div className="alert alert-danger">
                                                    {errors.category_id}
                                                </div> }
                                            </div>

                                            {/* dropdown select nama unit */}
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Unit</label>
                                                <select className="form-select"
                                                value={data.unit_id}
                                                onChange={e => setData('unit_id', e.target.value)}
                                                >
                                                    <option value="">Select Unit</option>
                                                    {units.map(unit => (
                                                        <option key={unit.id} value={unit.id}>
                                                            {unit.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.unit_id && <div className="alert alert-danger">{errors.unit_id}</div> }
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Selling Price</label>
                                                <input type="number"
                                                className="form-control"
                                                placeholder="Enter price"
                                                value={data.selling_price}
                                                onChange={e => setData('selling_price', e.target.value)}
                                                />
                                                {errors.selling_price && <div className="alert alert-danger">
                                                    {errors.selling_price}
                                                </div> }
                                            </div>
                                        </div>
                                    </div>

                                    {/* submit button */}
                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-md btn-success me-2" disabled={processing}>
                                            <i className="fa fa-save"></i> Save
                                        </button>
                                        <button type="reset" className="btn btn-md btn-warning" onClick={() => reset()}>
                                            <i className="fa fa-redo"></i> Reset
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}