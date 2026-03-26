<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CustomerController extends Controller
{
    // tampilkan daftar customer 
    public function index() {
        // ambil data customer, jika ada parameter pencarian q, filter berdasarkan nama
        // customer saja
        $customers = Customer::when(request()->q, function ($query) {
            $query->where('name', 'like', '%' . request()->q . '%');
        })->latest()->paginate(10);

        // sertakan query string q dalam link paginkasi
        $customers->appends(['q' => request()->q]);

        // kembalikan data ke komponen inertia, admin/customers/index
        return inertia('Admin/Customers/Index', [
            'customers'=> $customers
        ]);
    }

    public function create() {
        // kembalikan ke tampilan inertia 'Admin/Customers/Create
        return inertia('Admin/Customers/Create');
    }

    // utk simpan data customer
    public function store(CustomerRequest $request) {
        // buat customer baru yg sudah dibalidasi
        Customer::create($request->validated());

        // arahkan kembali ke inkes customer
        return redirect()->route('admin.customers.index');
    }

    public function edit($id) {
        // ambil data customer based id, akan error jika tidak ditemukan
        $customer = Customer::findOrFail($id);

        // lempar data ke view edit customer
        return inertia('Admin/Customers/Edit', [
            'customer' => $customer
        ]);
    }

    public function update(CustomerRequest $request, Customer $customer) {


        // update data customer dengan data yang telah divalidasi
        $customer->update($request->validated());

        // arahkan kembali ke indeks customer
        return redirect()->route('admin.customers.index');
    }

    // hapus data dari db
    public function destroy($id) {

        // ambil customer based id
        $customer = Customer::findOrFail($id);

        // hapus customer
        $customer->delete();

        // arahkan kembali ke indeks customer
        return redirect()->route('admin.customers.index');
    }
}
