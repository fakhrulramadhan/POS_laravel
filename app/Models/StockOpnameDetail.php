<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockOpnameDetail extends Model
{
    //
    protected $guarded = [];

    // satu stok opname bisa banyak produk (one to many)
    public function product() {
        return $this->belongsTo(Product::class);
    }

    // stock total berdasarkan masing" id produknya
    public function stockTotal() {
        return $this->belongsTo(StockTotal::class, 'product_id', 'product_id');
    }
}
