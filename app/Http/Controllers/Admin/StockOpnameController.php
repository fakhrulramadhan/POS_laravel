<?php

namespace App\Http\Controllers\Admin;

use App\Exports\StockOpnameExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\StockOpnameRequest;
use App\Models\Product;
use App\Models\StockOpname;
use App\Models\StockTotal;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class StockOpnameController extends Controller
{
    //stock opname dilakukan secara langsung cek ke gudangnya
    public function index() {
        // ambil data stock terbaru (terakhir) dan paginate 10 data per halaman
        $stockOpnames = StockOpname::latest()->paginate(10);

        // lempar datanya ke view inertia
        return inertia('Admin/StockOpnames/Index', [
            'stockOpnames' => $stockOpnames
        ]);
    }

    public function create() {

       //ambil semua produk untuk dipilih dalam form
       $products = Product::all();

    //    lempar datanya ke view inertia
        return inertia('Admin/StockOpnames/Create', [
            'products' => $products
        ]);
    }

    public function store(StockOpnameRequest $request) {

        // validasi data input melalu request
        $validatedData = $request->validated();

        // ubah format tanggal ke Y-m-d
        $opnameDate = Carbon::parse($validatedData['opname_date'])->format('Y-m-d');

        // buat record (data baru) stock opname (header)
        $stockOpname = StockOpname::create([
            'opname_date' => $opnameDate,
            'status' => 'pending'
        ]);

        // simpan detail setiap produk yang diopname pakai foreach
        foreach ($validatedData['products'] as $productData) {
            // lupa pakai first sehingga datanya belum keambil
            // ambil data yang pertama pakai first()
           $stockTotal = StockTotal::where('product_id', $productData['product_id'])->first();

        //    jika tidak ada product_id yg sesuai dari stock total maka ambil nama produk 
        // dari tabel products
        if (!$stockTotal) {
              // Ambil nama produk dari tabel `products`
              $productName = Product::find($productData['product_id'])?->name ?? 'Produk tidak ditemukan';
            
            //   munculkan pesan error
            return redirect()->back()->withErrors([
                'products' => 'Stok untuk produk "' . $productName .'" tidak ditemukan. '
            ]);
          }

         //   hitung selisih antara stok fisik dengan stok total
            $quantityDifference = $productData['physical_quantity'] - $stockTotal->total_stock;

            // buat (create data) detail stock opname
            $stockOpname->details()->create([
                'product_id' => $productData['product_id'],
                'stock_total_id' => $stockTotal->id,
                'physical_quantity' => $productData['physical_quantity'],
                'quantity_difference' => $quantityDifference
            ]);
        }

        // kembali ke daftar stock opname
        return redirect()->route('admin.stock-opnames.index');
    }

    public function edit($id) {

    // ambil stock opname beserta detail, produk, dan stok total terkait
        $stockOpname = StockOpname::with(['details.product', 'details.stockTotal'])->findOrFail($id);

        // ambil semua data produk
        $products = Product::all();

        // kirim data ke view inertia
        return inertia('Admin/StockOpnames/Edit', [
            'stockOpname' => $stockOpname,
            'products' => $products
        ]);
    }

    public function update(StockOpnameRequest $request, StockOpname $stockOpname) {

        // validasi input
        $validatedData = $request->validated();

        // format tanggal opname
        $opnameDate = Carbon::parse($validatedData['opname_date'])->format('Y-m-d');

        // update bagian header stock opname (tanggal dan status)
        $stockOpname->update([
            'opname_date' => $opnameDate,
            'status' => $validatedData['status']
        ]);

        // hapus detail lama, (cara updatenya haeus dihapus dulu dari detailnya baru create baru lagi)
        $stockOpname->details()->delete();

        // simpan detail baru  setiap produk yang diopname pakai foreach
        foreach ($validatedData['products'] as $productData ) {
            $stockTotal = StockTotal::where('product_id', $productData['product_id'])->first();
       
            // jika stok total tidak ditemukan, kembali dengan error
            if (!$stockTotal) {
                return redirect()->back()->withErrors([
                    'products' => 'Stok produk dengan ID ' . $productData['product_id'] . 'tidak ditemukan'
                ]);
            }

            // hitung selisih antara stok fisik dengan stok total
            $quantityDifference = $productData['physical_quantity'] - $stockTotal->total_stock;

            // buat record detail baru
            $stockOpname->details()->create([
                'product_id' => $productData['product_id'],
                'stock_total_id' => $stockTotal->id,
                'physical_quantity' => $productData['physical_quantity'],
                'quantity_difference' => $quantityDifference
            ]);
        }

        // kembali ke daftar stock opname
        return redirect()->route('admin.stock-opnames.index');
    }

    public function show(StockOpname $stockOpname) {

        // muat detail produk dan stok total yang terkait
        $stockOpname->load('details.product', 'details.stockTotal');

        // kirim data ke inertia
        return inertia('Admin/StockOpnames/Show', [
            'stockOpname' => $stockOpname
        ]);
    }

    // export berdasarkan id stock opname
    public function export($id) {

        $stockOpname = StockOpname::with(['details.product', 'details.stockTotal'])->findOrFail($id);
        $export = new StockOpnameExport([$stockOpname]); //membungkus dalam array jika diperlukan

        return Excel::download($export, 'stock_opname_' . $id . '.xlsx');
    }
}
