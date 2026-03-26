
import { Head, usePage } from '@inertiajs/react';
import {formatRupiah} from '../../../utils/rupiah';
import AdminLayout from '../../../Layouts/AdminLayout';
import hasAnyPermission from '../../../utils/hasAnyPermission';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
// const CARD_COLORS = ['#4CAF50', '#2196F3', '#FF9800', '9C27B0', '#FF5722'];
const CARD_CLASSES = ['bg-success', 'bg-primary', 'bg-warning', 'bg-secondary', 'bg-danger'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#9966FF', '#C9CBCF'];

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


const StatCard = ({colorClass, icon, title, value}) => (
    <div className="col-6 col-md-4 col-lg-4 mb-3">
        <div className={`card text-white text-center shadow h-100 p-4 d-flex flex-column justify-content-between ${colorClass}`}
        >   
        {/* tinggi container dan lebarnya 60 */}
            <div className="mb-3 mx-auto bg-warning rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 60, height: 60}}
            >
                <i className={icon} style={{ fontSize: 24}}/>
            </div>
            <h5 className="fs-6 text-uppercase mb-1">{title}</h5>
            <p className="fs-4 fw-bold">{value}</p>
        </div>
    </div>
);

// awalnya yang ini dipakai
// const StatCard = ({color, icon, title, value}) => (
//     <div className="col-6 col-md-4 col-lg-4 mb-3">
//         <div className="card text-white text-center shadow h-100 p-4 d-flex flex-column justify-content-between"
//         style={{ backgroundColor: color}}
//         >   
//         {/* tinggi container dan lebarnya 60 */}
//             <div className="mb-3 mx-auto bg-warning rounded-circle d-flex align-items-center justify-content-center"
//             style={{ width: 60, height: 60}}
//             >
//                 <i className={icon} style={{ fontSize: 24}}/>
//             </div>
//             <h5 className="fs-6 text-uppercase mb-1">{title}</h5>
//             <p className="fs-4 fw-bold">{value}</p>
//         </div>
//     </div>
// );

const ChartCard = ({title, children, emptyMessage}) => (
    <div className="card shadow border-0 h-100">
        <div className="card-body">
            <h5 className="card-title text-center mb-3">{title}</h5>
            {children || <div className="text-center text-muted">{emptyMessage}</div>}
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
                <title>Dashboard - EasyPOS</title>
            </Head>
            <AdminLayout>
                <div className='container-fluid'>
                    <h1 className='mb-4 h3'>Dashboard</h1>

                    {/* Bagian Kartu Statistik */}
                    <div className="row g-3">
                        {Object.keys(stats).map((key, i) => {
                            const permission = STAT_PERMISSION_MAP[key];
                            // jika tidak ada izinnya, biarkan kosong
                            if (!permission) return null;
                            
                            // menampilkan kartu berdasarkan nama menunya dan hak aksesnya
                            return (
                                hasAnyPermission([permission]) && (
                                    <StatCard
                                        key={key}
                                        colorClass={CARD_CLASSES[i % CARD_CLASSES.length]}
                                        // color={CARD_COLORS[i % CARD_COLORS.length]}
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
                        <div className="alert alert-warning my-4">Data Transaksi kosong. Tambahkan data terlebih dahulu</div>
                    )}

                    {/* Charts (Grafik) */}
                    <div className='row g-4 my-4'>
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
                                                nameKey="name"                                   cx="50%"
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

                        {/*Chart Line: Penjualan dari waktu ke waktu, hanya user tertentu yg bisa akses menu ini, lebar kolomnya setengah layar kalau screen nya mid  */}
                        {hasAnyPermission(['dashboard.view_sales']) && (
                            <div className="col-md-6">
                                <ChartCard title="Penjualan dari waktu ke waktu"
                                emptyMessage="Data penjualan tidak tersedia"
                                >
                                    {/* jika data penjualannya tidak kosong (ada) */}
                                    {!isEmpty(salesData) && (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={salesData}>
                                                <CartesianGrid strokeDasharray="3 3"/>
                                                <XAxis dataKey="date"/>
                                                <YAxis tickFormatter={(value) => formatRupiah(value)}/>
                                                <Tooltip formatter={(value) => formatRupiah(value)}/>

                                                <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{r: 8}}/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </div>
                        )}
                    </div>
                    
                    {/* spasi atas bawah 4 */}
                    <div className='row g-4 my-4'>
                        {/* chart bar produk terlaris */}
                        {hasAnyPermission(['dashboard.view_products']) && (
                            <div className='col-md-6'>
                                <ChartCard title="Produk Terlaris" emptyMessage="Data produk terlaris tidak tersedia">
                                    {/* jika datanya ada */}
                                    {!isEmpty(productsData) && (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={productsData}>
                                                <CartesianGrid strokeDasharray="3 3"/>
                                                <XAxis dataKey="name"/>
                                                <YAxis/>
                                                <Tooltip/>
                                                <Bar dataKey="total_quantity" fill="#FF8042"/>
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
                                                <CartesianGrid strokeDasharray="3 3"/>
                                                <XAxis dataKey="category"/>
                                                <YAxis/>
                                                <Tooltip/>
                                                <Bar dataKey="total_stock" fill="#00C49F"/>
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