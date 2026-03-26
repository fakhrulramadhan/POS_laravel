<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
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
    public function rules()
    {
       
            //
            // Kita akan memberdakan antara store dan update dengan melihat apakah terdapat user
            // dari parameter route. jika this->route('user) ada, berarti sedang update.
            // jika tidak ada, berarti sedang store )create

            // ambil user id dari route
            $userId = $this->route('user') ?  $this->route('user')->id : null;

            // aturan umum
            $rules = [
                'name' => 'required',
                'email' => 'required|email|unique:users,email'
            ];


        // jika methodnya post, maka password wajib diisi, jika tidak maka boleh kosong (sometimes)
        if ($this->isMethod('POST')) {  
            # aturan khusus saat store
            $rules['password'] = 'required|confirmed';
        } else {
            # code...
            $rules['password'] = 'nullable|confirmed';
        }
           
         
         return $rules;
        
    }
}
