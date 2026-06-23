
import { Head, usePage } from '@inertiajs/react';
import {formatRupiah} from '../../../utils/rupiah';
import AdminLayout from '../../../Layouts/AdminLayout';
import hasAnyPermission from '../../../utils/hasAnyPermission';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
const COLORS = ['#5143d9', '#0cbc87', '#f7c32e', '#ff8042', '#d6293e', '#36A2EB', '#9966FF', '#C9CBCF'];

// tadi cuma muncul 2 card karena salah di total suppliers
const TITLES = {
    totalSales: 'Total Penjualan',
    totalTransactions: 'Total Transaksi',
    totalCustomers: 'Total Customer',
    totalProducts: 'Total Produk di Stok',
    totalSuppliers: 'Total Supplier Aktif'
};

const ICONS = {
    totalSales: 'bi bi-cash-stack',
    totalTransactions: 'bi bi-receipt',
    totalCustomers: 'bi bi-people-fill',
    totalProducts: 'bi bi-box-seam',
    totalSuppliers: 'bi bi-truck'
};

// mapping antara statistik dan permission route
// tadi cuma muncul 2 card karena salah di dashboard view supplier

const STAT_PERMISSION_MAP = {
    totalSales: 'dashboard.view_sales',
    totalTransactions: 'dashboard.view_transactions',
    totalCustomers: 'dashboard.view_customers',
    totalProducts: 'dashboard.view_products',
    totalSuppliers: 'dashboard.view_supplier'
};

const isEmpty = (data) => !data || (Array.isArray(data) ? data.length === 0 : Object.keys(data).length === 0);


const CARD_BG_CLASSES = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger'];

const StatCard = ({colorClass, icon, title, value}) => {
    // Pastikan colorClass valid
    const safeColor = colorClass || 'bg-primary';
    return (
        <div className="col-xl col-md-4 col-6 mb-3">
            <div className={`card text-white h-100 p-3 stat-card ${safeColor}`}
                style={{ minHeight: '130px' }}
            >   
                <div className="d-flex align-items-start justify-content-between mb-2">
                    <div className="stat-icon me-2">
                        <i className={icon} style={{ fontSize: '1.3rem' }}/>
                    </div>
                    <div className="text-end">
                        <div className="fs-5 fw-bold mb-0">{value}</div>
                    </div>
                </div>
                <div className="mt-auto">
                    <small className="text-white-50 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>{title}</small>
                </div>
            </div>
        </div>
    );
};

const ChartCard = ({title, children, emptyMessage}) => (
    <div className="card shadow-sm h-100">
        <div className="card-header bg-white d-flex align-items-center">
            <i className="bi bi-bar-chart-fill text-primary me-2"></i>
            <h6 className="fw-semibold mb-0">{title}</h6>
        </div>
        <div className="card-body">
            {children || <div className="text-center text-muted py-5">{emptyMessage}</div>}
        </div>
    </div>
);



export default function Dashboard() {

    const {stats, transactionData, salesData, productsData, categoryData} = usePage().props;

    // ubah data status transaksi agar sesuai dengan recharts (name, value)
    const transactionStatusData = Object.entries(transactionData || {}).map(([name, value]) => ({name, value}));

    return (
        <>
            <Head>
                <title>Dashboard - AkuPos</title>
            </Head>
            <AdminLayout>
                <div className='container-fluid px-4'>
                    {/* Header */}
                    <div className="d-flex align-items-center mb-4">
                        <div className="bg-primary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center me-3"
                            style={{ width: 48, height: 48 }}>
                            <i className="bi bi-house-door-fill text-primary fs-5"></i>
                        </div>
                        <div>
                            <h4 className='fw-bold mb-0'>Dashboard</h4>
                            <small className="text-muted">Overview penjualan dan aktivitas toko</small>
                        </div>
                    </div>

                    {/* Bagian Kartu Statistik */}
                    <div className="row g-3 mb-4">
                        {Object.keys(stats).map((key, i) => {
                            const permission = STAT_PERMISSION_MAP[key];
                            // jika tidak ada izinnya, biarkan kosong
                            if (!permission) return null;
                            
                            // menampilkan kartu berdasarkan nama menunya dan hak aksesnya
                            return (
                                hasAnyPermission([permission]) && (
                                    <StatCard
                                        key={key}
                                        colorClass={CARD_BG_CLASSES[i % CARD_BG_CLASSES.length]}
                                        icon={ICONS[key] || 'bi bi-plus-circle-fill'}
                                        title={TITLES[key] || key}
                                        value={key === 'totalSales' ? formatRupiah(stats[key]) : stats[key]}
                                    />
                                )
                            );
                        })}
                    </div>

                    {/* pesan jika data transaksi kosong */}
                    {isEmpty(transactionData) && (
                        <div className="alert alert-warning d-flex align-items-center gap-2 mb-4">
                            <i className="bi bi-exclamation-triangle-fill"></i>
                            Data Transaksi kosong. Tambahkan data terlebih dahulu
                        </div>
                    )}

                    {/* Charts (Grafik) */}
                    <div className='row g-4 mb-4'>
                        {/* Chart pie: Status Transaksi */}
                        {hasAnyPermission(['dashboard.view_transactions']) && (
                            <div className="col-md-6">
                                <ChartCard title="Status Transaksi" emptyMessage="Data transaksi tidak tersedia"> 
                                    {!isEmpty(transactionData) && (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                data={transactionStatusData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                label 
                                                >
                                                {transactionStatusData.map((_, idx) => (
                                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]}/>
                                                ))}
                                                </Pie>
                                                <Tooltip/>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </div>
                        )}

                        {/*Chart Line: Penjualan dari waktu ke waktu */}
                        {hasAnyPermission(['dashboard.view_sales']) && (
                            <div className="col-md-6">
                                <ChartCard title="Penjualan dari waktu ke waktu"
                                emptyMessage="Data penjualan tidak tersedia"
                                >
                                    {!isEmpty(salesData) && (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={salesData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                                                <XAxis dataKey="date" tick={{fontSize: 12}}/>
                                                <YAxis tickFormatter={(value) => formatRupiah(value)} tick={{fontSize: 12}}/>
                                                <Tooltip formatter={(value) => formatRupiah(value)}/>
                                                <Line type="monotone" dataKey="total" stroke="#5143d9" strokeWidth={2} activeDot={{r: 6}}/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </div>
                        )}
                    </div>
                    
                    <div className='row g-4'>
                        {/* chart bar produk terlaris */}
                        {hasAnyPermission(['dashboard.view_products']) && (
                            <div className='col-md-6'>
                                <ChartCard title="Produk Terlaris" emptyMessage="Data produk terlaris tidak tersedia">
                                    {!isEmpty(productsData) && (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={productsData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                                                <XAxis dataKey="name" tick={{fontSize: 12}}/>
                                                <YAxis tick={{fontSize: 12}}/>
                                                <Tooltip/>
                                                <Bar dataKey="total_quantity" fill="#5143d9" radius={[4, 4, 0, 0]}/>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </div>
                        )}

                        {/* Chart bar: stok produk per kategori */}
                        {hasAnyPermission(['dashboard.view_products']) && (
                            <div className="col-md-6">
                                <ChartCard title="Stok Produk per Kategori" emptyMessage="Data kategori tidak tersedia">
                                    {!isEmpty(categoryData) && (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={categoryData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                                                <XAxis dataKey="category" tick={{fontSize: 12}}/>
                                                <YAxis tick={{fontSize: 12}}/>
                                                <Tooltip/>
                                                <Bar dataKey="total_stock" fill="#0cbc87" radius={[4, 4, 0, 0]}/>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </div>
                        )}
                    </div>

                </div>
            </AdminLayout>
        </>
    );
}