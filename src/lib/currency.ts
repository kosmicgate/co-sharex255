export function fmt(n: number, symbol = '฿'): string {
  const rounded = Math.round((Math.abs(n) + Number.EPSILON) * 100) / 100;
  return (n < 0 && rounded > 0 ? '-' : '') + symbol + rounded.toFixed(2);
}
