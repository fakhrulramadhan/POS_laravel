import React, {useState} from "react";
import { useForm } from "@inertiajs/react";
import Swal from "sweetalert2";

// agar bisa diakses dari luar file pakai export
export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");

    const {data, setData, post, errors} = useForm({
        email: "",
        password: "",
    }); 

    // handle login ketika selesai (loadingnya dimatiin) dan error
    const loginHandler = (e) => {
        e.preventDefault();
        setIsLoading(true); //klik login loading nyala
        setGeneralError("");
        post("/login", {
            onFinish: () => setIsLoading(false),
            onError: (errors) => {
                // setIsLoading(false);
                if (!errors.email && !errors.password) {
                    // errors.general = "Invalid email or password";
                    setGeneralError("Invalid email or password")
                }
                // sweet alert dialog
                // Swal.fire({
                //     icon: "error",
                //     title: "Login Failed",
                //     text: errors.email || errors.password || "Invalid email or password",
                //     confirmButtonColor: "#d33"
                // });
            },
        });
    };

    // return utk menampilkan html jsxnya
    return (
        <section className="login-container d-flex align-items-center position-relative overflow-hidden">
            <div className="container-fluid">
                <div className="row">
                    {/* sisi sebelah kiri */}
                    <div className="col-12 col-lg-6 d-none d-lg-flex align-items-center justify-content-center login-left vh-lg-100">
                        <div className="p-3 p-lg-5 text-center text-white">
                            <div className="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                                style={{ width: 120, height: 120, backgroundColor: 'rgba(255,255,255,0.15)' }}>
                                <i className="bi bi-shop" style={{ fontSize: '3rem' }}></i>
                            </div>
                            <h2 className="fw-bold text-white">Welcome to AkuPos</h2>
                            <p className="mb-0 h6 fw-light text-white opacity-75">
                                Everything you need!
                            </p>
                        </div>
                    </div>

                    {/* sisi sebelah kanan */}
                    <div className="col-12 col-lg-6 m-auto">
                        <div className="row my-3">
                            <div className="col-sm-10 col-xl-8 m-auto">
                                <div className="login-card card p-4 p-xl-5">
                                    <div className="text-center mb-4">
                                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                            style={{ width: 64, height: 64 }}>
                                            <i className="bi bi-shop text-white fs-3"></i>
                                        </div>
                                        <h1 className="fs-3 fw-bold mb-1">AkuPos</h1>
                                        <p className="text-muted mb-0">
                                            Silakan login dengan akun anda
                                        </p>
                                    </div>
                                    <form onSubmit={loginHandler}>
                                        <div className="mb-4">
                                            <label className="form-label" htmlFor="">
                                                Email address *
                                            </label>
                                            <input type="email"
                                            name="email"
                                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                            placeholder="Masukkan email"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            />
                                            {errors.email && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.email}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label">
                                                Password *
                                            </label>
                                            <input type="password"
                                                name="password"
                                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData("password", e.target.value)
                                                }
                                                placeholder="Masukkan password"
                                            />
                                            {errors.password && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.password}
                                                </div>
                                            )}

                                            {!errors.password && !errors.email && errors.general && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.general}
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            className="btn btn-primary mb-0 w-100 btn-md py-3"
                                            type="submit"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 
                                        (<div
                                            className="spinner-border spinner-border-sm text-light"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Loading....
                                            </span>
                                        </div>)
                                        : 
                                        ("Login")    
                                        }
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}