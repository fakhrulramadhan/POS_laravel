import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
// navbar = list menu di atas

const NavbarBackend = () => {
    // ambil dari propertirs inertia js (controller)
    const { auth } = usePage().props;
    
    const logoutHandler = async (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    return (
        <nav className="navbar top-bar navbar-light py-2 py-xl-3">
            <div className="container-fluid px-4">
                <div className="d-flex align-items-center w-100">
                    {/* Tampilan Logo untuk layar kecil */}
                    <div className="d-flex align-items-center d-xl-none">
                        <Link className="navbar-brand" href="/">
                            <div className="d-flex align-items-center gap-2">
                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: 34, height: 34 }}>
                                    <i className="bi bi-shop text-white small"></i>
                                </div>
                                <span className="navbar-brand-item h5 text-primary mb-0 fw-bold">
                                    AkuPos
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="navbar-expand-xl sidebar-offcanvas-menu">
                        <button
                            className="navbar-toggler me-auto border-0"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasSidebar"
                            aria-controls="offcanvasSidebar"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                            data-bs-auto-close="outside"
                        >
                            <i className="bi bi-text-right fa-fw h3 lh-0 mb-0 rtl-flip text-primary"></i>
                        </button>
                    </div>

                    <div className="ms-xl-auto">
                        <ul className="navbar-nav flex-row align-items-center">
                            <li className="nav-item ms-2 ms-md-3 dropdown">
                                <a 
                                    className="nav-link dropdown-toggle d-flex align-items-center px-3 py-2 rounded-3 bg-light"
                                    href="#"
                                    id="profileDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                                        style={{ width: 32, height: 32 }}>
                                        <span className="text-white small fw-bold">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="fw-semibold me-1 d-none d-md-inline">
                                        {auth.user.name}
                                    </span>
                                    <i className="bi bi-chevron-down small"></i>
                                </a>
                                <ul className="dropdown-menu dropdown-animation dropdown-menu-end shadow border-0 pt-3 rounded-3"
                                aria-labelledby="profileDropdown"
                                >
                                    <li className="px-3 pb-2">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: 44, height: 44 }}>
                                                <span className="text-white fw-bold fs-5">
                                                    {auth.user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="fw-bold d-block">
                                                    {auth.user.name}
                                                </span>
                                                <small className="text-muted">
                                                    {auth.user.email}
                                                </small>
                                            </div>
                                        </div>
                                    </li>
                                    <li><hr className="dropdown-divider my-1"/></li>

                                    <li>
                                        <a
                                        className="dropdown-item py-2 px-3 text-danger-hover"
                                        href="#"
                                        onClick={logoutHandler}
                                        >
                                            <i className="bi bi-power fa-fw me-2"></i>
                                            Keluar
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavbarBackend;