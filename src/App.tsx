import { useMemo } from 'react'
import { calculate, PERCENTS } from './calculator'
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

  const prizes = useMemo(
    () => calculate(pot, Number(smallestBill), Number(minPrize)),
    [pot, smallestBill, minPrize]
  )

  return (
    <div className="app">
      <nav className="navbar">
        <img src="assets/imgs/logo.png" alt="Add'r'Up" />
      </nav>

      <div className="content">
        {/* Language picker */}
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

        {/* Pot size */}
        <div className="section">
          <div className="section-header">{t('COUNT')}</div>
          <div className="row">
            <span className="row-label">{t('POT')}</span>
            <input
              className="pot-input"
              type="number"
              inputMode="numeric"
              value={pot}
              onChange={e => setPot(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Prizes */}
        <div className="section">
          <div className="section-header">{t('PRIZES')}</div>
          {PLACE_KEYS.map((key, i) => (
            <div className="row" key={key}>
              <span className="row-label">
                {t(key)} <small>({PERCENTS[i]}%)</small>
              </span>
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
            <li>Table buys in for $20, players are issued 550 in chips (3×100, 6×25, 10×10). Blinds start at 10/20.</li>
            <li>Unlimited re-buys until "last hand" for $20 and 550 chips. Cannot re-buy unless completely knocked out.</li>
            <li>Timer starts at 45 minutes, after which blinds double to 20/40.</li>
            <li>45 minutes later, blinds increase to 30/60, timer decreases to 30 minutes.</li>
            <li>Deal goes around the table one more time — this is the "last hand" for re-buys.</li>
            <li>At end of "last hand", any player can top-up for $20 and receive 450 chips.</li>
            <li>A player knocked out during "last hand" can re-buy and top-up for $40, getting 1,000 chips.</li>
            <li>Blinds continue every 30 minutes: 30/60, 40/80, 50/100. No more re-buys.</li>
            <li>Blinds can optionally freeze at 50/100 for three players, 100/200 for last three, 200/400 for heads-up.</li>
          </ul>
          <p className="contact">
            Want to help translate?{' '}
            <a href="mailto:wojtek@grabski.ca?Subject=Translation for add'r'up">Send an email</a>{' '}
            with everything you see here and the language it represents.
          </p>
        </div>
      </div>

      <footer className="footer">
        &copy; 2017 – <a href="https://mostlydev.com">https://mostlydev.com</a>
      </footer>
    </div>
  )
}
