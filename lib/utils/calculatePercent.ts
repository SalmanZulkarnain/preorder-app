export function calculatePercent(part: number, total: number) {
    if (!total || total === 0) return 0;
    return (part / total) * 100;
}
