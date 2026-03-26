<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\RoleRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $user = auth()->user();
        // $hiddenForNonAdmin = ['admin'];

        // // muncul rolenya kalau yang selain admin (kode yang v2)
        // $roles = Role::with('permissions')
        //         ->when($user->hasRole('admin'), function ($query) use ($hiddenForNonAdmin) {
        //             $query->whereNotIn('name', $hiddenForNonAdmin);
        //         })
        //         ->latest()
        //         ->paginate(10);

        // return inertia('Admin/Roles.Index', [
        //     'roles' => $roles, 
        //     'isAdmin' => $user->hasRole('admin')
        // ]);

        // kode awalnya
        //ambil semua role beserta relasi permissionsnya, urutkan dari terbaru dan paginate
        $roles = Role::with('permissions')
            ->latest()
            ->paginate(10);

        //kembalikan data ke view inertia, Admin/Roles/Index 
        return inertia('Admin/Roles/Index', compact('roles'));;    
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // ambil semua permissions
        $permissions = Permission::all();

        // kembalikan ke view inertia Admin/Roles/Create
        return inertia('Admin/Roles/Create', [
            'permissions' => $permissions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
        // validasi data input melalui role request 
        $validatedData = $request->validated();

        // periksa apakah role dengan nama yang sama sudah ada
        if (Role::where('name', $validatedData['name'])->exists()) {
            # Kembalikan response dengan pesan error spesifik
            return redirect()->back()->withErrors([
                'name' => 'A Role admin already exists'
            ])->withInput();
        }

        // buat role baru dengan data yang sudah divalidasi
        $role = Role::create($validatedData);

        // tetapkan permissions pada rola yang baru dibuat
        $role->syncPermissions($request->input('permissions'));

        // jika berhasil simpan, arahkan dengan pesan sukses, jika gagal dengan pesan error
        if ($role) {
            return redirect()->route('admin.roles.index')->with(['success' => 'Data Berhasil Disimpan']);
        } else {
            return redirect()->route('admin.roles.index')->with(['error' => 'Data Gagal Disimpan']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        // Ambil semua permissions, diurutkan dari yang terbaru
        $permissions = Permission::latest()->get();

        // ambil id dari permissions yang dimiliki oleh role saat ini 
        $rolePermissions = $role->permissions->pluck('id')->toArray();

        // map permissions agar hanya menyertakan id dan name saja
        $permissions = $permissions->map(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name
            ];
        });

        // kembalikan ke view inertia Admin/Roles/Edit
        return inertia('Admin/Roles/Edit', [
            'permissions' => $permissions,
            'role' => $role,
            'rolePermissions' => $rolePermissions
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, Role $role)
    {
        //update data role dengan data yang telah divalidasi
        $role->name = $request->name;

        // sync permissions 
        $role->permissions()->sync($request->permissions);

        // simpan perubahan 
        $role->save();

        // arahkan kembali ke daftar role
        return redirect()->route('admin.roles.index')->with('success', 'Role updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // cari role berdasarkan id, error jika tidak ditemukan
        $role = Role::findOrFail($id);

        // hapus role dari db
        $role->delete();

        // arahkan ke index dengan pesan
        return redirect()->route('admin.roles.index')->with('message', 'Role deleted successfully.');
    }
}
