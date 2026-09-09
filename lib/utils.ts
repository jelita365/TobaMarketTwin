export function cn(...classes: (string | false | null | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

export function formatRupiah(value: number): string {
    return `Rp${value.toLocaleString('id-ID')}`;
}
