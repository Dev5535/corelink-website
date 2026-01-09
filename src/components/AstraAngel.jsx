import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Heart, Shield, Cpu, Info } from 'lucide-react';

const AstraAngel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Greetings. I am Astra Angel, your CoreLink guardian. How may I assist you today? I can help with tech support, pricing, or simply offer a moment of calm.", 
      sender: 'bot',
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState('general'); // general, tech, wellbeing
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue, sender: 'user', type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const response = generateResponse(userMsg.text, mode);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'bot', type: 'text' }]);
    }, 1000);
  };

  const handleQuickAction = (action) => {
    const userMsg = { id: Date.now(), text: action, sender: 'user', type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    
    setTimeout(() => {
      let response = "";
      switch(action) {
        case "Pricing Options":
          response = "CoreLink offers two main protection tiers:\n\n**Core Tier (£4.99/mo)**: Includes CoreLink Optimizer, Basic Error Translator, and Basic System Health Monitor.\n\n**Pro Tier (£9.99/mo)**: Upgrades you to Advanced features and includes full access to me, the Astra Angel Assistant.\n\nAll subscriptions can be cancelled anytime.";
          break;
        case "Tech Help Mode":
          setMode('tech');
          response = "Tech Help Mode activated. Please describe the system issue you are facing. Remember, I can translate error codes and optimize performance.";
          break;
        case "Wellbeing Mode":
          setMode('wellbeing');
          response = "Wellbeing Mode activated. Take a deep breath. Technology should serve you, not stress you. How are you feeling right now?";
          break;
        case "Refund Policy":
          response = "We believe in trust. You may cancel your subscription at any time via the website. If you are unsatisfied, please contact us for a refund discussion. We aim for clarity and fairness.";
          break;
        default:
          response = "I am here to help.";
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'bot', type: 'text' }]);
    }, 800);
  };

  const generateResponse = (input, currentMode) => {
    const lowerInput = input.toLowerCase();

    // HARD RULES - Safety First
    if (lowerInput.includes('doctor') || lowerInput.includes('pain') || lowerInput.includes('medical') || lowerInput.includes('suicide') || lowerInput.includes('hurt')) {
      return "I am an AI assistant, not a medical professional. If you are in distress or need medical attention, please contact local emergency services or a healthcare provider immediately.";
    }
    if (lowerInput.includes('lawyer') || lowerInput.includes('legal') || lowerInput.includes('sue')) {
      return "I cannot provide legal advice. For legal matters, please consult a qualified attorney.";
    }

    // Contextual Responses
    if (currentMode === 'wellbeing') {
      if (lowerInput.includes('stressed') || lowerInput.includes('tired') || lowerInput.includes('anxious')) {
        return "It is okay to step away. Screen fatigue is real. Consider taking a short walk or drinking some water. Your health is the priority.";
      }
      return "I hear you. Remember to pace yourself. Would you like to switch back to general assistance?";
    }

    if (currentMode === 'tech') {
      if (lowerInput.includes('slow') || lowerInput.includes('lag')) {
        return "System lag is often caused by background processes. The CoreLink Optimizer can help clear unnecessary tasks. Would you like to know more about it?";
      }
      return "I can help analyze that. For detailed diagnostics, the System Health Monitor is recommended. Please provide more details.";
    }

    // General Logic
    if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('subscription')) {
      return "We offer the Core Tier at £4.99/mo and the Pro Tier at £9.99/mo. DependencyWatch is available as a separate one-time purchase for developers.";
    }
    if (lowerInput.includes('cancel') || lowerInput.includes('refund')) {
      return "You can cancel your subscription at any time through the Payments tab. We do not lock you in.";
    }
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello. I am Astra Angel. How can I protect or empower you today?";
    }

    return "I understand. I am constantly learning to better serve the CoreLink ecosystem. Is there anything specific regarding our products or services I can clarify?";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-core-surface/95 backdrop-blur-xl border border-core-primary/30 rounded-2xl w-[350px] h-[500px] shadow-[0_0_30px_rgba(188,19,254,0.2)] flex flex-col mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-core-bg to-core-surface p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="font-display font-bold text-white">Astra Angel</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-core-primary border border-core-primary/20 capitalize">{mode} Mode</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-core-primary/20 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-core-primary/20 text-white rounded-tr-sm border border-core-primary/20' 
                      : 'bg-white/5 text-gray-200 rounded-tl-sm border border-white/5'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-2 border-t border-white/5 flex gap-2 overflow-x-auto scrollbar-none">
              <button onClick={() => handleQuickAction('Pricing Options')} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-core-primary/10 text-xs text-core-primary border border-core-primary/20 transition-colors">
                Pricing
              </button>
              <button onClick={() => handleQuickAction('Tech Help Mode')} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-cyan-500/10 text-xs text-cyan-400 border border-cyan-500/20 transition-colors">
                Tech Help
              </button>
              <button onClick={() => handleQuickAction('Wellbeing Mode')} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-500/10 text-xs text-purple-400 border border-purple-500/20 transition-colors">
                Wellbeing
              </button>
              <button onClick={() => handleQuickAction('Refund Policy')} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/10 transition-colors">
                Refunds
              </button>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-black/20 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500"
              />
              <button onClick={handleSend} className="text-core-primary hover:text-white transition-colors">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(188,19,254,0.4)] transition-colors border border-core-primary/50 overflow-hidden ${
          isOpen ? 'bg-core-surface text-white' : 'bg-core-surface/90 backdrop-blur-sm'
        }`}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <img 
            src="/assets/neon_angel.png" 
            alt="Astra Angel" 
            className="w-full h-full object-cover p-1"
          />
        )}
      </motion.button>
    </div>
  );
};

export default AstraAngel;
