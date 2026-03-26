<?php 

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

// fungsi utk upload, update, hapus gambar
trait ImageHandlerTrait {
    
    public function uploadImage(UploadedFile $file, $directory = 'images') : string {

        $imageName = $file->hashName();
        $file->storeAs($directory, $imageName, 'public'); //bisa diakses secara publik
        return $imageName;
    }

    public function updateImage(?string $oldFileName, UploadedFile $newFile, $directory = 'images'): string {

        $this->deleteImage($oldFileName, $directory);
        return $this->uploadImage($newFile, $directory);
    }
    
    public function deleteImage($fileName, $directory = 'images') : void {
        if ($fileName && Storage::disk('public')->exists("{$directory}/{$fileName}")) {
            Storage::disk('public')->delete("{$directory}/{$fileName}");
        }
    }
}