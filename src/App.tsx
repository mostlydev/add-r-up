import { useMemo, useRef } from 'react'
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
  const { t, lang, setLang, languages } = useTranslation()
  const { pot, setPot, smallestBill, setSmallestBill, minPrize, setMinPrize } = useSettings()

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

  return (
    <div className="app">
      <nav className="navbar">
        <img src="/assets/imgs/logo.png" alt="Add'r'Up" />
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
            <span className="stepper-value">{fmt.format(pot)}</span>
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

        {/* Sample Rules */}
        <div className="section">
          <div className="section-header">{t('SAMPLE_RULES')}</div>
          <ul className="rules-list">
            {(['RULE_1','RULE_2','RULE_3','RULE_4','RULE_5','RULE_6','RULE_7','RULE_8','RULE_9'] as const).map(k => (
              <li key={k}>{t(k)}</li>
            ))}
          </ul>
          <p className="contact">
            {t('CONTACT_PRE')}{' '}
            <a href="mailto:wojtek@grabski.ca?Subject=Translation for add'r'up">{t('CONTACT_LINK')}</a>{' '}
            {t('CONTACT_POST')}
          </p>
        </div>
      </div>

      <div className="lang-picker">
        {languages.map(l => (
          <button
            key={l.code}
            className={`lang-btn${lang === l.code ? ' active' : ''}`}
            onClick={() => setLang(l.code)}
          >
            {l.name}
          </button>
        ))}
      </div>

      <footer className="footer">
        &copy; 2017 – <a href="https://mostlydev.com">https://mostlydev.com</a>
      </footer>
    </div>
  )
}
