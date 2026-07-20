export function fmt(n: number, symbol = '฿'): string {
  return symbol + (Math.round((n + Number.EPSILON) * 100) / 100).toFixed(2);
}
