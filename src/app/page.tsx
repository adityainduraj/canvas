'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import CanvasPreview from '../components/CanvasPreview';
import CanvasPanel from '../components/CanvasPanel';
import ChatBubble from '../components/ChatBubble';
import TypingAnimation from '../components/TypingAnimation';
import { Message, AnimationState } from '../types';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isCanvasExpanded, setIsCanvasExpanded] = useState(false);
  const [animationState, setAnimationState] = useState<AnimationState>('initial');
  const canvasPreviewRef = useRef<HTMLDivElement>(null);
  const [canvasPosition, setCanvasPosition] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [splitRatio, setSplitRatio] = useState(0.25); // 25% for conversation, 75% for canvas
  const [isDragging, setIsDragging] = useState(false);
  const [typingMessageIds, setTypingMessageIds] = useState<Set<number>>(new Set());
  const [showCanvasIds, setShowCanvasIds] = useState<Set<number>>(new Set());

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
      // Start typing animation for the new message
      setTypingMessageIds(prev => new Set([...prev, assistantMessage.id]));
    }, 1000);
  };

  const handleTypingComplete = (messageId: number, hasCanvas: boolean) => {
    setTypingMessageIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
    
    // If message has canvas, start canvas fade-in after typing completes
    if (hasCanvas) {
      setTimeout(() => {
        setShowCanvasIds(prev => new Set([...prev, messageId]));
      }, 200); // Small delay for smooth transition
    }
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
    
    // Start fade out animation - just fade the overlay, don't change content
    setAnimationState('exiting');
    
    // After fade out completes, reset to initial state
    setTimeout(() => {
      setIsCanvasExpanded(false);
      setAnimationState('initial');
    }, 500); // Match the fade duration for smooth transition
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newRatio = e.clientX / window.innerWidth;
    // Constrain between 20% and 80%
    const constrainedRatio = Math.max(0.2, Math.min(0.8, newRatio));
    setSplitRatio(constrainedRatio);
  }, [isDragging]);

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
                  <ChatBubble 
                    key={message.id} 
                    message={message}
                    isTyping={message.role === 'assistant' && typingMessageIds.has(message.id)}
                    showCanvas={message.hasCanvas ? showCanvasIds.has(message.id) : true}
                    onTypingComplete={() => handleTypingComplete(message.id, !!message.hasCanvas)}
                  >
                    {message.hasCanvas && (
                      <CanvasPreview
                        ref={canvasPreviewRef}
                        isCanvasExpanded={isCanvasExpanded}
                        onExpandCanvas={handleExpandCanvas}
                        onCloseCanvas={handleCloseCanvas}
                      />
                    )}
                  </ChatBubble>
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
      <CanvasPanel
        isCanvasExpanded={isCanvasExpanded}
        animationState={animationState}
        canvasPosition={canvasPosition}
        splitRatio={splitRatio}
        isDragging={isDragging}
        onCloseCanvas={handleCloseCanvas}
        getCanvasPadding={getCanvasPadding}
        messages={messages}
        onMouseDown={handleMouseDown}
      />
    </>
  );
}
