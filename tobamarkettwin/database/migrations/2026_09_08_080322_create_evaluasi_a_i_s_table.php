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
    Schema::create('evaluasi_ais', function (Blueprint $table) {
        $table->id();
        $table->foreignId('konsep_produk_id')->constrained()->cascadeOnDelete();
        $table->string('persona'); // deskripsi customer twin yang disimulasikan
        $table->decimal('purchase_intention', 5, 2);
        $table->decimal('price_acceptance', 5, 2);
        $table->decimal('packaging_attractiveness', 5, 2);
        $table->decimal('cultural_authenticity', 5, 2);
        $table->decimal('perceived_sustainability', 5, 2);
        $table->json('raw_response')->nullable(); // simpan respons AI mentah
        $table->timestamps();
    });
}
};
