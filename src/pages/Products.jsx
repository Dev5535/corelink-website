import { motion } from 'framer-motion'
import { Check, Star, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

const Products = () => {
  const software = [
    {
      id: 'optimizer',
      name: 'CoreLink Optimizer',
      price: 'Core Tier (£4.99/mo)',
      desc: 'System optimization with real-time monitoring and privacy-first local processing.',
      features: ['Real-time Monitoring', 'One-click Optimize', 'Local Processing'],
      type: 'subscription'
    },
    {
      id: 'translator',
      name: 'Windows Error Translator',
      price: 'Core / Pro',
      desc: 'Plain-English error explanations with actionable fixes. Advanced features available in Pro.',
      features: ['Instant Translation', 'Actionable Fixes', 'Crash Analysis'],
      type: 'subscription'
    },
    {
      id: 'monitor',
      name: 'System Health Monitor',
      price: 'Core / Pro',
      desc: 'Live diagnostics for CPU, RAM, Disk, and Temperature. Know your system inside out.',
      features: ['Live Diagnostics', 'Hardware Stats', 'Temp Monitoring'],
      type: 'subscription'
    },
    {
      id: 'astra',
      name: 'Astra Angel Assistant',
      price: 'Pro Tier (£9.99/mo)',
      desc: 'Personal AI helper with guardian-style support. Includes Tech Help & Wellbeing modes.',
      features: ['Tech Support Mode', 'Wellbeing Mode', 'Guardian AI'],
      type: 'subscription'
    },
    {
      id: 'dependency',
      name: 'DependencyWatch',
      price: '£29.99 (One-time)',
      desc: 'Professional cybersecurity tool with PyUp Safety integration and OWASP Top 10 compliance checks.',
      features: ['Vulnerability Scan', 'PyUp Integration', 'OWASP Checks'],
      type: 'onetime'
    },
    {
      id: 'ai-trading',
      name: 'AI Trading System',
      price: 'Coming Soon',
      desc: 'offline AI Trading guide No Internet required',
      features: ['Offline Guide', 'No Internet Required', 'Mobile Only'],
      badges: ['🟡 Coming Soon', '📱 Mobile Only'],
      type: 'coming-soon'
    },
    {
      id: 'ai-inbox',
      name: 'AI Inbox & Admin Automation',
      price: 'Yearly Pro Exclusive',
      desc: 'Automate your inbox and administrative workload using intelligent AI workflows. Instantly prioritise messages, reduce manual admin tasks, and keep operations running smoothly without constant supervision.',
      tagline: 'Turn chaos into control — automatically.',
      features: ['Intelligent Workflows', 'Message Prioritisation', 'Admin Automation'],
      type: 'yearly-exclusive'
    },
    {
      id: 'lead-auto',
      name: 'Lead Automation',
      price: 'Yearly Pro Exclusive',
      desc: 'Capture, qualify, and manage leads automatically with smart automation. Reduce manual follow-ups, improve response speed, and ensure no opportunity slips through the cracks.',
      tagline: 'Let automation do the follow-up.',
      features: ['Lead Capture', 'Auto Qualification', 'Smart Follow-ups'],
      type: 'yearly-exclusive'
    }
  ]

  const services = [
    {
      name: 'Python → EXE Service',
      price: 'One-time',
      desc: 'Professional compilation of your Python scripts into standalone executables.',
      type: 'onetime'
    },
    {
      name: 'Feature Expansion',
      price: 'One-time',
      desc: 'Add specific features to your existing CoreLink tools tailored to your workflow.',
      type: 'onetime'
    },
    {
      name: 'Tier Expansion',
      price: 'One-time',
      desc: 'Upgrade specific legacy plans or custom enterprise tier arrangements.',
      type: 'onetime'
    },
    {
      name: 'Launch Risk Intelligence System',
      price: 'Premium Plus',
      desc: 'Deterministic launch risk analysis with digital twin auditing and compliance mapping, delivered in partnership with the Launch Risk Intelligence System platform.',
      type: 'onetime',
      contact: true
    },
    {
      name: 'Custom Private Product',
      price: 'Premium',
      desc: 'Bespoke software solutions. Contact Broken_Angel on Discord for consultation.',
      type: 'onetime',
      contact: true
    }
  ]

  return (
    <div className="pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Software Suite</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Professional grade tools designed to translate complex system data into actionable insights.
          </p>
        </div>

        {/* Software Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {software.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Services Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Professional Services</h2>
          <p className="text-gray-400">Expert implementation and customization services.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <ServiceCard key={idx} service={service} />
          ))}
        </div>
      </div>
    </div>
  )
}

const ProductCard = ({ product }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-core-surface border border-white/5 rounded-xl p-6 flex flex-col relative overflow-hidden group"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-core-primary to-core-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold text-white">{product.name}</h3>
      {product.id === 'optimizer' && <Star className="text-core-primary fill-core-primary" size={20} />}
    </div>

    {product.badges && (
      <div className="flex flex-wrap gap-2 mb-4">
        {product.badges.map((badge, idx) => (
          <span key={idx} className="px-2 py-1 text-xs font-medium rounded bg-white/5 text-core-secondary border border-white/10">
            {badge}
          </span>
        ))}
      </div>
    )}
    
    <p className="text-gray-400 text-sm mb-6 flex-grow">{product.desc}</p>
    
    <ul className="space-y-3 mb-8">
      {product.features.map((feature, idx) => (
        <li key={idx} className="flex items-center text-sm text-gray-300">
          <Check className="text-core-secondary mr-2" size={16} />
          {feature}
        </li>
      ))}
    </ul>

    <div className="mt-auto">
      <div className="text-xl font-bold text-white mb-4">{product.price}</div>
      {product.type === 'coming-soon' ? (
        <button disabled className="block w-full text-center py-3 rounded border border-white/10 bg-white/5 text-gray-500 cursor-not-allowed font-bold">
          Coming Soon
        </button>
      ) : product.type === 'yearly-exclusive' ? (
        <>
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-400">
            <Lock size={14} />
            <span>Included with CoreLink Yearly Pro</span>
          </div>
          <a
            href="https://corelinktech.lemonsqueezy.com/checkout/buy/8cb7e013-76ef-4871-b19e-a12b70a69978"
            target="_blank"
            rel="noreferrer"
            className="block w-full text-center py-3 rounded border font-bold transition-all duration-300 bg-core-primary/10 border-core-primary text-core-primary hover:bg-core-primary hover:text-black"
          >
            Upgrade to Yearly Pro
          </a>
        </>
      ) : (
        product.type === 'subscription' ? (
          <a
            href="https://corelinktech.lemonsqueezy.com/checkout/buy/8cb7e013-76ef-4871-b19e-a12b70a69978"
            target="_blank"
            rel="noreferrer"
            className="block w-full text-center py-3 rounded border font-bold transition-all duration-300 bg-core-primary/10 border-core-primary text-core-primary hover:bg-core-primary hover:text-black"
          >
            Subscribe Now
          </a>
        ) : (
          <Link 
            to="/contact" 
            className="block w-full text-center py-3 rounded border font-bold transition-all duration-300 bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            Purchase License
          </Link>
        )
      )}
    </div>
  </motion.div>
)

const ServiceCard = ({ service }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-core-bg border border-white/10 rounded-xl p-6 flex flex-col"
  >
    <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
    <p className="text-gray-400 text-sm mb-6 flex-grow">{service.desc}</p>
    <div className="mt-auto flex justify-between items-center">
      <span className="font-mono text-core-secondary">{service.price}</span>
      <Link to="/contact" className="text-sm underline text-white hover:text-core-primary">
        {service.contact ? 'Contact Us' : 'Inquire'}
      </Link>
    </div>
  </motion.div>
)

export default Products
