import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

function computeValuation({ mrr, growth, churn, margin, years }) {
  const annualRevenue = mrr * 12

  let multiple = 3.0
  const growthAdj = clamp(growth * 0.06, 0, 1.2)           // +0 → +1.2
  const churnAdj = -clamp(churn * 0.1, 0, 1.5)             // 0 → -1.5
  const marginAdj = clamp(margin / 60, 0, 1.0)             // 0 → +1.0
  const yearsAdj = clamp(years * 0.12, 0, 0.8)             // 0 → +0.8
  multiple = clamp(multiple + growthAdj + churnAdj + marginAdj + yearsAdj, 2.0, 8.0)

  const suggested = Number(multiple.toFixed(2))
  const low = Math.round(annualRevenue * Math.max(2, suggested - 0.5))
  const high = Math.round(annualRevenue * (suggested + 0.5))

  const riskScore = clamp((churn * 6) - (growth * 2) - (margin / 10) - (years * 3), 0, 100)
  let risk = 'Medium'
  if (riskScore < 25) risk = 'Low'
  else if (riskScore > 55) risk = 'High'

  const growthScore = clamp(
    Math.round(growth * 2.5 + margin * 1.2 - churn * 3 + years * 4),
    0,
    100
  )

  return {
    annualRevenue,
    suggested,
    low,
    high,
    risk,
    growthScore
  }
}

export default function SaasValuation() {
  const [form, setForm] = useState({
    mrr: '',
    growth: '',
    churn: '',
    margin: '',
    years: ''
  })

  const parsed = {
    mrr: Number(form.mrr) || 0,
    growth: Number(form.growth) || 0,
    churn: Number(form.churn) || 0,
    margin: Number(form.margin) || 0,
    years: Number(form.years) || 0
  }

  const result = useMemo(() => computeValuation(parsed), [form.mrr, form.growth, form.churn, form.margin, form.years])

  const prettyGBP = (n) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n || 0)

  const summaryText = `SaaS Valuation Estimate — Value: ${prettyGBP(result.low)} to ${prettyGBP(result.high)} · Multiple: ${result.suggested}x · Risk: ${result.risk} · Growth Score: ${result.growthScore}/100`

  const handleChange = (e) => {
    const { name, value } = e.target
    // numeric only
    const cleaned = value.replace(/[^0-9.]/g, '')
    setForm((f) => ({ ...f, [name]: cleaned }))
  }

  const baseDomain = import.meta.env.VITE_ACTIVE_DOMAIN || (typeof window !== 'undefined' ? window.location.host : 'corelinkautomation.com')
  const baseUrl = `https://${baseDomain}`

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>SaaS Valuation Calculator (Free Online Tool) | CoreLink Tech</title>
        <meta name="description" content="Free SaaS valuation calculator. Estimate your SaaS business value using revenue, growth, churn, margin and years in operation. No sign-up, fast and mobile-friendly." />
        <link rel="canonical" href={`${baseUrl}/saas-valuation-calculator`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How does the SaaS valuation calculator work?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'We estimate annual revenue from MRR and apply a multiple influenced by growth, churn, profit margin and operating history to produce a realistic valuation range.'
                }
              },
              {
                '@type': 'Question',
                name: 'What affects SaaS valuation multiples?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Higher growth and margins increase the multiple; high churn and limited history reduce it. Market conditions and product quality also matter.'
                }
              },
              {
                '@type': 'Question',
                name: 'Is this calculator suitable for indie SaaS and small teams?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. It is designed for indie hackers, founders and small teams that need a quick, no‑signup valuation reference.'
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          SaaS Valuation Calculator (Free Online Tool)
        </h1>
        <p className="text-gray-400">
          Lightweight, fast and mobile‑friendly. Estimate your SaaS valuation using realistic, founder‑friendly logic.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <form className="space-y-4 bg-core-bg border border-white/10 rounded-xl p-5">
          <Field label="Monthly Recurring Revenue (MRR)" name="mrr" value={form.mrr} onChange={handleChange} placeholder="e.g. 4000" suffix="£/mo" />
          <Field label="Monthly Growth Rate (%)" name="growth" value={form.growth} onChange={handleChange} placeholder="e.g. 8" suffix="%" />
          <Field label="Monthly Churn Rate (%)" name="churn" value={form.churn} onChange={handleChange} placeholder="e.g. 4" suffix="%" />
          <Field label="Profit Margin (%)" name="margin" value={form.margin} onChange={handleChange} placeholder="e.g. 35" suffix="%" />
          <Field label="Years in Operation" name="years" value={form.years} onChange={handleChange} placeholder="e.g. 2" />
          <div className="text-xs text-gray-500">Numbers only. No external requests. Runs entirely in your browser.</div>
        </form>

        <div className="space-y-4">
          <div className="bg-core-surface border border-core-primary/20 rounded-xl p-5">
            <h2 className="text-xl font-bold text-white mb-3">Estimated Value</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Estimated Range" value={`${prettyGBP(result.low)} – ${prettyGBP(result.high)}`} />
              <Stat label="Multiple Used" value={`${result.suggested}x`} />
              <Stat label="Risk Level" value={result.risk} />
              <Stat label="Growth Score" value={`${result.growthScore}/100`} />
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(summaryText)
                  } catch {}
                }}
                className="px-4 py-2 rounded bg-core-primary/10 border border-core-primary text-core-primary font-semibold hover:bg-core-primary hover:text-black transition-colors"
                aria-label="Copy summary"
              >
                Copy Result
              </button>
              <p className="text-xs text-gray-400 mt-3">{summaryText}</p>
            </div>
          </div>

          <div className="bg-core-bg border border-white/10 rounded-xl p-5">
            <h2 className="text-lg font-bold text-white mb-2">Quick Links</h2>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li><Link to="/" className="text-core-primary hover:underline">Home</Link></li>
              <li><Link to="/products" className="text-core-primary hover:underline">Products</Link></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="prose prose-invert max-w-none">
        <h2>How SaaS Valuation Works</h2>
        <p>
          Buyers and marketplaces typically anchor on annual recurring revenue (ARR) multiplied by a risk‑adjusted multiple.
          The baseline range for smaller SaaS businesses is often 3×–5× ARR. From there, growth, churn, margin and trading
          history push the multiple up or down.
        </p>
        <h2>What Affects SaaS Multiples</h2>
        <p>
          Strong month‑over‑month growth, clean financials, and stable retention increase confidence and therefore the multiple.
          High churn, heavy support burden, or short operating history compresses valuation. This tool weights those inputs to
          keep the output simple, founder‑friendly and realistic.
        </p>
        <h2>Why Growth &amp; Churn Matter</h2>
        <p>
          Growth compounds future cash flows while churn erodes them. Two products with the same MRR can be worth very different
          amounts depending on trajectory and retention. Low churn stabilises revenue; high churn demands deeper discounts.
        </p>
        <h2>FAQ</h2>
        <details>
          <summary>Is this an appraisal?</summary>
          <p>No. It is a quick directional estimate intended to help founders benchmark expectations before engaging brokers or buyers.</p>
        </details>
        <details>
          <summary>Does it store my inputs?</summary>
          <p>No. All calculations run locally in your browser. Nothing is sent to any server.</p>
        </details>
        <details>
          <summary>How can I improve my multiple?</summary>
          <p>Focus on retention, margin, and operational stability. Reduce churn drivers, raise prices thoughtfully, and streamline costs.</p>
        </details>
      </section>
    </div>
  )
}

function Field({ label, name, value, onChange, placeholder, suffix }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-300">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input
          inputMode="decimal"
          pattern="[0-9.]*"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded bg-core-surface border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-core-primary/40"
          aria-label={label}
        />
        {suffix ? <span className="text-gray-400 text-sm">{suffix}</span> : null}
      </div>
    </label>
  )
}

function Stat({ label, value }) {
  return (
    <div className="p-3 rounded bg-core-bg border border-white/10">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="font-semibold text-white">{value}</div>
    </div>
  )
}

