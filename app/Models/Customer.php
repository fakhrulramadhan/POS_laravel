<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    //karena login berhubungan dengan tabel user, maka pakai hasfactory
    use HasFactory;

    protected $guarded = [];
}
