<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\SupplierRequest;
use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Province;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    //nanti belajar race conditions di backend
    public function index()  {
        
        // ambil data supplier dengan fitur pencarian berdasarkan nama jika ada query 'q' (dari kotak pencarian)
        $suppliers = Supplier::when(request()->q, function($suppliers) {
            return $suppliers->where('name', 'like', '%' . request()->q . '%');
        })->latest()->paginate(5); //urutkan berdasarkan yang terbaru (paling akhir) dan paginate 5 data per halaman
    
        // sertakan query string q dalam link paginasi
        $suppliers->appends(['q' => request()->q]);

        // kembalikan data ke inertia
        return inertia("Admin/Suppliers/Index", [
            'suppliers' => $suppliers
        ]);
    }

    // utk tambah supplier baru
     public function create()  {
        
        // ambil semua provinsi untuk dropdown
        $provinces = Province::all();

        // inisialisasi array kota kosong
        $cities = [];

        // kembalikan data ke inertia
        return inertia("Admin/Suppliers/Create", [
            'provinces' => $provinces,
            'cities' => $cities
        ]);
    }

    // simpan data supplier baru ke db
     public function store(SupplierRequest $request)  {
        // buat supplier baru yang telah divalidasi
        Supplier::create($request->validated());

        // arahkan kembali ke daftar supplier
        return redirect()->route('admin.suppliers.index');
    }

    // menampilkan data yang mau diedit based id
     public function edit($id)  {
        // cari supplier based id, error jika tidak ditemukan
        $supplier = Supplier::findOrFail($id);

        // ambil semua data provinsi
        $provinces = Province::all();

        // ambil kota berdasatkan provinsi supplier saat ini
        $cities = City::where('province_id', $supplier->province_id)->get();

        // kembalikan data ke inertia
        return inertia('Admin/Suppliers/Edit', [
            'supplier' => $supplier,
            'provinces' => $provinces,
            'cities' => $cities
        ]);
    }

     public function update(SupplierRequest $request, Supplier $supplier)  {
        // perbarui data supplier dengan data yg sudah divblidasi
        $supplier->update($request->validated());

        // arahkan ke index supplier
        return redirect()->route('admin.suppliers.index');
    }

     public function destroy($id)  {
        
        // cari supplier berdasarkan id, error jika tidak ditemukan
        $supplier = Supplier::findOrFail($id);

        // hapus supplier dari db
        $supplier->delete();

        // arahkan ke index supplier
        return redirect()->route('admin.suppliers.index');
    }

    // ambil dagtar kota berdarkan id provinsi
    public function getCitiesByProvince($provinceId) {
        // ambil semua kota yg berasa di provinsi tertentu
        $cities = City::where('province_id', $provinceId)->get();

        // kembalikan data kota ke format json
        return response()->json($cities);
    }
}
