import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { FOUNDATION_INFO } from '../data/foundationData';
import { BrandLogo } from './common/BrandLogo';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const JyotiBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'नमस्ते! 🙏 मैं जीवन ज्योति फाउंडेशन (ग़ाज़ीपुर, उत्तर प्रदेश, भारत) की आधिकारिक डिजिटल सहायक "ज्योति एआई" हूँ। मैं आपकी क्या सहायता कर सकती हूँ?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      if (!response.ok) throw new Error('Chat API error');
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: data.reply || 'जीवन ज्योति फाउंडेशन गाजीपुर, उत्तर प्रदेश, भारत में आपका स्वागत है।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'जीवन ज्योति फाउंडेशन गाजीपुर, उत्तर प्रदेश, भारत (Reg. No: GAZ/03373) में आपका स्वागत है। हमारे 80G दान, शिक्षा शिविर व स्वयंसेवक कार्यक्रम की अधिक जानकारी के लिए आप मुख्य पृष्ठ देख सकते हैं।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-600 to-[#8B0000] text-white p-3.5 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border-2 border-amber-300 group"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="hidden sm:inline font-bold text-xs pr-1">ज्योति एआई (Jyoti AI)</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border-2 border-amber-300 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#8B0000] to-amber-700 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BrandLogo size={36} className="shrink-0 drop-shadow-xs" />
              <div>
                <h4 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  ज्योति एआई (Jyoti AI)
                  <span className="text-[9px] bg-emerald-500 px-1.5 py-0.2 rounded-full font-sans font-bold">
                    ONLINE
                  </span>
                </h4>
                <p className="text-[10px] text-amber-200">
                  {FOUNDATION_INFO.nameEnglish}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#FFFAF0]/40 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-[#8B0000] text-white rounded-br-none'
                      : 'bg-white border border-amber-200 text-gray-800 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  <span
                    className={`block text-[8.5px] mt-1 ${
                      m.sender === 'user' ? 'text-amber-200 text-right' : 'text-gray-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-amber-200 p-2.5 rounded-2xl rounded-bl-none flex items-center gap-2 text-gray-500 shadow-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                  <span className="text-[11px]">ज्योति एआई सोच रही है...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-amber-50/80 border-t border-amber-100 flex gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
            <button
              onClick={() => setInput('80G टैक्स छूट रसीद कैसे मिलेगी?')}
              className="px-2 py-1 bg-white border border-amber-300 rounded-full shrink-0 hover:bg-amber-100 cursor-pointer"
            >
              80G कर छूट
            </button>
            <button
              onClick={() => setInput('वॉलंटियर सर्टिफिकेट कैसे बनाएं?')}
              className="px-2 py-1 bg-white border border-amber-300 rounded-full shrink-0 hover:bg-amber-100 cursor-pointer"
            >
              वॉलंटियर सर्टिफिकेट
            </button>
            <button
              onClick={() => setInput('संस्था का पता और संपर्क विवरण क्या है?')}
              className="px-2 py-1 bg-white border border-amber-300 rounded-full shrink-0 hover:bg-amber-100 cursor-pointer"
            >
              संपर्क सूत्र
            </button>
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="पूछें (Ask anything about NGO)..."
              className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-amber-600"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-[#8B0000] text-white rounded-xl disabled:opacity-50 hover:bg-[#6b0000] cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default JyotiBot;
