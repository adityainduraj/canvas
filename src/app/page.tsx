'use client';

import { useState } from 'react';

interface Message {
  id: number;
  content: string;
  role: 'user' | 'assistant';
  hasCanvas?: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      content: inputValue,
      role: 'user'
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        content: selectedTool === 'Canvas' 
          ? "Done! Your random document has been created in the canvas. Let me know if you'd like to expand it, edit it, or generate a continuation."
          : "I'm a ChatGPT clone! This is just a UI recreation.",
        role: 'assistant',
        hasCanvas: selectedTool === 'Canvas'
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    setShowToolsDropdown(false);
  };

  const clearSelectedTool = () => {
    setSelectedTool(null);
  };

  const CanvasPreview = () => (
    <div className="mt-4 bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#3a3a3a]">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="text-gray-300 font-medium">Random Document</span>
        </div>
        <button className="p-1 hover:bg-[#2a2a2a] rounded">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>
      
      {/* Content */}
      <div className="p-6 relative">
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gray-600"></div>
        <h1 className="text-3xl font-bold text-white mb-6">The Fox and the Forest</h1>
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p>
            On a quiet morning in early spring, a curious fox trotted along the edge of the forest. The trees, 
            still bare from winter, rustled gently in the breeze as birds called out in anticipation of warmer 
            days. The fox paused at a patch of freshly disturbed earth, sniffed the air, and then began to dig 
            with surprising urgency. Moments later, it unearthed a small bundle—an old leather pouch, 
            worn but intact.
          </p>
          <p className="text-gray-500">
            Inside the pouch were a handful of smooth river stones, a rusted iron key, and a folded piece of 
            parchment...
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#212121] text-white flex">
      {/* Left Sidebar */}
      <div className="w-16 bg-[#171717] flex flex-col items-center py-4 gap-4">
        <button className="w-10 h-10 rounded-lg hover:bg-[#2a2a2a] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18m-9-9v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button className="w-10 h-10 rounded-lg hover:bg-[#2a2a2a] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        <button className="w-10 h-10 rounded-lg hover:bg-[#2a2a2a] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button className="w-10 h-10 rounded-lg hover:bg-[#2a2a2a] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 20V10M18 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        
        {/* Bottom section */}
        <div className="mt-auto">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
            AI
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-[#171717] flex items-center justify-between px-6 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">ChatGPT</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="w-8 h-8 rounded-full hover:bg-[#3a3a3a] flex items-center justify-center cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {messages.length === 0 ? (
            <div className="text-center max-w-4xl w-full">
              <h1 className="text-4xl font-semibold mb-12 text-white">How can I help, Aditya?</h1>
            </div>
          ) : (
            <div className="w-full max-w-4xl space-y-6 mb-8 flex-1 overflow-y-auto pt-8">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'user' ? (
                    <div className="bg-[#2f2f2f] rounded-3xl px-6 py-4 max-w-xs md:max-w-md lg:max-w-lg">
                      <div className="text-white">{message.content}</div>
                    </div>
                  ) : (
                    <div className="max-w-none w-full">
                      <div className="text-white leading-relaxed mb-4">{message.content}</div>
                      {/* Action buttons */}
                      <div className="flex gap-2 mb-4">
                        <button className="p-2 hover:bg-[#2a2a2a] rounded">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-[#2a2a2a] rounded">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-[#2a2a2a] rounded">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-[#2a2a2a] rounded">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                            <path d="M1 4v6h6" stroke="currentColor" strokeWidth="2"/>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                      </div>
                      {message.hasCanvas && <CanvasPreview />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="w-full max-w-4xl pb-8">
            <form onSubmit={handleSendMessage} className="relative">
              <div className="relative bg-[#2f2f2f] border border-[#404040] rounded-3xl focus-within:border-[#565869]">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={selectedTool ? "Write or code" : "Ask anything"}
                  className="w-full resize-none bg-transparent px-6 py-4 text-white placeholder-gray-400 focus:outline-none text-lg leading-relaxed"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                
                {/* Tools and send button row */}
                <div className="flex items-center justify-between px-4 pb-4">
                  <div className="flex items-center gap-1">
                    {/* Tools button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                        className="flex items-center gap-2 bg-[#404040] hover:bg-[#4a4a4a] px-3 py-2 rounded-full text-sm text-gray-300"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 6V4m0 2a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m-6 8a2 2 0 1 0 0-4m0 4a2 2 0 1 0 0-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 1 0 0-4m0 4a2 2 0 1 0 0-4m0 4v2m0-6V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Tools
                      </button>
                      
                      {/* Tools Dropdown */}
                      {showToolsDropdown && (
                        <div className="absolute left-0 bottom-full mb-2 w-48 bg-[#2a2a2a] border border-[#404040] rounded-xl shadow-lg py-2">
                          <button 
                            onClick={() => handleToolSelect('Create image')}
                            className="w-full px-4 py-3 text-left hover:bg-[#3a3a3a] flex items-center gap-3"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                              <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2"/>
                              <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Create image
                          </button>
                          <button 
                            onClick={() => handleToolSelect('Think longer')}
                            className="w-full px-4 py-3 text-left hover:bg-[#3a3a3a] flex items-center gap-3"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                              <path d="M12 1v6m0 6v6" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Think longer
                          </button>
                          <button 
                            onClick={() => handleToolSelect('Deep research')}
                            className="w-full px-4 py-3 text-left hover:bg-[#3a3a3a] flex items-center gap-3"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Deep research
                          </button>
                          <button 
                            onClick={() => handleToolSelect('Web search')}
                            className="w-full px-4 py-3 text-left hover:bg-[#3a3a3a] flex items-center gap-3"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Web search
                          </button>
                          <button 
                            onClick={() => handleToolSelect('Canvas')}
                            className="w-full px-4 py-3 text-left hover:bg-[#3a3a3a] flex items-center gap-3"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="2"/>
                              <path d="M4 9h16" stroke="currentColor" strokeWidth="2"/>
                              <path d="M9 4v16" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Canvas
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Canvas pill indicator */}
                    {selectedTool === 'Canvas' && (
                      <button
                        type="button"
                        className="flex items-center gap-2 bg-[#404040] hover:bg-[#4a4a4a] px-3 py-2 rounded-full text-sm text-gray-300"
                      >
                        Canvas
                        <button
                          onClick={clearSelectedTool}
                          className="hover:bg-gray-400/20 rounded-full p-1"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </button>
                    )}
                  </div>
                  
                  {/* Right side - microphone and send button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 rounded-full hover:bg-[#404040] text-gray-400 hover:text-white"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2"/>
                        <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
                        <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                    
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center ${
                        inputValue.trim() 
                          ? 'bg-white text-black hover:bg-gray-100' 
                          : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M7 11l5-5m0 0l5 5m-5-5v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
