<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class KonsepProduk extends Model
{
    use HasFactory;

    protected $fillable = [
        'produk_id',
        'material',
        'desain',
        'harga',
        'storytelling',
        'informasi_produk',
        'bahasa',
        'foto_kemasan',
        'status',
    ];

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class);
    }

    public function evaluasiAI(): HasOne
    {
        return $this->hasOne(EvaluasiAI::class);
    }

    public function evaluasiManusia(): HasMany
    {
        return $this->hasMany(EvaluasiManusia::class);
    }

    public function kalibrasi(): HasOne
    {
        return $this->hasOne(Kalibrasi::class);
    }
}