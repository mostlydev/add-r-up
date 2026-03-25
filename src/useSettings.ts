import { useState } from 'react'

export type BillSize = '5' | '10' | '20'
export type MinPrize = '5' | '10' | '20'

function load<T>(key: string, fallback: T): T {
  const v = localStorage.getItem(key)
  return v !== null ? (v as unknown as T) : fallback
}

export function useSettings() {
  const [pot, setPotRaw] = useState<number>(() => Number(load('pot', 400)))
  const [smallestBill, setSmallestBillRaw] = useState<BillSize>(() => load('smallestBill', '10'))
  const [minPrize, setMinPrizeRaw] = useState<MinPrize>(() => load('minPrize', '20'))

  const setPot = (v: number) => { localStorage.setItem('pot', String(v)); setPotRaw(v) }
  const setSmallestBill = (v: BillSize) => { localStorage.setItem('smallestBill', v); setSmallestBillRaw(v) }
  const setMinPrize = (v: MinPrize) => { localStorage.setItem('minPrize', v); setMinPrizeRaw(v) }

  return { pot, setPot, smallestBill, setSmallestBill, minPrize, setMinPrize }
}
