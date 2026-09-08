<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('produks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained(); // UMKM pemilik
        $table->string('nama_produk');
        $table->string('kategori')->nullable(); // kopi, andaliman, snack, dll
        $table->timestamps();
    });
}
};
