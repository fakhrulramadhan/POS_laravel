import { usePage } from "@inertiajs/react";

// utils, folder yang mengandung banyak fungsi utilitas library pendukung

export default function hasAnyPermission(permissions) {
    
    // mengakses data auth dari properties props inertia
    const { auth } = usePage().props;

    // menyimpan semua izin user ke dalam variable allPermissions
    const allPermissions = auth.permissions;

    // mengecek apakah ada izin dari daftar permissions yang dimiliki user
    return permissions.some(permission => allPermissions[permission]);
}