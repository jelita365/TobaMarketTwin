<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvaluasiAI extends Model
{
    use HasFactory;

    // nama tabel eksplisit, supaya tidak jadi "evaluasi_a_i_s"
    protected $table = 'evaluasi_ais';

    protected $fillable = [
        'konsep_produk_id',
        'persona',
        'purchase_intention',
        'price_acceptance',
        'packaging_attractiveness',
        'cultural_authenticity',
        'perceived_sustainability',
        'raw_response',
    ];

    protected $casts = [
        'raw_response' => 'array',
    ];

    public function konsepProduk(): BelongsTo
    {
        return $this->belongsTo(KonsepProduk::class);
    }
}