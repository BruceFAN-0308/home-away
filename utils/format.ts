export function formatCurrency(amount?: number) {
    const value = amount || 0
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

export function formatQuantity(quantity: number, noun: string) {
    return quantity <= 1 ? ` ${quantity} ${noun} ` : ` ${quantity} ${noun}s `;
}

export const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};
