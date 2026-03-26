<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StockOpnameRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'opname_date' => 'required|date',
            'status' => 'required|string|in:pending,completed,canceled',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id', //id di tabel products harus ada, ambil semua field
            'products.*.physical_quantity' => 'required|integer|min:0'
        ];
    }
}
