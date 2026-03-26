<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    //
    protected $guarded = [];

    // berelasi ke tabel product, satu keranjang bisa banyak produk
    public function product() {
        return $this->belongsTo(Product::class);
    }
}
