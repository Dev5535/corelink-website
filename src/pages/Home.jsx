import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

const Home = () => {
  const baseDomain = import.meta.env.VITE_ACTIVE_DOMAIN || (typeof window !== 'undefined' ? window.location.host : 'corelink-website.onrender.com')
  const baseUrl = `https://${baseDomain}`
  return (
    <div className="relative">
      <Helmet>
        <title>CoreLink Tech - Professional System Optimization & Error Translation</title>
        <meta name="description" content="Translate complexity into clarity. Protect, optimize, and empower your PC with CoreLink Tech's professional grade tools for system diagnostics and error translation." />
        <link rel="canonical" href={`${baseUrl}/`} />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CoreLink Tech",
              "url": "${baseUrl}/",
              "logo": "${baseUrl}/assets/neon_angel.png",
              "description": "Professional software suite for system optimization, error translation, and personal intelligence tools.",
              "sameAs": []
            }
          `}
        </script>
      </Helmet>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-core-primary via-white to-core-secondary">
                Translate Complexity
              </span>
              <br />
              <span className="text-white">Into Clarity</span>
            </h1>
            <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Protect, optimize, and empower. Professional grade tools for system diagnostics, 
              optimization, and error translation.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                to="/products" 
                className="px-8 py-4 bg-core-primary/10 border border-core-primary text-core-primary rounded hover:bg-core-primary hover:text-black transition-all duration-300 font-bold flex items-center gap-2"
              >
                Explore Software <ArrowRight size={20} />
              </Link>
              <Link 
                to="/saas-valuation-calculator" 
                className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10 transition-all duration-300 font-bold flex items-center gap-2"
              >
                SaaS Valuation Tool
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-core-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <FeatureCard 
              icon={<Zap className="text-core-primary" size={40} />}
              title="System Optimization"
              desc="Real-time monitoring and one-click optimization for peak performance."
            />
            <FeatureCard 
              icon={<Shield className="text-core-secondary" size={40} />}
              title="Privacy First"
              desc="Local processing keeps your diagnostic data on your machine. Zero leaks."
            />
            <FeatureCard 
              icon={<Lock className="text-core-accent" size={40} />}
              title="Error Translation"
              desc="Understand what went wrong. Plain-English explanations for complex errors."
            />
          </div>

          {/* More Coming Soon */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm border border-white/10 bg-white/5 rounded-full px-6 py-2 inline-block">
              🚀 More features and products are coming soon and will be included in Pro plans.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 rounded-2xl bg-core-bg border border-white/5 hover:border-core-primary/50 transition-all duration-300"
  >
    <div className="mb-6">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
)

export default Home
