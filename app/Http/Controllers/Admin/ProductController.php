<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\ProductRequest; //utk validasi produk
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Unit;
use App\Traits\ImageHandlerTrait;//trait utk handle operasi gambar
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{

    use ImageHandlerTrait;
    //
    public function index() {

        // ambil data produk beserta relasi kategori dan stocktotal
        // jika ada pencarain q dari inputan, filter berdasarkan nama produk
        // Data diurutkan berdasarkan waktu terbaru (latest) lalu dipaginasi (10 per halaman)

        $products = Product::with(['category', 'stockTotal'])
            ->when(request()->q, function ($query) {
                $query->where('name', 'like', '%' . request()->q . '%');
            })
            ->latest()
            ->paginate();

        // kirim data produck ke komponen inertia
        return inertia('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    public function create() {
        
        // ambil semua kategori dan unit dari databasw
        $categories = Category::all();
        $units = Unit::all();

        // kirim data ke view via inertia
        return inertia('Admin/Products/Create', [
            'categories' => $categories,
            'units' => $units
        ]);
    }

    public function store(ProductRequest $request) {

    // inisialisasi nama gambar sebagai null (kosong)
        $imageName = null;

        // jika ada gambar yg diupload, simpan ke folder products dan dapatkan nama filenya
        if ($request->hasFile('image')) {
            $imageName = $this->uploadImage($request->file('image'), 'products');
        }

        // buat produk baru dengan data yang sudah divalidasi, sertakan nama gambar jika ada
        Product::create(array_merge(
            $request->validated(),
            ['image' => $imageName]
        ));

        return redirect()->route('admin.products.index');
    }

    public function edit($id) {

    // ambil produk based id
        $product = Product::findOrFail($id);
        
        // ambil semua kategori dari db
        $categories = Category::all();

        // ambil semua data unit
        $units = Unit::all();

        // kirim data ke view inertia
        return inertia('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'units' => $units
        ]);
    }

    public function update(ProductRequest $request, Product $product) {

        // jika ada file gambar baru yang diunggah, perbarui gambar dan hapus gambar lama.
        if ($request->hasFile('image')) {
            $product->image = $this->updateImage($product->image, $request->file('image'), 'products');
        }

        // perbarui data produk dengan data yg diterima, product->name dari db
        $product->name = $request->name;
        $product->barcode = $request->barcode;
        $product->category_id = $request->category_id;
        $product->unit_id = $request->unit_id;
        $product->selling_price = $request->selling_price;
        $product->save(); //utk update

        // arahkan ke index kalau suskses
        return redirect()->route('admin.products.index');
    }

    public function destroy(Product $product) {

        // jika produk memiliki gambar, hapus gambar dari folder 'products' di disk 'public'
        if ($product->image) {
            Storage::disk('public')->delete('products/' . $product->image);
        }

        // hapus data produk dari database.
        $product->delete();

        // arahkan pengguna kembali ke halaman sebelumnya
        return back();
    }
}
