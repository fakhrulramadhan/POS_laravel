<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductStockController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\StockOpnameController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\UnitController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Route::inertia('/home', 'Home');

Route::redirect('/login', '/');

Route::middleware('guest')->group(function() {
    Route::get('/', [LoginController::class, 'index'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
});

// [nama controller, nama fungsi]
Route::post('/logout', [LogoutController::class, '__invoke'])->name('logout');

// hanya adamin yg bisa akses menu" ini
Route::prefix('admin')->middleware(['auth'])->name('admin.')->group(function () {
    Route::get('/dashboard',[DashboardController::class, '__invoke'])->name('dashboard')->middleware('permission:dashboard.index');

    $resources = [
        'roles' => [
            'controller' => RoleController::class,
            'permissions' => 'roles.index|roles.create|roles.edit|roles.delete',
            'name' => 'roles'
        ],
        'users' => [
            'controller' => UserController::class,
            'permissions' => 'users.index|users.create|users.edit|users.delete',
            'name' => 'users'
        ],
        'suppliers' => [
            'controller' => SupplierController::class,
            'permissions' => 'suppliers.index|suppliers.create|suppliers.edit|suppliers.delete',
            'name' => 'suppliers'
        ],

        'customers' => [
            'controller' => CustomerController::class,
            'permissions' => 'customers.index|customers.create|customers.edit|customers.delete',
            'name' => 'customers'
        ],
        'categories' => [
            'controller' => CategoryController::class,
            'permissions' => 'categories.index|categories.create|categories.edit|categories.delete',
            'name' => 'categories'
        ],
        'units' => [
            'controller' => UnitController::class,
            'permissions' => 'units.index|units.create|units.edit|units.delete',
            'name' => 'units' 
        ],
        'products' => [
            'controller' => ProductController::class,
            'permissions' => 'products.index|products.create|products.edit|products.delete',
            'name' => 'products'
        ],
        // enggak bisa edit karena takut ada manipulasi
        'stocks' => [
            'controller' => ProductStockController::class,
            'permissions' => 'stocks.index|stocks.create|stocks.delete',
            'name' => 'stocks'
        ],
        // stock opname tidak ada fitur hapus
        'stock-opnames' =>[
            'controller' => StockOpnameController::class,
            'permissions' => 'stock-opnames.index|stock-opnames.create|stock-opnames.edit|stock-opnames.show',
            'name' => 'stock-opnames'
        ]
    ];

    foreach ($resources as $name => $resource) {
      
        $route = Route::resource($name, $resource['controller'])->middleware("permission:{$resource['permissions']}");

        // jika nama resource ada di db, maka daftarkan ke route list
        if (isset($resource['names'])) {
            $route->names($resource['names']);
        }
    }

    // khusus untuk akun yang rolenya sales yang bisa login
    Route::prefix('sales')->name('sales.')->middleware('permission:transactions.index')->group(function() {
        Route::get('/', [TransactionController::class, 'index'])->name('index');
        Route::post('/add-product', [TransactionController::class, 'addProductToCart'])->name('add-product');
        Route::delete('/delete-from-cart/{id}', [TransactionController::class, 'deleteFromCart'])->name('delete-from-cart');
        Route::post('/process-payment', [TransactionController::class, 'processPayment'])->name('process-payment');
        Route::post('/get-snap-token', [TransactionController::class, 'getSnapToken'])->name('get-snap-token');
    });

    //url utk report
    Route::prefix('report')->name('report.')->middleware('permission:reports.index')->group(function() {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('/generate', [ReportController::class, 'generate'])->name('generate');
    });

    Route::get('/get-cities/{provinceId}', [SupplierController::class, 'getCitiesByProvince'])->name('get-cities')->middleware('permission:suppliers.index');

    Route::get('/stock-opnames/{id}/export', [StockOpnameController::class, 'export'])->name('stock-opnames.export');
});