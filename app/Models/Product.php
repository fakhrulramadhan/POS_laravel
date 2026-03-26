<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    protected $guarded = [];

    // Relasi ke model category
    // satu produk hanya memiliki satu kategori
    public function category() {
        return $this->belongsTo(Category::class);
    }

     // Relasi ke model stock total
    // satu produk hanya memiliki satu total stok
    public function stockTotal() {
        return $this->hasOne(StockTotal::class);
    }

    /* 
        Aksesors untuk mendapatkan url gambar produk
    */
    public function image(): Attribute {

         return Attribute::make(
            get: fn($image) => url('/storage/products/' . $image)
         );
    }
}
