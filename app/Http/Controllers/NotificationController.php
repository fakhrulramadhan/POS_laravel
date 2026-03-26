<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

use function GuzzleHttp\json_decode;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function paymentNotification(Request $request)
    {
        // ambil payload dari request
        $payload = $request->getContent();
        $notification = json_decode($payload);

        // verifikasi signature utk memastikan keamanan
        $signatureKey = hash('sha512',
            $notification->order_id .
            $notification->status_code .
            $notification->gross_amount . 
            config('services.midtrans.server_key')
        );

        if ($notification->signature_key !== $signatureKey) {
            return;
        }

        // ambil data status transaksi dan tipe pembayaran
        $transactionStatus = $notification->transaction_status;
        $paymentType = $notification->payment_type;
        $orderId = $notification->order_id;

        // cari transaksi berdasarkan invoice yang sama dengan order_id
        $transaction = Transaction::where('invoice', $orderId)->first();

        if (!$transaction) {
            return;
        }

        // tentukan status transaksi berdasarkan status dari  midtrans
        switch ($transactionStatus) {
            case 'capture':
                $transaction->update([
                    'status' => 'success',
                    'payment_method' => 'online'
                ]);
                break;
            case 'settlement':
                 $transaction->update([
                    'status' => 'success',
                    'payment_method' => 'online'
                 ]);
                 break;
            case 'pending':
                $transaction->update([
                    'status' => 'pending',
                    'payment_method' => 'online'
                ]);
                break;
            case 'deny':
                $transaction->update([
                    'status' => 'failed',
                    'payment_method' => 'online'
                ]);
                break;
            case 'expire' :
                $transaction->update([
                    'status' => 'expired',
                    'payment_method' => 'online'
                ]);
                break;
            case 'cancel' :
                $transaction->update([
                    'status' => 'failed',
                    'payment_method' => 'online'
                ]);
                break;
            default:
               return;
        }
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
