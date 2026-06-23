import React from "react";
import { Link, usePage } from "@inertiajs/react";
// buat reusable component NavItem (reusable widget di flutter) untuk navigasi masing
// masing menu

const NavItem = ({href, icon, label, labelClass =  "", children}) => {
    const {url} = usePage();
    const isActive = url.startsWith(href);

    return (
        <li className="nav-item">
            <a href={href}
                className={`nav-link d-flex align-items-center rounded ${isActive ? "active" : ""}`}
            >
                <i className={`bi ${icon} fa-fw me-3 ${labelClass}`} style={{ fontSize: '1.1rem' }}/>
                <span>{label}</span>
            </a>
            {children && <ul className="nav flex-column ms-3">{children}</ul>}
        </li>
    );
};

// agar bisa diakses dari luar file pakai export
export default NavItem;