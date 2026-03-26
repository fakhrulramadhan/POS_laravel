<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //mencari role admin terlebih dahulu
        $adminRole = Role::where('name', 'admin')->first();

        // jika role admin belum ada, buat role baru admin
        if (!$adminRole) {
            # code...
            $adminRole = Role::create(['name' => 'admin']);
        }

        // ambil semua izin yang ada
        $allPermissions = Permission::all();

        // assign all permissions to admin role
        $adminRole->syncPermissions($allPermissions);

        // buat user administrator atau ambil user yang sudah ada
        $user = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [   'name' => 'Administrator',
                'password' => bcrypt('password')
            ]
        );

        // assign role admin ke user
        $user->assignRole($adminRole);
    }
}
