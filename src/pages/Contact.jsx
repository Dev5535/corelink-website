import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

const Contact = () => {
  return (
    <div className="pt-10 pb-20">
      <Helmet>
        <title>Contact Us - CoreLink Tech</title>
        <meta name="description" content="Get in touch with CoreLink Tech. Support, business inquiries, and custom service requests. Email us or find us on Discord." />
        <link rel="canonical" href="https://corelink-website.onrender.com/contact" />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Contact Me</h1>
          <p className="text-gray-400">
            Have questions about CoreLink products or services? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <ContactMethod 
            icon={<Mail className="text-core-primary" size={24} />}
            title="Email"
            value="devshahsasu1211@gmail.com"
            link="mailto:devshahsasu1211@gmail.com"
          />
          <ContactMethod 
            icon={<MessageSquare className="text-core-secondary" size={24} />}
            title="Discord"
            value="Broken_Angel"
            link="#"
            copy
          />
        </div>

        <div className="bg-core-surface border border-white/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input type="text" className="w-full bg-core-bg border border-white/10 rounded px-4 py-3 text-white focus:border-core-primary focus:outline-none transition-colors" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input type="email" className="w-full bg-core-bg border border-white/10 rounded px-4 py-3 text-white focus:border-core-primary focus:outline-none transition-colors" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
              <select className="w-full bg-core-bg border border-white/10 rounded px-4 py-3 text-white focus:border-core-primary focus:outline-none transition-colors">
                <option>General Inquiry</option>
                <option>Support</option>
                <option>Custom Service Request</option>
                <option>Business</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea rows={5} className="w-full bg-core-bg border border-white/10 rounded px-4 py-3 text-white focus:border-core-primary focus:outline-none transition-colors" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full py-4 bg-core-primary/10 border border-core-primary text-core-primary font-bold rounded hover:bg-core-primary hover:text-black transition-all duration-300 flex items-center justify-center gap-2">
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const ContactMethod = ({ icon, title, value, link, copy }) => (
  <motion.a 
    href={link}
    whileHover={{ y: -5 }}
    className="flex flex-col items-center justify-center p-8 bg-core-surface border border-white/5 rounded-xl hover:border-core-primary/30 transition-all duration-300 cursor-pointer"
    onClick={() => {
      if (copy) {
        navigator.clipboard.writeText(value)
        // Could add toast here
      }
    }}
  >
    <div className="mb-4 p-4 bg-core-bg rounded-full border border-white/5">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
    <p className="text-core-primary font-mono text-sm">{value}</p>
    {copy && <span className="text-xs text-gray-500 mt-2">Click to copy</span>}
  </motion.a>
)

export default Contact
