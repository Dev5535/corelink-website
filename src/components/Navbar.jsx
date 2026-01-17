import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingBag, Cpu, CreditCard, Mail, Home } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Products', path: '/products', icon: <Cpu size={18} /> },
    { name: 'Merch', path: '/merch', icon: <ShoppingBag size={18} /> },
    { name: 'Payments', path: '/payments', icon: <CreditCard size={18} /> },
    { name: 'Contact', path: '/contact', icon: <Mail size={18} /> },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-core-bg/80 backdrop-blur-md border-b border-core-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <img src="/assets/neon_angel.png" alt="CoreLinkTech" className="h-10 w-10 object-contain drop-shadow-[0_0_10px_rgba(188,19,254,0.5)]" />
            <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-core-primary to-core-secondary">
              CoreLinkTech
            </span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2
                    ${isActive(link.path) 
                      ? 'text-core-primary bg-core-primary/10 shadow-[0_0_10px_rgba(0,240,255,0.2)]' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-core-surface border-b border-core-primary/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2
                  ${isActive(link.path)
                    ? 'text-core-primary bg-core-primary/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
