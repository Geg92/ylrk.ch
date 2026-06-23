import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatBot() {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const [isOpen, setIsOpen] = useState(false);
  
  // Set up dynamic initial message when language changes if no posts made
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or reset conversation when language flips
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: isEn 
          ? 'Hello! I am the YLRK AI assistant. Do you have questions about our wrapping services, lettering, or prices? I am happy to help you!'
          : 'Hallo! Ich bin der YLRK KI-Assistent. Haben Sie Fragen zu unseren Beschriftungen oder Preisen? Ich helfe Ihnen gerne weiter!'
      }
    ]);
  }, [language]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          language: language // Send active language to server
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Request failed');

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isEn
          ? 'Sorry, an error occurred. Please try again later or use our contact form.'
          : 'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal oder nutzen Sie unser Kontaktformular.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 sm:bottom-6 sm:right-6 bg-black text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105 z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label={isEn ? "Open chat" : "Chat öffnen"}
      >
        <Sparkles size={24} />
      </button>

      <div 
        className={`fixed bottom-20 right-6 sm:bottom-6 sm:right-6 w-[350px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-black/10 z-50 transition-all duration-300 origin-bottom-right flex flex-col overflow-hidden h-[500px] max-h-[calc(100vh-6rem)] ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-75 opacity-0 pointer-events-none'}`}
      >
        <div className="bg-black text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden p-1 shadow-sm">
              <img 
                src="/logo.png" 
                alt="YLRK Avatar" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
              <div className="hidden flex items-center justify-center w-full h-full bg-black text-white rounded-full">
                <span className="font-['Alex_Brush'] text-white text-base select-none leading-none -mt-0.5">y</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-wide text-sm leading-none">YLRK KI</span>
              <span className="text-[10px] text-white/70 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Online
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-surface/50">
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-black text-white rounded-tr-sm' 
                    : 'bg-white border border-black/5 text-brand-text shadow-sm rounded-tl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 bg-white border border-black/5 shadow-sm text-black">
                <Loader2 size={16} className="animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-black/5">
          <div className="flex items-center bg-brand-surface rounded-full pr-2 pl-4 py-1.5 focus-within:ring-1 focus-within:ring-black">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isEn ? "Ask something..." : "Fragen Sie etwas..."}
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-brand-muted py-2"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="bg-black text-white p-2 rounded-full disabled:opacity-50 disabled:bg-brand-muted transition-colors ml-2"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
