<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // tampilkan daftar kategori
    public function index () {

        // ambil data kategori. jika ada param pencarian q, maka lakukan pencarian berdasarkan nama
        $categories = Category::when(request()->q, function($query) {
            $query->where('name', 'like', '%' . request()->q . '%');
        })->latest()->paginate(10); //1 page 10 data

        // sertakan query string q dalam link navigasi
        $categories->appends(['q' => request()->q]);

        // lempar data ke inertia
        return inertia('Admin/Categories/Index', [
            'categories' => $categories
        ]);
    }
    
    public function create() {

        // kembalikan ke view create inertia
        return inertia('Admin/Categories/Create');
    }

    public function store(CategoryRequest $request) {

        // buat kategori baru berdasarkan input yg sudah divalidasi
        Category::create($request->validated());

        // arahkan ke index
        return redirect()->route('admin.categories.index')->with('success', 'Categpry created successfully');
   
    }

    public function edit($id) {

         // ambil data kategori ke inertia
        $category = Category::findOrFail($id);

        return inertia('Admin/Categories/Edit', [
            'category' => $category
        ]);
    }

    public function update(CategoryRequest $request, Category $category) {

            // update kategori dengan data yg sudah divalidasi
            $category->update($request->validated());

            // arahkan ke index
            return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully');
    }

    public function destroy($id) {

        // ambil category berdasarkan id, error jika tidak ditemukan
        $category = Category::findOrFail($id);

        // hapus kategori
        $category->delete();

        // arahkan ke index lagi
        return redirect()->route('admin.categories.index');
    }
}
