export function formatMoney(amount: number): string {
    const rounded = Math.round(amount * 100) / 100;
    return rounded.toLocaleString('ar-DZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
