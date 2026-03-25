import { describe, it, expect } from 'vitest'
import { calculate, floorTo, PERCENTS } from './calculator'

describe('floorTo', () => {
  it('floors to nearest 10', () => expect(floorTo(123, 10)).toBe(120))
  it('floors to nearest 20', () => expect(floorTo(119, 20)).toBe(100))
  it('handles exact multiples', () => expect(floorTo(100, 10)).toBe(100))
})

describe('PERCENTS', () => {
  it('sums to 100', () => {
    expect(PERCENTS.reduce((a, b) => a + b, 0)).toBe(100)
  })
  it('has 5 entries', () => expect(PERCENTS.length).toBe(5))
})

describe('calculate', () => {
  it('prizes sum to pot exactly', () => {
    const prizes = calculate(400, 10, 20)
    expect(prizes.reduce((a, b) => a + b, 0)).toBe(400)
  })

  it('zeros out prizes below minimum', () => {
    // pot=100, minPrize=20: 5th = 2% of 100 = 2, below 20 → 0
    const prizes = calculate(100, 10, 20)
    expect(prizes[4]).toBe(0)
  })

  it('1st place absorbs rounding remainder', () => {
    const prizes = calculate(407, 10, 20)
    expect(prizes.reduce((a, b) => a + b, 0)).toBe(407)
  })

  it('floors prizes to nearest bill', () => {
    // 2nd: 27.5% of 400 = 110 → already multiple of 10
    const prizes = calculate(400, 10, 20)
    prizes.forEach(p => {
      if (p > 0) expect(p % 10).toBe(0)
    })
  })

  it('returns 5 prizes', () => {
    expect(calculate(400, 10, 20).length).toBe(5)
  })
})
