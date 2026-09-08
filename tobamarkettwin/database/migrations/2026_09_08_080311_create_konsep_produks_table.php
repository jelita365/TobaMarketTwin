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
    Schema::create('konsep_produks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('produk_id')->constrained()->cascadeOnDelete();
        $table->string('material');          // 3 pilihan
        $table->string('desain');            // 3 pilihan
        $table->decimal('harga', 10, 2);     // 3 pilihan
        $table->string('storytelling');      // 2 pilihan
        $table->string('informasi_produk');  // 2 pilihan
        $table->string('bahasa')->nullable();
        $table->string('foto_kemasan')->nullable();
        $table->enum('status', ['draft', 'screening_ai', 'validasi_manusia', 'shortlist', 'ditolak'])
              ->default('draft');
        $table->timestamps();
    });
}
};
