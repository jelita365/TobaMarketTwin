<?php

namespace App\Services;

use App\Models\KonsepProduk;
use Illuminate\Support\Facades\Http;

class CustomerTwinService
{
    public function simulasikan(KonsepProduk $konsep): array
    {
        $prompt = "Kamu adalah simulasi customer twin wisatawan yang membeli oleh-oleh di Danau Toba.
        Nilai konsep produk berikut dari skala 0-100 untuk: purchase_intention, price_acceptance,
        packaging_attractiveness, cultural_authenticity, perceived_sustainability.
        Material: {$konsep->material}, Desain: {$konsep->desain}, Harga: {$konsep->harga},
        Storytelling: {$konsep->storytelling}, Info Produk: {$konsep->informasi_produk}.
        Jawab HANYA dalam format JSON tanpa teks lain.";

        $response = Http::withHeaders([
            'x-api-key' => config('services.anthropic.key'),
            'anthropic-version' => '2023-06-01',
        ])->post('https://api.anthropic.com/v1/messages', [
            'model' => 'claude-sonnet-4-6',
            'max_tokens' => 500,
            'messages' => [['role' => 'user', 'content' => $prompt]],
        ]);

        $text = $response->json('content.0.text');

        return json_decode($text, true);
    }
}