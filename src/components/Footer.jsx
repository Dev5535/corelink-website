import { Link } from 'react-router-dom'
import { Github, Twitter, MessageSquare } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-core-surface border-t border-core-primary/10 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/assets/neon_angel.png" alt="CoreLinkTech" className="h-8 w-8 object-contain" />
              <span className="text-xl font-display font-bold text-white">
                CoreLinkTech
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Translate complexity into clarity. Protect, optimize, and empower. 
              Operating autonomously to secure your digital future.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-core-primary tracking-wider uppercase">Products</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-white text-sm">Optimizer</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white text-sm">Astra Angel</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white text-sm">System Health</Link></li>
              <li><Link to="/merch" className="text-gray-400 hover:text-white text-sm">Official Merch</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-core-primary tracking-wider uppercase">Legal & Contact</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm">Contact Me</Link></li>
              <li><Link to="/legal" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link></li>
              <li><Link to="/legal" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link></li>
              <li><Link to="/payments" className="text-gray-400 hover:text-white text-sm">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CoreLink Tech. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-core-primary">
              <span className="sr-only">Discord</span>
              <MessageSquare size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-core-primary">
              <span className="sr-only">Twitter</span>
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-core-primary">
              <span className="sr-only">GitHub</span>
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
