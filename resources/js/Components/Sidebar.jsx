import React from "react"
import { Link, usePage } from "@inertiajs/react"
import NavItem from "../Components/NavItem"
import hasAnyPermission from "../utils/hasAnyPermission"

const Sidebar = () => {
    const { currentStore } = usePage().props

    return (
        <nav
            className="navbar sidebar navbar-expand-xl navbar-dark bg-dark"
            style={{ overflowY: "auto" }}
        >
            <div className="d-flex flex-column align-items-center p-3 w-100">
                {/* Logo / Brand */}
                <Link className="navbar-brand text-center" href="/">
                    <div className="d-flex align-items-center gap-2">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 40, height: 40 }}>
                            <i className="bi bi-shop text-white fs-5"></i>
                        </div>
                        <span className="navbar-brand-item h5 text-white mb-0 fw-bold">
                            AkuPos
                        </span>
                    </div>
                </Link>

                {/* Nama Store */}
                {currentStore && (
                    <div className="d-flex align-items-center justify-content-center text-white w-100 rounded-3 p-2 mt-2"
                        style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                        <i className="bi bi-shop-window fs-6 me-2 text-primary"></i>
                        <span className="small fw-semibold">{currentStore.name}</span>
                    </div>
                )}
            </div>

            <div
                className="offcanvas offcanvas-start flex-row custom-scrollbar h-100 bg-dark"
                data-bs-backdrop="true"
                tabIndex="-1"
                id="offcanvasSidebar"
            >
                <div className="offcanvas-body sidebar-content d-flex flex-column pt-0">
                    <ul className="navbar-nav flex-column" id="navbar-sidebar">
                        {/* Dashboard Section */}
                        <li className="nav-item mt-2 mb-1 text-muted small px-3">Dashboard</li>
                        {hasAnyPermission(["dashboard.index"]) && (
                            <NavItem
                                href="/admin/dashboard"
                                icon="bi-house-door"
                                label="Dashboard"
                            />
                        )}

                        {/* Management User Section */}
                        {hasAnyPermission(["roles.index"]) && (
                            <>
                                <li className="nav-item mt-2 mb-1 text-muted small px-3">Management User</li>
                                <NavItem
                                    href="/admin/roles"
                                    icon="bi-shield-lock"
                                    label="Roles"
                                />
                            </>
                        )}
                        {hasAnyPermission(["users.index"]) && (
                            <NavItem
                                href="/admin/users"
                                icon="bi-person"
                                label="Users"
                            />
                        )}

                        {/* Data Management Section */}
                        {hasAnyPermission(["warehouses.index"]) && (
                            <>
                                <li className="nav-item mt-2 mb-1 text-muted small px-3">Data Management</li>
                                <NavItem
                                    href="/admin/warehouses"
                                    icon="bi-building"
                                    label="Warehouses"
                                />
                            </>
                        )}
                        {hasAnyPermission(["stores.index"]) && (
                            <NavItem
                                href="/admin/stores"
                                icon="bi-shop"
                                label="Stores"
                            />
                        )}
                        {hasAnyPermission(["profiles.index"]) && (
                            <NavItem
                                href="/admin/profile-store"
                                icon="bi-file-person"
                                label="Profile Store"
                            />
                        )}
                        {hasAnyPermission(["suppliers.index"]) && (
                            <NavItem
                                href="/admin/suppliers"
                                icon="bi-truck"
                                label="Suppliers"
                            />
                        )}
                        {hasAnyPermission(["customers.index"]) && (
                            <NavItem
                                href="/admin/customers"
                                icon="bi-people"
                                label="Customers"
                            />
                        )}
                        {hasAnyPermission(["categories.index"]) && (
                            <NavItem
                                href="/admin/categories"
                                icon="bi-list-ul"
                                label="Categories"
                            />
                        )}
                        {hasAnyPermission(["units.index"]) && (
                            <NavItem
                                href="/admin/units"
                                icon="bi-rulers"
                                label="Units"
                            />
                        )}
                        {hasAnyPermission(["products.index"]) && (
                            <NavItem
                                href="/admin/products"
                                icon="bi-box"
                                label="Products"
                            />
                        )}

                        {hasAnyPermission(["purchaseorders.index"]) && (
                            <NavItem href="/admin/po" icon="bi-cart" label="Purchase Order" />
                        )}
                        {hasAnyPermission(["stocks.index"]) && (
                            <NavItem
                                href="/admin/stocks"
                                icon="bi-box-seam"
                                label="Stock In"
                            />
                        )}

                        {/* Transactions Section */}
                        {hasAnyPermission(["transactions.index"]) && (
                            <>
                                <li className="nav-item mt-2 mb-1 text-muted small px-3">Transactions</li>
                                {hasAnyPermission(["transactions.index"]) && (
                                    <NavItem
                                        href="/admin/sales"
                                        icon="bi-cash"
                                        label="Sales"
                                    />
                                )}
                            </>
                        )}
                        {/* Reports Section */}
                        {hasAnyPermission(["reports.index"]) && (
                            <>
                                <li className="nav-item mt-2 mb-1 text-muted small px-3">Reports</li>
                                <NavItem
                                    href="/admin/report"
                                    icon="bi-clipboard-data"
                                    label="Reports"
                                />
                            </>
                        )}
                        {hasAnyPermission(["profits.index"]) && (
                            <NavItem
                                href="/admin/profit"
                                icon="bi-bar-chart"
                                label="Profits"
                            />
                        )}
                        {hasAnyPermission(["stock-opnames.index"]) && (
                            <NavItem
                                href="/admin/stock-opnames"
                                icon="bi-journal-check"
                                label="Stock Opnames"
                            />
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Sidebar
