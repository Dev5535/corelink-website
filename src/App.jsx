import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import Payments from './pages/Payments'
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import AstraAngel from './components/AstraAngel';
import UmamiAnalytics from './components/UmamiAnalytics';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-core-primary selection:text-core-bg">
      <UmamiAnalytics />
      <Navbar />
      <main className="flex-grow relative overflow-hidden">
        
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal" element={<Legal />} />
          </Routes>
        </div>
        <Footer />
        <AstraAngel />
      </main>
    </div>
  )
}

export default App
