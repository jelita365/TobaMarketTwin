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
    Schema::create('kalibrasis', function (Blueprint $table) {
        $table->id();
        $table->foreignId('konsep_produk_id')->constrained()->cascadeOnDelete();
        $table->decimal('calibrated_acceptance', 5, 2);   // sumbu Y Screen 03
        $table->decimal('sustainability_score', 5, 2);    // sumbu X Screen 03
        $table->decimal('gap_ai_vs_human', 5, 2)->nullable(); // selisih AI vs manusia
        $table->boolean('masuk_sweet_spot')->default(false);
        $table->timestamps();
    });
}
};
