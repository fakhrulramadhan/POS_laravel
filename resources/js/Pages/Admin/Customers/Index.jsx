import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";


export default function CustomerIndex() {
    
    const { customers } = usePage().props;
    const [filterText,  setFilterText] = useState("");

    // filter customers based on search input
    const filteredCustomers = customers.data.filter(
        (customer) => (customer.name && customer.name.toLowerCase()
                .includes(filterText.toLowerCase())) ||
        (customer.phone && customer.phone.toLowerCase().includes(filterText.toLowerCase()))
    );

    // utk delete based id
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: "#3085d6",
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {

            if (result.isConfirmed) {
                // panggil hapus route
                router.delete(`/admin/customers/${id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            "Deleted!",
                            "Customer has been deleted",
                            "success"
                        );

                        // refresh halaman atau update state
                        window.location.reload();
                    },

                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "There was a problem deleting the customers.",
                            "error"
                        );
                    }
                });
            }
        });
    };

    return (
        <>
            <Head>
                <title>Customers - EasyPOS</title>
            </Head>
            <AdminLayout>
                <nav aria-label="breadcrumb">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/admin">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item active"
                            aria-current="page"
                        >Customers</li>
                    </ul>
                </nav>
                <div className="row mb-2">
                    <div className="col-md-12">
                        <h3 className="font-weight-bold">
                            <i className="bi bi-person"></i> Customers
                        </h3>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-center align-items-center">
                            <input type="text"
                            className="form-control me-2 w-25"
                            placeholder="Search by Name or Phone"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            />

                            {/* jika user punya izin create customer, tampilkan button add */}
                            {hasAnyPermission(["customers.create"]) && (
                                <Link
                                    href="/admin/customers/create"
                                    className="btn btn-success"
                                >
                                    <i className="bi bi-plus-circle-fill me-2">
                                        Add Customer
                                    </i>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card border rounded">
                            <div className="card-body p-0">
                                <div className="table-responsive p-0">
                                   <table className="table align-middle table-hover">
                                      <thead className="bg-light text-white">
                                        <tr>
                                            <th className="text-center">No.</th> 
                                            <th>Name</th> 
                                            <th>Phone</th>
                                            <th>Address</th>  
                                            <th>Gender</th>
                                            <th className="text-center">Actions</th>
                                        </tr>  
                                      </thead>
                                      <tbody>
                                        {filteredCustomers.length > 0 ? (
                                            filteredCustomers.map((customer, index) => (
                                                <tr key={customer.id}>
                                                    <td className="text-center">
                                                        {index + 1 + (customers.current_page - 1) * customers.per_page}
                                                    </td>
                                                    <td>
                                                        {customer.name || "No Name Available"}
                                                    </td>
                                                    <td>
                                                        {customer.phone || "No phone available"}
                                                    </td>
                                                    <td>
                                                        {customer.address || "No address available"}
                                                    </td>
                                                    {/* jika gender tipe datanya string, maka ambil karaker ke 0 nya jadiin huruf besar */}
                                                    <td>
                                                        <span className={`badge ${customer.gender === "active" ? "bg-success" : "bg-secondary"}}`}>

                                                            {
                                                                customer.gender && typeof customer.gender === "string" ? customer.gender.charAt(0).toUpperCase() + customer.gender.slice(1) : "N/A"
                                                            }
                                                        </span>
                                                    </td>

                                                    <td className="text-center">
                                                        {hasAnyPermission(["customers.edit"]) && (
                                                            <Link
                                                                href={`/admin/customers/${customer.id}/edit`}
                                                                className="btn btn-outline-primary btn-sm me-2 rounded"
                                                            >
                                                                <i className="bi bi-pencil-fill"></i>
                                                                {" "} Edit
                                                            </Link>
                                                        )}
                                                        {hasAnyPermission(["customers.delete"]) && (
                                                            <button className="btn btn-outline-danger btn-sm rounded"
                                                            onClick={() => handleDelete(customer.id)}
                                                            >
                                                                <i className="bi bi-trash-fill"></i>{" "} Delete
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                        :
                                        // lebar kolomnya 6, teksnya ketengahin
                                        (
                                            <tr>
                                                <td colSpan="6"
                                                className="text-center"
                                                >
                                                    No Customers Found
                                                </td>
                                            </tr>
                                        )
                                    }
                                      </tbody>
                                   </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}