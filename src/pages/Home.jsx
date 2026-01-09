import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react'

const Home = () => {
  return (
    <div className="relative">
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
                to="/merch" 
                className="px-8 py-4 bg-core-secondary/10 border border-core-secondary text-core-secondary rounded hover:bg-core-secondary hover:text-white transition-all duration-300 font-bold"
              >
                View Merch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-core-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
