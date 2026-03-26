<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Inertia::render('Admin/Report/Index', [
            'transactions' => []
        ]);
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
    public function generate(Request $request)
    {
        // validasi input agar start_date dan end_date benar (didapat dari inputan form)
         $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        // menambahkan jam 00:00 ke start_date dan 23:59:59 ke end_date
        $startDateTime = $request->start_date . ' 00:00:00';
        $endDateTime = $request->end_date . ' 23:59:59';

        // tampilkan halaman dengan data transactions berdasarkan tanggal yang dipilih
        return Inertia::render('Admin/Report/Index', [
            'transactions' => Inertia::defer(function() use ($startDateTime, $endDateTime) {
                return Transaction::with(['customer'])
                    ->withSum('transactionDetails as total_quantity', 'quantity')
                    ->whereBetween('transaction_date', [$startDateTime, $endDateTime])
                    ->orderBy('transaction_date', 'desc')
                    ->get();
            }),
            'start_date' => $request->start_date, //bawa data start date ke index page
            'end_date' => $request->end_date
        ]);
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
