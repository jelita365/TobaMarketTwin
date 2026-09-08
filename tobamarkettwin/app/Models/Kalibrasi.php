<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kalibrasi extends Model
{
    use HasFactory;

    protected $fillable = [
        'konsep_produk_id',
        'calibrated_acceptance',
        'sustainability_score',
        'gap_ai_vs_human',
        'masuk_sweet_spot',
    ];

    protected $casts = [
        'masuk_sweet_spot' => 'boolean',
    ];

    public function konsepProduk(): BelongsTo
    {
        return $this->belongsTo(KonsepProduk::class);
    }
}