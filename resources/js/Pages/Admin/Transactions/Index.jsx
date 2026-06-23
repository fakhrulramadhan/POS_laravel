import React, { useEffect, useRef, useCallback, useState} from "react";
import { usePage, router, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import ReactToPrint  from "react-to-print";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { Modal} from "bootstrap";


// import utilites dan komponen
import { formatRupiah } from "../../../utils/rupiah";
import ProductList from "../../../Components/ProductList" ;
import Cart from "../../../Components/Cart";
import PaymentSection from "../../../Components/PaymentSection";
import ModalProduk from "../../../Components/ModalProduk";
import Receipt from "../../../Components/Receipt";

// impot custom hook dan action untuk manajemen state
import useSalesReducer, {
    setSelectedCustomer,
    setSelectedProduct,
    setQuantity,
    setShowModal,
    setCartItems,
    setProducts,
    calculateSubtotal,
    filterProducts,
    resetSelections, 
    setDiscount,
    setCash,
    setPaymentMethod,
    setSearchTerm,
    setShowReceiptModal,
    setShowSnapModal,
    setSelectedCategory,
    setChange,
} from "../../hooks/useSalesReducer";
import CustomerSelector from "../../../Components/CustomerSelector";

const Sales = () => {
    // props dari controller
    const {errors, auth, payment_link_url, carts=[], categories = [], products= [], customers = []} = usePage().props;

    // inisialisasi reducer & state
    const {state, dispatch} = useSalesReducer();

    // refs 
    const componentRef = useRef();
    const reactToPrintRef = useRef();
    const isPayingRef = useRef(false);

    // ref untuk input pencarian produk
    const searchInputRef = useRef(null);

    // state lokal
    const [transactionSnapshot, setTransactionSnapshot] = useState(null);
    const [showScanner, setShowScanner] = useState(false);

    // fungsi - fungsi callback & handler

    // menampilkan notifikasi menggunakan sweetalert 2
    const showAlert = useCallback((title, text, icon, options = {}) => {
        Swal.fire({
            title,
            text,
            icon, 
            confirmButtonText: "OK",
            ...options
        });
    }, []);

    // menampilkan/ tutup modal popup bootstrap
    const toggleModal = useCallback((modalId, show) => {
        const modalElement = document.getElementById(modalId);

        if (modalElement) {
            // const modalInstance = show ?
            //     new window.bootstrap.Modal(modalElement)
            //     : window.bootstrap.Modal.getInstance(modalElement);
            const modalInstance = Modal.getOrCreateInstance(modalElement);

            show ? modalInstance.show() : modalInstance.hide();
        }
    }, []);

    // handler perubahan input numerik (untuk discount, cash, quantity)
    const handleInputChange = (actionCreator) => (e) => {
        const value = e.target.value.replace(/[^\d]/g, ""); //hanya angka yg bisa diimput
        dispatch(actionCreator(value));
    };

    // memilih produk dari daftar =
    const handleSelectProduct = (product) => {
        dispatch(setSelectedProduct(product));
        dispatch(setShowModal(false)); //tutup modalnya
    };

    // menghapus item dari cart
    const handleDeleteProduct = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/sales/delete-from-cart/${id}`, {
                    // pada saat sukses hapus
                    onSuccess: () => {
                        const updatedCart = state.cartItems.filter(
                            (item) => item.id !== id
                        );

                        dispatch(setCartItems(updatedCart));

                        showAlert("Deleted", "Your items has been deleted", "warning", {
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 3000
                        });
                    },

                    onError: () => {
                        showAlert("Error!", "Failed to delete items", "error");
                    }
                });
            }
        });
    };

    // menambah produk ke cart
    const handleAddToCart = async (product = null) => {
        const selectedProduct = product || state.selectedProduct;

        // validasi produk
        if (!selectedProduct || !selectedProduct.id) {
            return showAlert("Error!", "Please select a product.", "error");
        }

        // validasi kuantitas
        const quantity = Number(state.quantity);
        if (!Number.isInteger(quantity) || quantity < 1) {
            return showAlert("Error!", "Quantity must be at least 1", "error");
        }

        // hitung total harga
        const totalPrice = Number(selectedProduct.selling_price) * quantity;

        // persiapkan data untuk dikirim ke server
        const newItem = {
            customer_id: state.selectedCustomer,
            product_id: selectedProduct.id,
            quantity: quantity,
            total_price: totalPrice
        };

        try {
            await router.post("/admin/sales/add-product", newItem, {

                onSuccess: (page) => {
                    // update keranjang belanja di state
                    // dispatch utk memanggil nama hooksnya
                    dispatch(setCartItems(page.props.carts || []));

                    // Reset seleksi produk dan kuantiitas
                    dispatch(resetSelections());

                    // tampilkan kualifikasi sukses
                    showAlert("Added", "Product has been added to cart.", "success", {
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000
                });
                },
                onError: (error) => {
                    // logging error detail
                    console.error("Add to cart errror:", error);

                    // ambil pesan error dari response server
                    const message = error.response?.data.message || "Failed to add product to cart";

                    showAlert("Error!", message, "error");
                }
            });
        } catch (error) {
            
            // ambil pesan error dari response server, tampilkan pesan umum
            const message = error.response?.data?.message || "An error occured while adding the product cart";

            showAlert("Error!", message, "error");
        }
    };

    // mencetak struk
    const handlePrintReceipt = () => {
        setTimeout(() => reactToPrintRef.current?.handlePrint(), 100);
    }

    // menangani response dari pembayaran snap
    const handleSnapResponse = (
        title,
        text, 
        icon,
        success,
        callback
     ) => {
        dispatch(setShowSnapModal(false));
        toggleModal("snapModal", false);

        showAlert(title, text, icon, {
            toast: icon === "success",
            position: icon === "success" ? "top-end" : "center",
            showConfirmButton: icon !== "success",
            timer: icon === "success" ? 3000 : undefined
        });

        if (success) handlePrintReceipt(); //cetak struk jika sukses
        if (callback) callback();

        // Reset status pembayaran jika gagal / cancel
        if (!success) isPayingRef.current = false;
    };

    // memproses pembayaran
    const handleProcessPayment = async () => {
        const subTotal = state.subTotal;
        const discount = parseFloat(state.discount) || 0;
        const totalAmount = subTotal - discount;

        // jika pembayaran tunai, pastikan cash >= totalAmount
        const cash = state.paymentMethod === "cash" ? parseFloat(state.cash) || 0 : null;

        if (state.paymentMethod === "cash" && cash < totalAmount) {
            return showAlert(
                "Uang Tunai TIdak Cukup!",
                "Jumlah uang tunai tidak boleh kurang dari jumlah total",
                "error"
            );
        }

        
        // simpan snapsho data transaksi (untuk catat struk)
        const snapshot = {
            cartItems: [...state.cartItems],
            subTotal,
            discount,
            totalAmount,
            cash,
            change: state.change
        };

        setTransactionSnapshot(snapshot);

        // Data untuk dikirim ke server
        const transactionData = {
            customer_id: state.selectedCustomer || null,
            total_amount: totalAmount,
            cash: cash,
            change: state.paymentMethod === "cash" ? state.change : null,
            discount: discount,
            cart_items: state.cartItems,
            payment_method: state.paymentMethod
        };

        // kirim ke route process-payment
        try {
            await router.post("/admin/sales/process-payment", transactionData, {
                // pada saat sukses
                onSuccess: (page) => {
                    const paymentRef = page.props.payment_link_url;

                    if (state.paymentMethod === "online" && paymentRef) {
                        dispatch(setShowSnapModal(true));
                    } else if (state.paymentMethod === "cash") {
                        // 1. tampilkan notif payment sukses
                        showAlert(
                            "Payment Successful!",
                            "Transaction has been completed",
                            "success",
                            {
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 3000
                            }
                        );
                        
                        // 2. tampilkan sweet alert utk konfirmasi cetak struk
                        Swal.fire({
                            title: "Cetak Struk",
                            text: "Apakah anda ingin mencetak struk sekarang?",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonText: "Yes, print it",
                            cancelButtonText: "No, later"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // jika user menekan yes, yampilkan modal resecipt
                                dispatch(setShowReceiptModal(true));
                            }
                        });

                        dispatch(setCash("")); //set nominal cash menjadi 0
                        dispatch(setChange(0)); //set uang kembalian menjadi 0
                        dispatch(setDiscount(""));
                        dispatch(setQuantity(1));
                    } else {

                        // jika ada metode lain atau anda ingin fallback ke logika sebelumnya
                        showAlert(
                            "Payment Successful!",
                            "Transaction has been completed",
                            "success", 
                            {
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 3000,
                            }
                        );

                        // tampilkan modal receipt
                        dispatch(setShowReceiptModal(true));

                        // reset state setelah sukses
                        dispatch(setCash(""));
                        dispatch(setChange(0));
                        dispatch(setDiscount(""));
                        dispatch(setQuantity(1));
                    }
                },

                onError: () =>  showAlert("Error", "An Error occured while processing the payment", "error"),
            });
        } catch (error) {
            showAlert(
                "Error",
                "An error occured while processing the payment",
                "error"
            );
        }
    }
    
    // use Effect Hooks

    // Fokus pada input pencarian saat komponen dimuat
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    // Fokus kembali pada input pencarian setelah menutup modal produk
    useEffect(() => {
        // jika modal ditutup
        if (!state.showModal) {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }
    }, [state.showModal]); //taruh nama statenya di kurung muka

    // Tambahkan event listener untuk menangani pemindaian barcode (jika menggunakan scanner external)
    useEffect(() => {

        // variabel handle barcode
        const handleBarcodeScan = (e) => {
            // jika tombol yang ditekan adalah enter, lakukan pencarian atau aksi lainnya
            if (e.key === "Enter") {
                if (state.searchTerm) {
                    // jika barcode sama dengan yang dicari
                    const scannedProduct = state.products.find(
                        (product) => product.barcode === state.searchTerm
                    );

                    if (scannedProduct) {
                        dispatch(setSelectedProduct(scannedProduct));
                        dispatch(setQuantity(1));
                        handleAddToCart();
                    } else {
                        showAlert(
                            "Product Not Found",
                            "Produk dengan barcode tersebut tifak ditemukan",
                            "error"
                        );
                    }

                    // setelah aksi, bersihkan search term
                    dispatch(setSearchTerm(""));
                }
            }
        };
        
        // tambah event keydown utk enter
        window.addEventListener("keydown", handleBarcodeScan);

        return () =>{
            // hapus event
            window.removeEventListener("keydown", handleBarcodeScan);
        };
    }, [state.searchTerm, state.products, dispatch, showAlert]);


    // Tampilkan error quantity jika ada
    useEffect(() => {
        if (errors?.quantity) {
            showAlert("Error!", errors.quantity, "error");
        }
    }, [errors, showAlert]);

    // filter produk saat kategori atau search term berubah
    useEffect(() => {
        dispatch(filterProducts());
    }, [state.selectedCategory, state.searchTerm, dispatch]);

    // inisialisasi cart & produk + pasang script midtrans
    useEffect(() => {
        dispatch(setCartItems(carts));
        dispatch(setProducts(products));

        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", "SB-Mid-client-XiFZyCcVJ99JFv8H");
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [carts, products, dispatch]);

    // hitung subtotal setiap kali cart items berubah
    // use effect sepeeti emit kalau di bloc flutter update ui
    useEffect(() => {
        dispatch(calculateSubtotal());
    }, [state.cartItems, dispatch]);

    // hitung kembalian
    useEffect(() => {
        if (state.paymentMethod === "cash") {
            const cashValue = parseFloat(state.cash) || 0;
            const discountValue = parseFloat(state.discount) || 0;
            const changeValue = cashValue - (state.subTotal - discountValue); //tampung nilai uang kembalian
            dispatch(setChange(changeValue >= 0 ? changeValue : 0));
        } else {
            dispatch(setChange(0));
        }
    }, [
        state.cash,
        state.subTotal,
        state.discount,
        state.paymentMethod,
        dispatch
    ]);

    // Buka modal snap jika payment_link_url terisi
    useEffect(() => {
        if (payment_link_url && !isPayingRef.current) {
            dispatch(setShowSnapModal(true));
            toggleModal("snapModal", true);
        }
    }, [payment_link_url, dispatch, toggleModal]);

    // jalankan snap pay jika shoSnapModal true
    useEffect(() => {
        if (state.showSnapModal) {
            if (payment_link_url && !isPayingRef.current) {
                // sudah membayar statusnya
                isPayingRef.current = true;
                window.snap.pay(payment_link_url, {
                    onSuccess: () => {
                        handleSnapResponse(
                            "Payment Successful!",
                            "Transaction has been completed",
                            "success",
                            true
                        );
                    },
                    onError: () => {
                        handleSnapResponse(
                            "Payment Failed",
                            "There was an issue processing your payment",
                            "error",
                            false
                        );
                    },
                    onClose: () => {
                        handleSnapResponse(
                            "Payment Cancelled",
                            "Payment was cancelled",
                            "info",
                            false,
                            () => {
                                router.visit("/admin/sales", {replace: true})
                            }
                        );
                    }
                });
            }
        }
    }, [state.showSnapModal, payment_link_url]);

    // Tampilkan error umum dari server jika ada
    useEffect(() => {
        if (errors?.errors?.length) {
            showAlert("Error!", errors.errors[0], "error");
        }
    }, [errors, showAlert]);

    // simulasi loading (1 detik)
    useEffect(() => {
        const timer = setTimeout(
            () => dispatch({ type: "SET_LOADING", payload: false}),
            1000
        );

        return () => clearTimeout(timer);
    }, [dispatch]);

    // cetak struk otomatis jika showreceiptmodal=== true dan ada snapshot
    useEffect(() => {
        if (state.showReceiptModal && transactionSnapshot) {
            setTimeout(() => {
                handlePrintReceipt();
            }, 100);
        }
    }, [state.showReceiptModal, transactionSnapshot]);


    // handler untuk pemindaian barcode
    const handleBarcodeDetected = (err, result) => {
        if (result) {
            const scannedBarcode = result.text;
            dispatch(setSearchTerm(scannedBarcode));
            setShowScanner(false); //sembunyikan scanner

            // cari produk berdasarkan barcode
            const scannedProduct = state.products.find(
                (product) => product.barcode === scannedBarcode
            );

            if (scannedProduct) {
                dispatch(setSelectedProduct(scannedProduct));
                dispatch(setQuantity(1));
                handleAddToCart(scannedProduct);
            } else {
                showAlert(
                    "Product Not Found",
                    "Produk dengan barcode tersebut tidak ditemukan",
                    "error"
                );
            }

            dispatch(setSearchTerm(""));
        }
    };

    // bagian render (return)
    return (
        <div className="sales-container container-fluid px-4">
            {/* Header Bar */}
            <div className="sales-header-bar">
                <div className="sales-info">
                    <div className="avatar"><i className="bi bi-cart-check"></i></div>
                    <div>
                        <h5>Transaksi Baru</h5>
                        <small><i className="bi bi-person me-1"></i>Kasir: {auth.user.name}</small>
                    </div>
                </div>
                <div className="sales-badge">
                    <Link href="/admin/dashboard" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                        <i className="bi bi-arrow-left me-1"></i>Kembali
                    </Link>
                    <button className="btn btn-sm btn-outline-primary rounded-pill px-3 ms-2"
                        onClick={() => setShowScanner(!showScanner)}>
                        <i className="bi bi-camera me-1"></i> Scan
                    </button>
                </div>
            </div>

            {/* Barcode Scanner */}
            {showScanner && (
                <div className="mb-3 p-3 bg-white rounded-3 border" style={{borderColor:'#f0f0f5'}}>
                    <BarcodeScannerComponent width={300} height={200} onUpdate={handleBarcodeDetected} />
                    <button className="btn btn-danger btn-sm mt-2" onClick={() => setShowScanner(false)}>
                        <i className="bi bi-x-lg me-1"></i>Tutup Scanner
                    </button>
                </div>
            )}

            <div className="row g-3">
                {/* Left Panel - Products */}
                <div className="col-lg-5">
                    <div className="sales-panel">
                        <div className="panel-header">
                            <h6><i className="bi bi-box me-2"></i>Produk</h6>
                            <div className="d-flex gap-2">
                                <select className="form-select" style={{width:'auto', fontSize:'0.8rem', padding:'4px 10px'}}
                                    onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
                                    value={state.selectedCategory}>
                                    <option value="">Semua</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className="mb-3 position-relative">
                                <i className="bi bi-search position-absolute" style={{left:'14px', top:'12px', color:'#aaa'}}></i>
                                <input type="text" className="form-control" placeholder="Cari produk..." 
                                    style={{paddingLeft:'36px', borderRadius:'10px', background:'#f8f9fc', border:'1px solid #e8e8ee'}}
                                    value={state.searchTerm}
                                    onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                                    ref={searchInputRef}
                                />
                            </div>
                            <ProductList 
                                products={state.filteredProducts}
                                loading={state.loading}
                                onSelectProduct={handleSelectProduct}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel - Cart & Payment */}
                <div className="col-lg-7">
                    {/* Customer Selector */}
                    <CustomerSelector
                        customers={customers}
                        selectedCustomer={state.selectedCustomer}
                        onSelectCustomer={(value) => dispatch(setSelectedCustomer(value))}
                        cashierName={auth.user.name}
                    />

                    {/* Product Selector Quick */}
                    <div className="product-selector-card">
                        <div className="ps-row">
                            <div className="ps-field">
                                <label>Pilih Produk</label>
                                <div className="position-relative">
                                    <input className="form-control" type="text" placeholder="Klik untuk memilih produk..."
                                        value={state.selectedProduct?.name || ""} readOnly
                                        data-bs-toggle="modal" data-bs-target="#productModal"
                                        style={{cursor:'pointer', background:'#f8f9fc'}} />
                                    <i className="bi bi-search position-absolute" style={{right:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--bs-primary)'}}></i>
                                </div>
                            </div>
                            <div className="ps-field" style={{maxWidth:'120px'}}>
                                <label>Jumlah</label>
                                <input type="number" className="form-control" value={state.quantity}
                                    onChange={handleInputChange(setQuantity)} min="1" />
                            </div>
                            <div className="ps-field" style={{maxWidth:'100px', paddingTop:'24px'}}>
                                <button className="btn btn-primary w-100" onClick={() => handleAddToCart()}>
                                    <i className="bi bi-plus-lg"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="row g-3">
                        {/* Cart */}
                        <div className="col-md-7">
                            <div className="cart-panel">
                                <div className="cart-header">
                                    <h6><i className="bi bi-cart me-2"></i>Keranjang</h6>
                                    <span className="cart-count">{state.cartItems.length} item</span>
                                </div>
                                <div className="cart-body" style={{maxHeight:'220px', overflowY:'auto'}}>
                                    <Cart cartItems={state.cartItems} onDelete={handleDeleteProduct} />
                                </div>
                                <div className="cart-summary">
                                    <div className="total-row">
                                        <span>Sub Total</span>
                                        <span className="total-value">{formatRupiah(state.subTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="col-md-5">
                            <PaymentSection 
                                discount={state.discount}
                                onDiscountChange={handleInputChange(setDiscount)}
                                subTotal={state.subTotal}
                                paymentMethod={state.paymentMethod}
                                onPaymentMethodChange={(e) => dispatch(setPaymentMethod(e.target.value))}
                                cash={state.cash}
                                onCashChange={handleInputChange(setCash)}
                                change={state.change}
                                onProcessPayment={handleProcessPayment}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal untuk pemilihan produk */}
            <ModalProduk 
                products={state.filteredProducts}
                onSelect={handleSelectProduct}
                showModal={state.showModal}
                onClose={() => dispatch(setShowModal(false))}
            />

            {/* komponen receipt (untuk dicetak) */}
            {transactionSnapshot && (
                <div style={{display: "none"}}>
                    <Receipt
                    ref={componentRef}
                    cartItems={transactionSnapshot.cartItems}
                    subTotal={transactionSnapshot.subTotal}
                    discount={transactionSnapshot.discount}
                    totalAmount={transactionSnapshot.totalAmount}
                    cash={transactionSnapshot.cash}
                    change={transactionSnapshot.change}
                    />
                </div>
            )}

            {/* Modal cetak struk */}
            {state.showReceiptModal && transactionSnapshot && (
                <div className="modal fade show"
                style={{display: "block"}}
                tabIndex="-1"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <ReactToPrint
                             content={() => componentRef.current}
                             onAfterPrint={() => {
                                // clear semua data setelah selesai print
                                dispatch(setShowReceiptModal(false));
                                dispatch(setCartItems([]));
                                setTransactionSnapshot(null);
                                router.get("/admin/sales", {}, {replace: true});
                             }} 
                             ref={reactToPrintRef}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Pembayaran Snap */}
            <div className="modal fade"
            id="snapModal"
            tabIndex="-1"
            aria-labelledby="snapModalLabel"
            aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered"></div>
            </div>
        </div>
    );
}

export default Sales;

