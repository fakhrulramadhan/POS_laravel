import React from "react"
import { Link, usePage } from "@inertiajs/react"
import NavItem from "../Components/NavItem"
import hasAnyPermission from "../utils/hasAnyPermission"

const Sidebar = () => {
    const { currentStore } = usePage().props

    return (
        <nav
            className="navbar sidebar navbar-expand-xl navbar-light bg-dark text-white"
            style={{ overflowY: "auto" }}
        >
            <div className="d-flex flex-column align-items-center p-3">
                {/* Logo / Brand */}
                <Link className="navbar-brand text-center" href="/">
                    <span className="navbar-brand-item h5 text-primary mb-0">
                        EasyPOS
                    </span>
                </Link>

                {/* Nama Store */}
                {currentStore && (
                    <div className="d-flex flex-column align-items-center justify-content-center text-white w-100 rounded-3 shadow">
                        <i className="bi bi-shop-window fs-3 mb-2"></i>
                        <span className="fs-5 fw-semibold">Store: {currentStore.name}</span>
                    </div>
                )}
            </div>

            <div
                className="offcanvas offcanvas-start flex-row custom-scrollbar h-100 bg-dark"
                data-bs-backdrop="true"
                tabIndex="-1"
                id="offcanvasSidebar"
            >
                <div className="offcanvas-body  sidebar-content d-flex flex-column">
                    <ul className="navbar-nav flex-column " id="navbar-sidebar">
                        {/* Dashboard Section */}
                        <li className="nav-item mt-3 mb-1 text-muted">Dashboard</li>
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

                                <li className="nav-item mt-3 mb-1  text-muted">Management User</li>

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

                                <li className="nav-item mt-3 mb-1 text-muted">Data Management</li>
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
                                <li className="nav-item mt-3 mb-1 text-muted">Transactions</li>
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
                                <li className="nav-item mt-3 mb-1 text-muted">Reports</li>
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
