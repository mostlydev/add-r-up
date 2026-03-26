import { useMemo, useRef, useState } from 'react'
import { calculate } from './calculator'
import { useTranslation } from './useTranslation'
import { useSettings, BillSize, MinPrize } from './useSettings'
import './App.css'

const PLACE_KEYS = ['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH'] as const
const BILL_OPTIONS: BillSize[] = ['5', '10', '20']
const PRIZE_OPTIONS: MinPrize[] = ['5', '10', '20']

const fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export default function App() {
  const { t } = useTranslation()
  const { pot, setPot, smallestBill, setSmallestBill, minPrize, setMinPrize } = useSettings()

  // Rules sheet
  const [rulesOpen, setRulesOpen] = useState(false)

  // Font size (3 steps)
  const FONT_STEPS = 3
  const applyFontStep = (step: number) => {
    document.documentElement.setAttribute('data-font-step', String(step))
    return step
  }
  const getFontCookie = () => parseInt(document.cookie.match(/fontStep=(\d)/)?.[1] ?? '0', 10)
  const setFontCookie = (v: number) => { document.cookie = `fontStep=${v};max-age=31536000;path=/` }

  const [fontStep, setFontStep] = useState(() => {
    const s = getFontCookie()
    return applyFontStep(isNaN(s) ? 0 : Math.min(Math.max(s, 0), FONT_STEPS - 1))
  })
  const changeFontStep = (delta: number) => {
    setFontStep(s => {
      const next = Math.min(Math.max(s + delta, 0), FONT_STEPS - 1)
      setFontCookie(next)
      return applyFontStep(next)
    })
  }

  // Numpad
  const [numpadOpen, setNumpadOpen] = useState(false)
  const [numpadStr, setNumpadStr] = useState('')

  const openNumpad = () => { setNumpadStr(String(pot)); setNumpadOpen(true) }
  const numpadPress = (key: string) => {
    if (key === '⌫') {
      setNumpadStr(s => s.slice(0, -1))
    } else if (key === '✓') {
      const v = parseInt(numpadStr, 10)
      if (!isNaN(v) && v >= 0) setPot(v)
      setNumpadOpen(false)
    } else {
      setNumpadStr(s => (s === '0' ? key : s + key))
    }
  }

  // Stepper hold-to-repeat
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const potRef = useRef(pot)
  potRef.current = pot

  const startHold = (delta: number) => {
    potRef.current = Math.max(0, potRef.current + delta)
    setPot(potRef.current)
    holdRef.current = setInterval(() => {
      potRef.current = Math.max(0, potRef.current + delta)
      setPot(potRef.current)
    }, 120)
  }
  const stopHold = () => {
    if (holdRef.current) { clearInterval(holdRef.current); holdRef.current = null }
  }

  const prizes = useMemo(
    () => calculate(pot, Number(smallestBill), Number(minPrize)),
    [pot, smallestBill, minPrize]
  )

  const base = import.meta.env.BASE_URL

  return (
    <div className="app" style={{ backgroundImage: `url(${base}assets/imgs/background.jpg)`, backgroundPosition: 'right top', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
      <nav className="navbar">
        <img src={`${base}assets/imgs/logo.png`} alt="Add'r'Up" />
      </nav>

      <div className="content">
        {/* Pot size */}
        <div className="section">
          <div className="section-header">{t('COUNT')}</div>
          <div className="stepper">
            <button
              className="stepper-btn"
              onPointerDown={() => startHold(-Number(smallestBill))}
              onPointerUp={stopHold}
              onPointerLeave={stopHold}
            >−</button>
            <span className="stepper-value" onClick={openNumpad}>{fmt.format(pot)}</span>
            <button
              className="stepper-btn"
              onPointerDown={() => startHold(Number(smallestBill))}
              onPointerUp={stopHold}
              onPointerLeave={stopHold}
            >+</button>
          </div>
        </div>

        {/* Prizes */}
        <div className="section">
          <div className="section-header">{t('PRIZES')}</div>
          {PLACE_KEYS.map((key, i) => (
            <div className="row" key={key}>
              <span className="row-label">{t(key)}</span>
              {prizes[i] > 0
                ? <span className="row-value">{fmt.format(prizes[i])}</span>
                : <span className="row-empty">🍺</span>
              }
            </div>
          ))}
        </div>

        {/* Smallest bill */}
        <div className="section">
          <div className="section-header">{t('BILL_SIZE')}</div>
          <div className="row">
            <div className="segment">
              {BILL_OPTIONS.map(v => (
                <button
                  key={v}
                  className={`seg-btn${smallestBill === v ? ' active' : ''}`}
                  onClick={() => setSmallestBill(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Minimum prize */}
        <div className="section">
          <div className="section-header">{t('MINIMUM_PRIZE')}</div>
          <div className="row">
            <div className="segment">
              {PRIZE_OPTIONS.map(v => (
                <button
                  key={v}
                  className={`seg-btn${minPrize === v ? ' active' : ''}`}
                  onClick={() => setMinPrize(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rules tab */}
        <button className="rules-tab" onClick={() => setRulesOpen(true)}>
          {t('SAMPLE_RULES')} <span className="rules-tab-arrow">↑</span>
        </button>
      </div>

      <footer className="footer">
        <span>&copy; 2017 – {new Date().getFullYear()} <a href="https://mostlydev.com">mostlydev.com</a></span>
        <div className="font-size-btns">
          <button className="font-size-btn" onClick={() => changeFontStep(-1)} disabled={fontStep === 0}>A−</button>
          <button className="font-size-btn" onClick={() => changeFontStep(1)} disabled={fontStep === FONT_STEPS - 1}>A+</button>
        </div>
      </footer>

      {/* Rules sheet */}
      <div className={`rules-overlay${rulesOpen ? ' open' : ''}`} onClick={() => setRulesOpen(false)} />
      <div className={`rules-sheet${rulesOpen ? ' open' : ''}`}>
        <div className="rules-sheet-header">
          <span>{t('SAMPLE_RULES')}</span>
          <button className="rules-close" onClick={() => setRulesOpen(false)}>✕</button>
        </div>
        <ul className="rules-list">
          {(['RULE_1','RULE_2','RULE_3','RULE_4','RULE_5','RULE_6','RULE_7','RULE_8','RULE_9'] as const).map(k => (
            <li key={k}>{t(k)}</li>
          ))}
        </ul>
      </div>

      {numpadOpen && (
        <div className="numpad-overlay" onClick={() => setNumpadOpen(false)}>
          <div className="numpad-sheet" onClick={e => e.stopPropagation()}>
            <div className="numpad-display">
              {numpadStr ? fmt.format(parseInt(numpadStr, 10)) : '$0'}
            </div>
            <div className="numpad-grid">
              {['1','2','3','4','5','6','7','8','9','⌫','0','✓'].map(k => (
                <button
                  key={k}
                  className={`numpad-key${k === '✓' ? ' numpad-confirm' : ''}`}
                  onClick={() => numpadPress(k)}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
