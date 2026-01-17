import { useState } from 'react'
import { motion } from 'framer-motion'

const Legal = () => {
  const [activeTab, setActiveTab] = useState('privacy')

  return (
    <div className="pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Legal & Compliance</h1>
          <p className="text-gray-400">
            Clear terms. Transparent privacy. No legalese.
          </p>
        </div>

        <div className="flex justify-center mb-12 border-b border-white/10">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'privacy' 
                ? 'border-core-primary text-white' 
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'terms' 
                ? 'border-core-secondary text-white' 
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Terms of Service
          </button>
        </div>

        <div className="bg-core-surface border border-white/5 rounded-2xl p-8 md:p-12">
          {activeTab === 'privacy' && <PrivacyContent />}
          {activeTab === 'terms' && <TermsContent />}
        </div>
      </div>
    </div>
  )
}

const PrivacyContent = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-core-primary mb-6">Privacy Policy</h2>
    <p className="text-gray-300 mb-4">Effective Date: {new Date().toLocaleDateString()}</p>
    
    <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Local First Philosophy</h3>
    <p className="text-gray-400 mb-6">
      CoreLink Tech operates on a strict &quot;Local First&quot; basis. Our diagnostic tools (Optimizer, Error Translator, Health Monitor) process your system data locally on your machine. We do not upload your personal files, system logs, or error dumps to our servers unless you explicitly opt-in for manual support.
    </p>

    <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Data We Collect</h3>
    <ul className="list-disc pl-5 text-gray-400 space-y-2 mb-6">
      <li><strong>License Validation:</strong> We collect a hashed hardware ID to validate your subscription license.</li>
      <li><strong>Payment Info:</strong> All payments are processed securely via our payment provider. We do not store your credit card details.</li>
      <li><strong>Usage Stats (Optional):</strong> If enabled, we collect anonymous usage statistics (e.g., &quot;Optimizer run 5 times&quot;) to improve our products.</li>
    </ul>

    <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Data Security</h3>
    <p className="text-gray-400 mb-6">
      We use industry-standard encryption for all data transmission. Your data is yours. We do not sell, trade, or rent your personal identification information to others.
    </p>
  </motion.div>
)

const TermsContent = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-invert max-w-none">
    <h2 className="text-2xl font-bold text-core-secondary mb-6">Terms of Service</h2>
    <p className="text-gray-300 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

    <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h3>
    <p className="text-gray-400 mb-6">
      By accessing or using CoreLink Tech products, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
    </p>

    <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Subscription & Refunds</h3>
    <p className="text-gray-400 mb-6">
      Subscriptions are billed in advance on a monthly basis. You may cancel at any time. We offer a 14-day money-back guarantee for all first-time subscriptions. Refunds are processed within 5-7 business days.
    </p>

    <h3 className="text-xl font-bold text-white mt-8 mb-4">3. License Usage</h3>
    <p className="text-gray-400 mb-6">
      We grant you a limited, non-exclusive, non-transferable license to use our software for personal or commercial use on the number of devices specified in your plan. You may not reverse engineer, decompile, or disassemble the software.
    </p>

    <h3 className="text-xl font-bold text-white mt-8 mb-4">4. Disclaimer</h3>
    <p className="text-gray-400 mb-6">
      Our software is provided &quot;as is&quot;. While we strive for perfection, CoreLink Tech makes no warranties, expressed or implied, regarding the reliability or accuracy of our diagnostic tools. Always backup your data before performing system optimizations.
    </p>
  </motion.div>
)

export default Legal
