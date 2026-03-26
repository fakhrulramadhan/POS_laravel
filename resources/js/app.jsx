import React from "react";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

// ternyata sidebar belum bisa ditaruh di sebelah kiri karena belum import bootstrap css dan style.css nya
import "bootstrap/dist/css/bootstrap.min.css";
// agar bisa oflline
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'; //ini comment karena js nya crash
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'flatpickr/dist/flatpickr.min.css'
import flatpickr from 'flatpickr'


// impor file css custom
import '../css/style.css';

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true})
        return pages[`./Pages/${name}.jsx`]
    },

    setup({el, App, props}) {
        createRoot(el).render(<App {...props}/>)
    }
})