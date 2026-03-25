import { useState } from 'react'

export type BillSize = '5' | '10' | '20'
export type MinPrize = '5' | '10' | '20'

const BILL_VALUES: BillSize[] = ['5', '10', '20']
const PRIZE_VALUES: MinPrize[] = ['5', '10', '20']

function loadNumber(key: string, fallback: number): number {
  const v = localStorage.getItem(key)
  const n = v !== null ? Number(v) : NaN
  return isFinite(n) ? n : fallback
}

function loadBillSize(key: string, fallback: BillSize): BillSize {
  const v = localStorage.getItem(key) as BillSize
  return BILL_VALUES.includes(v) ? v : fallback
}

function loadMinPrize(key: string, fallback: MinPrize): MinPrize {
  const v = localStorage.getItem(key) as MinPrize
  return PRIZE_VALUES.includes(v) ? v : fallback
}

export function useSettings() {
  const [pot, setPotRaw] = useState<number>(() => loadNumber('pot', 400))
  const [smallestBill, setSmallestBillRaw] = useState<BillSize>(() => loadBillSize('smallestBill', '10'))
  const [minPrize, setMinPrizeRaw] = useState<MinPrize>(() => loadMinPrize('minPrize', '20'))

  const setPot = (v: number) => { localStorage.setItem('pot', String(v)); setPotRaw(v) }
  const setSmallestBill = (v: BillSize) => { localStorage.setItem('smallestBill', v); setSmallestBillRaw(v) }
  const setMinPrize = (v: MinPrize) => { localStorage.setItem('minPrize', v); setMinPrizeRaw(v) }

  return { pot, setPot, smallestBill, setSmallestBill, minPrize, setMinPrize }
}
