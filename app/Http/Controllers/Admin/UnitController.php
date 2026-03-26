<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\UnitRequest;
use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    //
    public function index() {

        // ambil data unit dengan fitur pencarian bersasarkan nama jika ada query q
        $units = Unit::when(request()->q, function($query) {
            return $query->where('name', 'like', '%' . request()->q . '%');
        })->latest()->paginate(10);

        // sertakan query string q dalam link navigasi
        $units->appends(['q' => request()->q]);

        return inertia('Admin/Units/Index', [
            'units' => $units
        ]);
    }

    public function create() {

    //      tampilkan view inertia
        return inertia('Admin/Units/Create');
    }

    public function store(UnitRequest $request) {

        // buat unit baru berdasarkan data yang telah divalidasi
        Unit::create($request->validated());

        // arahkan kembali ke daftar unit
        return redirect()->route('admin.units.index');
    }

    public function edit($id) {

        // cari unit berdasarkan id, error jika tidak ditemukan
        $unit = Unit::findOrFail($id);

        // kembalikan data unit ke inertia
        return inertia('Admin/Units/Edit', [
            'unit' => $unit
        ]);
    }

    public function update(UnitRequest $request, Unit $unit) {

        // update data dengan data yang sudah divalidasi
        $unit->update($request->validated());

        // arahkan kembali ke daftar unit
        return redirect()->route('admin.units.index');
    }

    public function destroy($id) {

    // ambil unit based id
        $unit = Unit::findOrFail($id);

        // hapus data
        $unit->delete();

        // arahkan kembali ke index
        return redirect()->route('admin.units.index');
    }
}
