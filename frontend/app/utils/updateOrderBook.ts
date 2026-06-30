export function updateOrderBook(
    current: [string, string][],
    updates: [string, string][],
    isBid: boolean
): [string, string][] {

    const map = new Map(current);

    for (const [price, quantity] of updates) {
        if (Number(quantity) === 0) {
            map.delete(price);
        } else {
            map.set(price, quantity);
        }
    }

    return Array.from(map.entries()).sort((a, b) =>
        isBid
            ? Number(b[0]) - Number(a[0])
            : Number(a[0]) - Number(b[0])
    );
}