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
                    onSuccess: () => {
                        Swal.fire(
                            "Deleted!",
                            "Category has been Deleted",
                            "success"
                        );
                        window.location.reload();
                    },

                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "There was a problem deleting the category.",
                            "error"
                        )
                    }
                });
            }
        })
    };

    return (
        <>
            <Head>
                <title>Category - EasyPOS</title>
            </Head>
            <AdminLayout>
                {/* Breadcrumb navigation */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/admin">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item active"
                            aria-current="page"
                        >Categories</li>
                    </ol>
                </nav>

                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <input type="text"
                                className="form-control me-2 w-25"
                                placeholder="Search categories"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                            {hasAnyPermission(["categories.create"]) && (
                                <Link
                                    href="/admin/categories/create"
                                    className="btn btn-success"
                                >
                                    <i className="bi bi-plus-circle-fill me-2"></i> {" "}
                                    Add Category
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* tabel kategori */}
                <div className="row">
                    <div className="col-12">
                        <div className="card border rounded">
                            <div className="card-body p-0">
                                <div className="table-responsive p-0">
                                    <table className="table align-middle table-hover">
                                        <thead className="bg-light text-white">
                                            <tr>
                                                <th className="text-center">
                                                    No.
                                                </th>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCategories.length > 0 ? (
                                                filteredCategories.map(
                                                    (category, index) => (
                                                        <tr key={category.id}>
                                                            <td className="text-center">
                                                                {index + 1 + (categories.current_page - 1) * categories.per_page}
                                                            </td>
                                                            <td>{category.name}</td>
                                                            <td>{category.description}</td>
                                                            <td className="text-center">
                                                             {hasAnyPermission(["categories.edit"]) && (
                                                                <Link
                                                                    href={`/admin/categories/${category.id}/edit`}
                                                                    className="btn btn-outline-primary btn-sm me-2 rounded"
                                                                >
                                                                    <i className="bi bi-pencil-fill"></i>{" "}
                                                                    Edit
                                                                </Link>
                                                            )}
                                                            
                                                                {hasAnyPermission(["categories.delete"]) && (
                                                                    <button
                                                                    className="btn btn-outline-danger btn-sm rounded"
                                                                    onClick={() => handleDelete(category.id)}
                                                                    >
                                                                        <i className="bi bi-trash-fill"></i>{" "} Delete
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            )
                                            
                                            :
                                            (
                                                <tr>
                                                    <td colSpan="4"
                                                        className="text-center"
                                                    >
                                                        No Categories Found
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <Pagination links={categories.links}/>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}