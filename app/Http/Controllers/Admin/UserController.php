<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\UserRequest;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // mengambil data user berdasarkan pencarian (jika ada)
        $users = User::when(request()->q, function($query) {
            $query->where('name', 'like', '%' . request()->q . '%');
        })->with('roles')->latest()->paginate(5);

        // menambahkan query q ke pagination links agar lonk pagination tetap menyertakan kata kunci pencarian
        $users->appends(['q' => request()->q]);

        // mengirimkan data ke komponen inertia
        return inertia('Admin/Users/Index', [
            'users' => $users
        ]);
        // return inertia('Admin/Users/Index', compact('users'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //Mengambil semua role 
        $roles = Role::all();

        // menyiapkan data role ke komponen inertia
        return inertia('Admin/Users/Create', [
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        // Membuat user baru berdasarkan data yang telah divalidasi di user request
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        // memberikan role ke user
        $user->assignRole($request->roles);

        // redirect ke index dengan pesan sukses
        return redirect()->route('admin.users.index')->with('success', 'User berhasil ditambahkan!');
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
    public function edit($id)
    {
        // edit berdasarkan id user

        // mengambil data user dan rolenya
        $user = User::with('roles')->findOrFail($id); //join ke tabel roles, jadi ambilnya pakai with
        $roles = Role::all(); //ambil semua role

        // mengirimkan data user dan roles ke komponen inertia 
        return inertia('Admin/Users/Edit', [
            'user' => $user,
            'roles' => $roles
        ]);
    }

    /**
     * Update the specified resource in storage., paramnya based request dari form dan data user 
     */
    public function update(UserRequest $request, User $user)
    {
        //menyiapkan daya yang akan diupdate dari form
        $data = [
            'name' => $request->name,
            'email' => $request->email
        ];

        // jika password diisi, maka perbarui password 
        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }

        // update data user 
        $user->update($data);

        // sinkronisasi role untuk user tersebut
        $user->syncRoles($request->roles);

        // redirect ke index dengan pesan sukses
        return redirect()->route('admin.users.index')->with('success', 'User berhasil diperbaharui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //mencari user berdasarkan id
        $user = User::findOrFail($id);

        // menghapus user
        $user->delete();

        // redirect ke index dengan pesan sukses
        return redirect()->route('admin.users.index')->with('success', 'User berhasil dihapus!');
    }
}
