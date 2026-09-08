<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvaluasiManusia extends Model
{
    use HasFactory;

    protected $fillable = [
        'konsep_produk_id',
        'responden_id',
        'purchase_intention',
        'price_acceptance',
        'packaging_attractiveness',
        'cultural_authenticity',
        'perceived_sustainability',
    ];

    public function konsepProduk(): BelongsTo
    {
        return $this->belongsTo(KonsepProduk::class);
    }

    public function responden(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responden_id');
    }
}