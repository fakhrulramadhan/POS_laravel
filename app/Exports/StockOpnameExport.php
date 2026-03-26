<?php 

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

// export untuk report excel
class StockOpnameExport implements FromArray, WithHeadings
{
    protected $stockOpnames;

    public function __construct($stockOpnames)
    {
        $this->stockOpnames = $stockOpnames;        
    }

    // utk judul kolomnya
    public function headings(): array {

        return [
            'No',
            'Date',
            'Status',
            'Product Name',
            'Physical Quantity',
            'System Quantity',
            'Quantity Difference'
        ];
    }

    // utk menampilkan datanya di excel
    public function array(): array
    {
        $data = [];
        $row = 1;

        
        foreach ($this->stockOpnames as $stockOpname) {
           foreach ($stockOpname->details as $detail) {
                $data[] = [
                    $row++, //jumlah baris
                    $stockOpname->opname_date, //menampilkan data stock opname date
                    ucfirst($stockOpname->status), //huruf kapital pertama
                    $detail->product->name ?? 'No Product',
                    $detail->physical_quantity ?? 0,
                    $detail->stockTotal->total_stock ?? 0,
                    $detail->quantity_difference ?? 0
                ];
           }
        }

        return $data;
    }
}
