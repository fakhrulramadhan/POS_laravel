<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
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
        $productId = $this->route('product')?->id;

        return [
            'name' => 'required|string|max:255',
            'barcode'=> [
                'required',
                'string',
                // barcode harus unik, tidak boleh sama dengan product id
                Rule::unique('products', 'barcode')->ignore($productId)
            ],
            'selling_price' => 'required|numeric|min:8',
            'category_id' => 'required|exists:categories,id',
            'unit_id' => 'required|exists:units,id',
            // aturan validasi utk field image
            'image' => [
                // jika methodnya post maka wajib upload gambar
                $this->isMethod('post') ? 'required' : 'nullable',
                'image',
                'mimes:jpeg,png,jpg',
                'max:2048',
            ]
        ];
    }
}
