<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //meload page login.jsx inertia yang ada di folder auth
        return inertia('Auth/Login');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //validasi input form login
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // ambil daya email dan password dari request
        $credentials = $request->only('email', 'password');

        // lakukan percobaan login menggunakan kredensial
        if (auth()->attempt($credentials)) {
            # Regenerate session untuk keamanan
            $request->session()->regenerate();

            // jika login berhasil, arahkan ke dashboard
            return redirect()->route('admin.dashboard');
        }

        // jika login gagal, maka tetap di halaman login
        return back()->withErrors([
            'email' => 'kredensial yang anda berikan, tidak cocok dengan data kami'
        ]);
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
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
