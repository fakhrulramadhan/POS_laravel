<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
    //
    protected $guarded = [];

    // one to many, 1 Trans detail bisa banyak produk
    public function product() {
        return $this->belongsTo(Product::class);
    }
}
