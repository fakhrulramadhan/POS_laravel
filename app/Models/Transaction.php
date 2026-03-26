<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Transaction extends Model
{
    //
    protected $guarded = [];

    // relasi dengan model customer
    public function customer() {
        return $this->belongsTo(Customer::class);
    }

    // one to many
    public function transactionDetails() {
        return $this->hasMany(TransactionDetail::class);
    }

    // event boot(pada saat awal model diload) untuk logika tambahan saat model di create
    protected static function boot()
    {
        parent::boot();

        // menambhakna logika khusus pada saat transaksi dibuat
        static::creating(function ($transaction) {

            // menghasilkan no invoice dengan format 'INV-xxxxxx, atur logicnya di models
            $transaction->invoice = 'INV-' . now()->format('YmdHis') . '-' . strtoupper(Str::random(5));

            // menetapkan tanngal transaksi jika belum diisi
            if (empty($transaction->transaction_date)) {
                # code...
                $transaction->transaction_date = Carbon::now();
            }
        });
    }
}
