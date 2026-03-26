<?php

namespace Database\Seeders;

use App\Models\Province;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class ProvincesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $provinces = $this->fetchProvinces();

        if ($provinces === null) {
            # code...
            $this->command->error('Failed to fetch provinces from API');
            return;
        }

        $this->storeProvinces($provinces);

        $this->command->info('Provinces table seeded successfully');
    }

    // outputnya berupa array
    private function fetchProvinces(): ?array {

    // siapkan 2 header http untuk rajaongkir
        $response = Http::withHeaders([
            'Key' => config('rajaongkir.api_key'), //ambil api keynya dari config env
            'Accept' => 'application/json' ///format json
        ])->get(config('rajaongkir.endpoints.province'));

        if ($response->failed()) {
            $this->command->error('API Response Status: ' .$response->status());
            $this->command->error('API Response Body: ' .$response->body());
            return null;
        }

        $data = $response->json(); //convert dari json -> array php

        return $data['data'] ?? null;
    }

    private function storeProvinces(array $provinces): void {

        $data = collect($provinces)->map(function ($province) {
            // ambil field yang diperlukan saja
            return [
                'id' => $province['id'],
                'name' => $province['name']
            ];
        })->toArray();

        // bulk insert untuk performa optimal (jangan pakai foreach lambat soalnya)
        Province::insert($data);
    }
}
