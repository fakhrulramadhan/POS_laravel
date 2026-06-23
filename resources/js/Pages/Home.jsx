import React from "react";
import { Link } from "@inertiajs/react";

export default function Home() {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #5143d9 0%, #2d1f8e 100%)' }}>
            <div className="text-center text-white p-5">
                <div className="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                    style={{ width: 100, height: 100, backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <i className="bi bi-shop" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h1 className="fw-bold mb-3">AkuPos</h1>
                <p className="lead mb-4 opacity-75">Point of Sale Management System</p>
                <Link href="/login" className="btn btn-light btn-lg px-5 py-3 fw-semibold rounded-pill">
                    Masuk ke Aplikasi
                </Link>
            </div>
        </div>
    );
}