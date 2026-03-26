<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\ProductStockRequest;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockProduct;
use App\Models\StockTotal;
use App\Models\Supplier;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductStockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // ambil data stock product beserta relasi product dan supplier
        // jika ada pencarian q, filter berdasarkan nama supplier
        $productStocks = StockProduct::with(['product', 'supplier'])
         ->when(request()->q , function ($query) {
              $query->whereHas('supplier', function ($q) {
                   $q->where('name', 'like', '%' . request()->q . '%');
              });
         })
         ->latest()
         ->paginate(10);

        //  ambil semua supplier untuk dropdown
        $suppliers = Supplier::all();

        // sertakan param pencarian q di link paginasi
        $productStocks->appends(['q' => request()->q]);

        // kembalikan ke view inertia
        return inertia('Admin/ProductStocks/Index', [
            'productStocks' => $productStocks,
            'suppliers' => $suppliers
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //ambil semua produk  
        $products = Product::with('stockTotal')->get();
        $suppliers = Supplier::all();

        // lempar data ke inertia
        return inertia('Admin/ProductStocks/Create', [
            'products' => $products,
            'suppliers' => $suppliers
        ]);
    }

    /**
     * Store a newly created resource in storage., pantesan enggak kesimpan, nama requestnya blm dimasukkin
     */
    public function store(ProductStockRequest $request)
    {
        //Mulai transaksi database
        DB::beginTransaction();

        try {
            //buat record stock prodcuct baru berdasarkan data yang divalidasi
            $stockProduct = StockProduct::create($request->validated());

            // cari atau buat stock total untuk produk terkait
            $stockTotal = StockTotal::firstOrCreate(
                ['product_id' => $stockProduct->product_id],
                ['total_stock' => 0]
            );

            // tambahkan stok sesuai quantity yang diterima
            $stockTotal->total_stock += $stockProduct->stock_quantity;
            $stockTotal->save();

            // commit transaksi jika semua operasi berhasil
            DB::commit();

            //  kembali ke halaman index stock produk
            return redirect()->route('admin.stocks.index');
        } catch (Exception $th) {
            //throw $th;
            DB::rollBack();

            // kembali ke daftar product stock dengan pesan error
            return redirect()->route('admin.stocks.index');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id) {

    // ambil produk based id
        $productStock = StockProduct::findOrFail($id);
       $products = Product::with('stockTotal')->get();
        $suppliers = Supplier::all();

        // kirim data ke view inertia
        return inertia('Admin/ProductStocks/Edit', [
            'productStock' => $productStock,
            'products' => $products,
            'suppliers' => $suppliers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Mulai transaksi database untuk memastikan konsistensi data
        DB::beginTransaction();

        try {
            //cari stock product berdasarkan ID yang diberikan, akan melemparkan 
            // model not found exception
            $stockProduct = StockProduct::findOrFail($id);

            // cari stock total yang terkait dengan product_id dari stock product 
            $stockTotal = StockTotal::where('product_id', $stockProduct->product_id)->first();

            if ($stockTotal) {
                # kurangi total_stock dengan stock_quantity dari stockProduct yang akan dihapus
            //   $stockTotal->total_stock =   $stockTotal->total_stock -  $stockProduct->stock_quantity
                $stockTotal->total_stock -= $stockProduct->stock_quantity;

                // pastikan total_stock tidak menjadi negatif
                if ($stockTotal->total_stock < 0) {
                    $stockTotal->total_stock = 0;
                }

                // simpan perubahan pada stockTotal
                $stockTotal->save();
            }

            // hapus record stockProduct dari database
            $stockProduct->delete();

            // commit transaksi jika semua operasi berhasil
            DB::commit();

            return redirect()->route('admin.stocks.index');

        } catch (Exception $e) {
            //Rollback transaksi jika terjadi kesalahan
            DB::rollBack();

            // kembali ke index
            return redirect()->route('admin.stocks.index');
        }
    }
}
