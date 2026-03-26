<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockProduct extends Model
{
    //
    protected $guarded = [];

    // satu stok produk hanya terikat dengan satu produk
    public function product() {
        return $this->belongsTo(Product::class);
    }

    // satu stok produk hanya terikat dengan satu supplier
    public function supplier() {
        return $this->belongsTo(Supplier::class);
    }
}
