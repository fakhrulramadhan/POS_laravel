<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\StockTotal;
use App\Models\Supplier;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * hampir sama seperti index lagi invoke
     */

    public function __invoke(Request $request)
    {
        // statistik utama

        // mengambil data yang kondisi status trx nya sukses, sekaligus total ke
        // dalam rupiah jumlah transaksinya
        $totalSales = Transaction::where('status', 'success')->sum('total_amount');
        $totalTransactions = Transaction::count();
        $totalCustomers = Customer::count();
        $totalSuppliers = Supplier::where('status', 'active')->count();

        // total transaksi per status
        $transactionData = Transaction::select('status', DB::raw('COUNT(*) as count'))
          ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // penjualan per tanggal (status success)
        $salesData = Transaction::whereIn('status', ['success'])
          ->select(
            DB::raw('DATE(transaction_date) as date'),
            DB::raw('SUM(total_amount) as total')
          )
          ->groupBy('date')
          ->orderBy('date')
          ->get();

        //   5 produk terlaris
        $productsData = TransactionDetail::with('product')
            ->select('product_id', DB::raw('SUM(quantity) as total_quantity'))
            ->groupBy('product_id')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get()
            // detail ambil data dari tabel trx detail
            ->map(function ($detail) {
                return [
                    'nama' => $detail->product->name ?? 'Unknown',
                    'total_quantity' => $detail->total_quantity
                ];
            });
    
            $stockTotals = StockTotal::with('product.category')->get();

            // total stok per kategori (tabel stock_totals)
            // ambil data produk berdasarkan kategori grup nya
            $groupedByCategory = $stockTotals->groupBy(fn ($item) => optional($item->product->category)->name);

            $categoryData = $groupedByCategory->map(fn($items, $cat) => [
                'category' => $cat,
                'total_stock' => $items->sum('total_stock')
            ])->values(); //values utk menampilkan total nilainya

        // kirim data ke inertia ke view dashboard index.jsx
        return Inertia::render('Admin/Dashboard/Index', [
            // stats untuk statistik
            'stats' => [
                'totalSales' => $totalSales,
                'totalTransactions' => $totalTransactions,
                'totalCustomers' => $totalCustomers,
                'totalSuppliers' => $totalSuppliers
            ],
            'transactionData' => $transactionData,
            'salesData' => $salesData,
            'productsData' => $productsData,
            'categoryData' => $categoryData
        ]);
    }
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
    public function edit(string $id)
    {
        //
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
    public function destroy(string $id)
    {
        //
    }
}
