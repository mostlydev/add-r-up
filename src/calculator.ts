export const PERCENTS: readonly number[] = [55, 27.5, 10.5, 5, 2]

export function floorTo(value: number, floor: number): number {
  return Math.floor(value / floor) * floor
}

export function calculate(pot: number, smallestBill: number, minPrize: number): number[] {
  const prizes = PERCENTS.map(pct =>
    floorTo(pot * pct / 100, smallestBill)
  ).map(prize => prize < minPrize ? 0 : prize)

  // 1st place absorbs the remainder lost to rounding
  prizes[0] += pot - prizes.reduce((a, b) => a + b, 0)

  return prizes
}
