export function calculatePercent(part, total) {
    if (!total || total === 0) return 0;
    return (part / total) * 100;
}   