import { Check, X, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const Payments = () => {
  return (
    <div className="pt-10 pb-20">
      <Helmet>
        <title>Pricing & Plans - CoreLink Tech</title>
        <meta name="description" content="Transparent pricing for CoreLink Tech software. Choose from Core, Pro, or Yearly plans. Secure checkout, cancel anytime, and 14-day refund policy." />
        <link rel="canonical" href="https://corelink-website.onrender.com/payments" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Invest in Your Digital Ecosystem</h1>
          <p className="text-gray-400">
            Transparent pricing. No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Pricing Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Free Tier */}
          <div className="bg-core-surface border border-white/10 rounded-2xl p-8 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">CoreLink Free</h3>
            <p className="text-gray-400 text-sm mb-6">Essential diagnostics for everyone.</p>
            <div className="text-3xl font-bold text-white mb-8">£0<span className="text-sm font-normal text-gray-500">/mo</span></div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <FeatureItem text="Basic System Scan" active={true} />
              <FeatureItem text="Manual Optimization" active={true} />
              <FeatureItem text="DependencyWatch (Scan Only)" active={true} />
              <FeatureItem text="Real-time Monitoring" active={false} />
              <FeatureItem text="Auto-Optimization" active={false} />
              <FeatureItem text="Astra Angel Assistant" active={false} />
            </ul>

            <button className="w-full py-3 rounded border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">
              Current Plan
            </button>
          </div>

          {/* Core Tier - Updated */}
          <div className="bg-core-surface border border-core-primary rounded-2xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(0,240,255,0.15)] group hover:shadow-[0_0_60px_rgba(0,240,255,0.25)] transition-all duration-300">
            <div className="absolute top-0 right-0 left-0 bg-core-primary text-black text-xs font-bold py-1.5 text-center rounded-t-2xl">MOST POPULAR</div>
            <h3 className="text-xl font-bold text-white mb-2 mt-4">Core Tier</h3>
            <p className="text-gray-400 text-sm mb-6">Standard protection & optimization.</p>
            <div className="text-4xl font-bold text-core-primary mb-8">£4.99<span className="text-sm font-normal text-gray-500">/mo</span></div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <FeatureItem text="CoreLink Optimizer" active={true} highlight />
              <FeatureItem text="Windows Error Translator (Basic)" active={true} highlight />
              <FeatureItem text="System Health Monitor (Basic)" active={true} highlight />
              <FeatureItem text="Real-time Monitoring" active={true} highlight />
              <FeatureItem text="One-Click Optimization" active={true} highlight />
              <FeatureItem text="Astra Angel Assistant" active={false} />
            </ul>

            <a
              href="https://corelinktech.lemonsqueezy.com/checkout/buy/8cb7e013-76ef-4871-b19e-a12b70a69978"
              target="_blank"
              rel="noreferrer"
              className="w-full inline-block text-center py-4 rounded bg-core-primary text-black font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transform hover:scale-[1.02]"
            >
              Subscribe Core
            </a>
            <div className="text-center mt-3 text-[10px] text-gray-500 space-x-2">
              <span>Cancel anytime</span>
              <span>•</span>
              <span>No hidden fees</span>
              <span>•</span>
              <span>Secure checkout via Lemon Squeezy</span>
            </div>
          </div>

          {/* Pro Tier - Updated */}
          <div className="bg-core-surface border border-core-secondary rounded-2xl p-8 flex flex-col relative overflow-hidden group hover:shadow-[0_0_60px_rgba(188,19,254,0.25)] transition-all duration-300">
             <div className="absolute -right-12 top-6 rotate-45 bg-core-secondary text-white text-xs font-bold px-12 py-1 shadow-lg">ULTIMATE</div>
            <h3 className="text-xl font-bold text-white mb-2">Pro Tier</h3>
            <p className="text-gray-400 text-sm mb-6">Advanced AI & full automation.</p>
            <div className="text-4xl font-bold text-core-secondary mb-8">£9.99<span className="text-sm font-normal text-gray-500">/mo</span></div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <FeatureItem text="Everything in Core" active={true} highlight color="secondary" />
              <FeatureItem text="Error Translator (Advanced)" active={true} highlight color="secondary" />
              <FeatureItem text="Health Monitor (Advanced)" active={true} highlight color="secondary" />
              <FeatureItem text="Astra Angel Assistant" active={true} highlight color="secondary" />
              <FeatureItem text="Priority Support" active={true} highlight color="secondary" />
            </ul>

            <a
              href="https://corelinktech.lemonsqueezy.com/checkout/buy/8cb7e013-76ef-4871-b19e-a12b70a69978"
              target="_blank"
              rel="noreferrer"
              className="w-full inline-block text-center py-4 rounded bg-core-secondary text-white font-bold hover:bg-purple-600 transition-colors shadow-[0_0_20px_rgba(188,19,254,0.3)] hover:shadow-[0_0_30px_rgba(188,19,254,0.5)] transform hover:scale-[1.02]"
            >
              Subscribe Pro
            </a>
            <div className="text-center mt-3 text-[10px] text-gray-500 space-x-2">
              <span>Cancel anytime</span>
              <span>•</span>
              <span>No hidden fees</span>
              <span>•</span>
              <span>Secure checkout via Lemon Squeezy</span>
            </div>
          </div>

          {/* Yearly Tier - Updated */}
          <div className="bg-core-surface border border-amber-400 rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-[0_0_30px_rgba(251,191,36,0.15)] group hover:shadow-[0_0_60px_rgba(251,191,36,0.25)] transition-all duration-300">
             <div className="absolute -right-12 top-6 rotate-45 bg-amber-400 text-black text-xs font-bold px-12 py-1 shadow-lg">BEST VALUE</div>
            <h3 className="text-xl font-bold text-white mb-2">Yearly Pro</h3>
            <p className="text-gray-400 text-sm mb-6">All features. Maximum savings. Includes all current & future CoreLinkTech products.</p>
            <div className="text-4xl font-bold text-amber-400 mb-8">£49.99<span className="text-sm font-normal text-gray-500">/yr</span></div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <FeatureItem text="Everything in Pro" active={true} highlight color="tertiary" />
              <FeatureItem text="Save ~75% vs Monthly" active={true} highlight color="tertiary" />
              <FeatureItem text="Priority 24/7 Support" active={true} highlight color="tertiary" />
              <FeatureItem text="Early Access to Features" active={true} highlight color="tertiary" />
              <FeatureItem text="Astra Angel (Uncapped)" active={true} highlight color="tertiary" />
            </ul>

            <a
              href="https://corelinktech.lemonsqueezy.com/checkout/buy/8cb7e013-76ef-4871-b19e-a12b70a69978"
              target="_blank"
              rel="noreferrer"
              className="w-full inline-block text-center py-4 rounded bg-amber-400 text-black font-bold hover:bg-amber-300 transition-colors shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transform hover:scale-[1.02]"
            >
              Subscribe Yearly
            </a>
            <div className="text-center mt-3 text-[10px] text-gray-500 space-x-2">
              <span>Cancel anytime</span>
              <span>•</span>
              <span>No hidden fees</span>
              <span>•</span>
              <span>Secure checkout via Lemon Squeezy</span>
            </div>
          </div>
        </div>

        {/* Trust & Legitimacy */}
        <div className="text-center mb-16 text-gray-500 text-sm flex flex-col md:flex-row justify-center gap-4 md:gap-8 items-center">
          <span className="flex items-center gap-2"><Check size={16} className="text-core-primary" /> Built by CoreLinkTech</span>
          <span className="hidden md:inline">•</span>
          <span className="flex items-center gap-2"><Check size={16} className="text-core-primary" /> Designed for everyday users</span>
          <span className="hidden md:inline">•</span>
          <span className="flex items-center gap-2"><Check size={16} className="text-core-primary" /> Actively maintained & updated</span>
        </div>

        {/* DependencyWatch Special Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">DependencyWatch</h3>
              <p className="text-gray-400 mb-4">Professional cybersecurity for developers. OWASP Top 10 compliance & PyUp Safety integration.</p>
              <div className="flex gap-4">
                <span className="text-sm px-3 py-1 rounded bg-white/5 border border-white/10 text-gray-300">Vulnerability Scan</span>
                <span className="text-sm px-3 py-1 rounded bg-white/5 border border-white/10 text-gray-300">Compliance Check</span>
              </div>
            </div>
            <div className="text-right">
               <div className="text-2xl font-bold text-white mb-2">£29.99</div>
               <div className="text-xs text-gray-500 mb-4">One-time purchase</div>
               <a
                 href="https://corelinktech.lemonsqueezy.com/checkout/buy/8edeac92-fad1-46bd-970a-89a9216aacc8"
                 target="_blank"
                 rel="noreferrer"
                 className="inline-block px-6 py-2 rounded bg-white text-black font-bold hover:bg-gray-200 transition-colors"
               >
                 Buy License
               </a>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          <div className="bg-core-bg p-6 rounded-xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="text-core-secondary" size={20} /> Refund Policy
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We believe in our products. If you are not satisfied with your subscription, you can request a full refund within 14 days of your initial purchase. No questions asked. We prioritize your trust over a single transaction.
            </p>
          </div>
          <div className="bg-core-bg p-6 rounded-xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <X className="text-red-400" size={20} /> Cancellation
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              You are in control. You can cancel your subscription at any time through your account settings. Access will continue until the end of your current billing period. No hidden fees or difficult cancellation flows.
            </p>
          </div>
        </div>

        {/* Terms & Privacy Snippets */}
        <div className="text-center border-t border-white/10 pt-8">
          <h4 className="text-white font-bold mb-4">Privacy & Data Usage</h4>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto mb-6">
            CoreLink tools operate on a Local First philosophy. Your diagnostic data is processed locally on your machine whenever possible. We do not sell your personal data to third parties.
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <Link to="/legal" className="text-core-primary hover:underline">Terms of Service</Link>
            <Link to="/legal" className="text-core-primary hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const FeatureItem = ({ text, active, highlight, color = 'primary' }) => {
  let checkColor = 'text-core-primary';
  if (color === 'secondary') checkColor = 'text-core-secondary';
  if (color === 'tertiary') checkColor = 'text-amber-400';
  
  return (
    <li className={`flex items-center text-sm ${active ? (highlight ? 'text-white' : 'text-gray-300') : 'text-gray-600'}`}>
      {active ? (
        <Check className={`mr-3 ${highlight ? checkColor : 'text-gray-500'}`} size={18} />
      ) : (
        <X className="mr-3" size={18} />
      )}
      {text}
    </li>
  )
}

export default Payments
