'use client';

import { useState, useRef, useEffect } from 'react';

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
  const [isCanvasExpanded, setIsCanvasExpanded] = useState(false);
  const [animationState, setAnimationState] = useState<'initial' | 'ui-fade-out' | 'bg-change' | 'expanding' | 'content-repositioning' | 'expanded' | 'conversation-fade-in'>('initial');
  const canvasPreviewRef = useRef<HTMLDivElement>(null);
  const [canvasPosition, setCanvasPosition] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [splitRatio, setSplitRatio] = useState(0.25); // 25% for conversation, 75% for canvas
  const [isDragging, setIsDragging] = useState(false);

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
          ? "Done! Your random document has been created in the canvas. Let me know if you&apos;d like to expand it, edit it, or generate a continuation."
          : "I&apos;m a ChatGPT clone! This is just a UI recreation.",
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

  const handleExpandCanvas = () => {
    if (!canvasPreviewRef.current || isCanvasExpanded) return;
    
    // Capture initial position and dimensions
    const rect = canvasPreviewRef.current.getBoundingClientRect();
    setCanvasPosition({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    });
    
    setIsCanvasExpanded(true);
    
    // Start animation sequence
    setTimeout(() => setAnimationState('ui-fade-out'), 0);
    setTimeout(() => setAnimationState('bg-change'), 0); // Start color change immediately
    setTimeout(() => setAnimationState('expanding'), 50); // Start expansion almost immediately
    setTimeout(() => setAnimationState('content-repositioning'), 50); // Simultaneous with expansion
    setTimeout(() => setAnimationState('conversation-fade-in'), 400); // Start 50ms before expansion completes
    setTimeout(() => setAnimationState('expanded'), 450);
  };

  const handleCloseCanvas = () => {
    if (!isCanvasExpanded) return;
    
    // Reverse animation sequence would go here
    setIsCanvasExpanded(false);
    setAnimationState('initial');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newRatio = e.clientX / window.innerWidth;
    // Constrain between 20% and 80%
    const constrainedRatio = Math.max(0.2, Math.min(0.8, newRatio));
    setSplitRatio(constrainedRatio);
  };

  // Force re-render of canvas padding when splitRatio changes
  const [, forceUpdate] = useState({});
  useEffect(() => {
    if (isCanvasExpanded && isDragging) {
      forceUpdate({}); // Force component re-render for instant padding updates
    }
  }, [splitRatio, isCanvasExpanded, isDragging]);

  // Calculate dynamic padding based on available space
  const getCanvasPadding = () => {
    if (!isCanvasExpanded) return '5.5rem'; // collapsed state
    
    // Use the actual canvas area width, not full viewport
    const canvasAreaWidthRatio = (1 - splitRatio); // Canvas gets this fraction of the screen
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const actualCanvasWidth = canvasAreaWidthRatio * viewportWidth; // Actual canvas area width in pixels
    
    const minTextWidth = 800; // Minimum text content width to protect current layout
    const minPaddingBuffer = 24; // Minimum padding to always maintain (24px per side)
    const maxPaddingPerSide = 400; // Maximum padding per side in pixels
    
    // Calculate available space for padding (actual canvas width minus minimum text width minus minimum buffer)
    const availableForPadding = Math.max(0, actualCanvasWidth - minTextWidth - (minPaddingBuffer * 2));
    
    // Divide by 2 for left and right padding, but cap at maximum, and always add back minimum buffer
    const calculatedPaddingPerSide = Math.min(maxPaddingPerSide, availableForPadding / 2) + minPaddingBuffer;
    
    return `${calculatedPaddingPerSide}px`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove]);

  const clearSelectedTool = () => {
    setSelectedTool(null);
  };

  const CanvasPreview = () => (
    <div 
      ref={canvasPreviewRef}
      className={`mt-4 border border-[#3a3a3a] rounded-xl overflow-hidden transition-all duration-100 ${
        animationState === 'bg-change' || animationState === 'expanding' || animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
          ? 'bg-[#212121]' 
          : 'bg-[#1a1a1a]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#3a3a3a]">
        <div 
          className={`flex items-center gap-2 transition-all duration-300 ${
            animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
              ? 'transform -translate-y-2' 
              : ''
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="text-gray-300 font-medium">Random Document</span>
        </div>
        <button 
          onClick={isCanvasExpanded ? handleCloseCanvas : handleExpandCanvas}
          className={`p-1 hover:bg-[#2a2a2a] rounded transition-all duration-300 ${
            animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
              ? 'transform translate-x-2 -translate-y-2' 
              : ''
          }`}
        >
          {isCanvasExpanded ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="2"/>
            </svg>
          )}
        </button>
      </div>
      
      {/* Content */}
      <div className="p-6 relative">
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gray-600"></div>
        <h1 
          className={`text-3xl font-bold text-white mb-6 transition-all duration-300 ${
            animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
              ? 'transform -translate-y-4' 
              : ''
          }`}
          style={{
            paddingLeft: animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
              ? getCanvasPadding()
              : '5.5rem',
            paddingRight: animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
              ? getCanvasPadding()
              : '5.5rem'
          }}
        >
          The Fox and the Forest
        </h1>
        <div 
          className={`text-gray-300 leading-relaxed space-y-4 transition-all duration-300 ${
            animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
              ? 'transform -translate-y-2 translate-x-4' 
              : ''
          }`}
          style={{
            paddingLeft: animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
              ? getCanvasPadding()
              : '5.5rem',
            paddingRight: animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
              ? getCanvasPadding()
              : '5.5rem'
          }}
        >
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
    <>
      <div className={`min-h-screen bg-[#212121] text-white flex transition-opacity duration-200 ${
        animationState === 'ui-fade-out' || animationState === 'bg-change' || animationState === 'expanding' || animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
          ? 'opacity-0 pointer-events-none' 
          : 'opacity-100'
      }`}>
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M4 9h16" stroke="currentColor" strokeWidth="2"/>
                            <path d="M9 4v16" stroke="currentColor" strokeWidth="2"/>
                          </svg>
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

      {/* Expanded Canvas Overlay */}
      {isCanvasExpanded && (
        <div className="fixed inset-0 bg-[#212121] z-50 flex">
          {/* Conversation Sidebar - LEFT SIDE */}
          <div 
            className={`bg-[#212121] border-r border-[#3a3a3a] flex flex-col ${
              animationState === 'conversation-fade-in' || animationState === 'expanded' ? 'opacity-100' : 'opacity-0'
            } ${isDragging ? '' : 'transition-opacity duration-300'}`}
            style={{ width: `${splitRatio * 100}%` }}
          >
            <div className="px-4 border-b border-[#3a3a3a] h-[57px] flex items-center">
              <h3 className="text-gray-300 font-medium">Conversation</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'user' ? (
                      <div className="bg-[#2f2f2f] rounded-2xl px-3 py-2 max-w-[80%] text-sm">
                        <div className="text-white">{message.content}</div>
                      </div>
                    ) : (
                      <div className="bg-[#1a1a1a] rounded-2xl px-3 py-2 max-w-[80%] text-sm">
                        <div className="text-white">{message.content}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resizer - only visible when fully expanded */}
          <div 
            className={`w-1 bg-[#3a3a3a] hover:bg-[#4a4a4a] cursor-col-resize transition-colors relative z-10 ${
              animationState === 'expanded' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onMouseDown={handleMouseDown}
          />

          {/* Main Canvas Area - RIGHT SIDE */}
          <div 
            className={`absolute ease-out ${
              isDragging ? '' : 'transition-all duration-400'
            }`}
            style={{
              left: animationState === 'initial' || animationState === 'ui-fade-out' || animationState === 'bg-change'
                ? `${canvasPosition.left}px`
                : `${splitRatio * 100}%`, // Move to split position
              top: animationState === 'initial' || animationState === 'ui-fade-out' || animationState === 'bg-change'
                ? `${canvasPosition.top}px`
                : '0px',
              width: animationState === 'initial' || animationState === 'ui-fade-out' || animationState === 'bg-change'
                ? `${canvasPosition.width}px`
                : `${(1 - splitRatio) * 100}%`, // Take remaining percentage of screen
              height: animationState === 'initial' || animationState === 'ui-fade-out' || animationState === 'bg-change'
                ? `${canvasPosition.height}px`
                : '100vh',
              transformOrigin: 'left top'
            }}
          >
            <div className={`overflow-hidden h-full bg-[#212121] ${
              animationState === 'expanded' || animationState === 'conversation-fade-in' 
                ? '' 
                : 'rounded-xl border border-[#3a3a3a]'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 border-b border-[#3a3a3a] h-[57px]">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span className="text-gray-300 font-medium">Random Document</span>
                </div>
                <button 
                  onClick={handleCloseCanvas}
                  className="p-1 hover:bg-[#2a2a2a] rounded flex items-center justify-center"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              
              {/* Content */}
              <div className="relative" style={{ height: 'calc(100% - 57px)', paddingTop: '3rem', paddingBottom: '1.5rem', paddingLeft: '0', paddingRight: '0' }}>
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gray-600"></div>
                <h1 className={`text-3xl font-bold text-white mb-8 transition-all duration-300 ${
                  animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
                    ? 'transform -translate-y-4' 
                    : ''
                }`}
                style={{
                  paddingLeft: animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
                    ? getCanvasPadding()
                    : '5.5rem',
                  paddingRight: animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
                    ? getCanvasPadding()
                    : '5.5rem'
                }}>
                  The Fox and the Forest
                </h1>
                <div className={`text-gray-300 leading-relaxed space-y-6 text-base transition-all duration-300 ${
                  animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
                    ? 'transform -translate-y-2 translate-x-4' 
                    : ''
                }`}
                style={{
                  paddingLeft: animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
                    ? getCanvasPadding()
                    : '5.5rem',
                  paddingRight: animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in'
                    ? getCanvasPadding()
                    : '5.5rem'
                }}>
                  <p>
                    On a quiet morning in early spring, a curious fox trotted along the edge of the forest. The trees, 
                    still bare from winter, rustled gently in the breeze as birds called out in anticipation of warmer 
                    days. The fox paused at a patch of freshly disturbed earth, sniffed the air, and then began to dig 
                    with surprising urgency. Moments later, it unearthed a small bundle—an old leather pouch, 
                    worn but intact.
                  </p>
                  <p className="text-gray-500">
                    Inside the pouch were a handful of smooth river stones, a rusted iron key, and a folded piece of 
                    parchment that seemed to glow faintly in the morning light. The fox's ears perked up as it heard 
                    footsteps approaching from deeper within the forest. Without hesitation, it grabbed the pouch 
                    and bounded away, disappearing into the undergrowth just as a figure emerged from behind the trees.
                  </p>
                  <p>
                    The stranger, cloaked in deep green robes that seemed to blend with the forest itself, paused at 
                    the disturbed earth and frowned. They had been too late. The ancient artifact, hidden here for 
                    centuries, was now in the possession of a creature that had no understanding of its true power.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
