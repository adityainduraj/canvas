import { Message, AnimationState } from '../types';
import { useState, useRef, useEffect } from 'react';

interface CanvasPanelProps {
  isCanvasExpanded: boolean;
  animationState: AnimationState;
  canvasPosition: { left: number; top: number; width: number; height: number };
  splitRatio: number;
  isDragging: boolean;
  onCloseCanvas: () => void;
  getCanvasPadding: () => string;
  messages: Message[];
  onMouseDown: (e: React.MouseEvent) => void;
}

export default function CanvasPanel({
  isCanvasExpanded,
  animationState,
  canvasPosition,
  splitRatio,
  isDragging,
  onCloseCanvas,
  getCanvasPadding,
  messages,
  onMouseDown
}: CanvasPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("The Fox and the Forest");
  const [content, setContent] = useState([
    "On a quiet morning in early spring, a curious fox trotted along the edge of the forest. The trees, still bare from winter, rustled gently in the breeze as birds called out in anticipation of warmer days. The fox paused at a patch of freshly disturbed earth, sniffed the air, and then began to dig with surprising urgency. Moments later, it unearthed a small bundle—an old leather pouch, worn but intact.",
    "Inside the pouch were a handful of smooth river stones, a rusted iron key, and a folded piece of parchment that seemed to glow faintly in the morning light. The fox's ears perked up as it heard footsteps approaching from deeper within the forest. Without hesitation, it grabbed the pouch and bounded away, disappearing into the undergrowth just as a figure emerged from behind the trees.",
    "The stranger, cloaked in deep green robes that seemed to blend with the forest itself, paused at the disturbed earth and frowned. They had been too late. The ancient artifact, hidden here for centuries, was now in the possession of a creature that had no understanding of its true power."
  ]);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Focus on title when entering edit mode
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  };

  const handleAddParagraph = () => {
    setContent([...content, "New paragraph..."]);
    setIsEditing(true);
  };

  const handleContentChange = (index: number, newText: string) => {
    const newContent = [...content];
    newContent[index] = newText;
    setContent(newContent);
  };

  const handleDeleteParagraph = (index: number) => {
    if (content.length > 1) {
      const newContent = content.filter((_, i) => i !== index);
      setContent(newContent);
    }
  };

  if (!isCanvasExpanded) return null;

  return (
    <div className={`fixed inset-0 bg-[#212121] z-50 flex transition-opacity duration-500 ${
      animationState === 'exiting' ? 'opacity-0' : 'opacity-100'
    }`}>
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
        onMouseDown={onMouseDown}
      />

      {/* Main Canvas Area - RIGHT SIDE */}
      <div 
        className={`absolute ease-out ${
          isDragging ? '' : 'transition-all duration-400'
        }`}
        style={{
          left: animationState === 'initial' || animationState === 'ui-fade-out' || animationState === 'bg-change'
            ? `${canvasPosition.left}px`
            : `${splitRatio * 100}%`,
          top: animationState === 'initial' || animationState === 'ui-fade-out' || animationState === 'bg-change'
            ? `${canvasPosition.top}px`
            : '0px',
          width: animationState === 'initial' || animationState === 'ui-fade-out' || animationState === 'bg-change'
            ? `${canvasPosition.width}px`
            : `${(1 - splitRatio) * 100}%`,
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
              <span className="text-gray-300 font-medium">{title}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Edit Toggle Button */}
              <button 
                onClick={handleEditToggle}
                className={`p-1 hover:bg-[#2a2a2a] rounded flex items-center justify-center ${
                  isEditing ? 'bg-[#2a2a2a] text-blue-400' : 'text-gray-400'
                }`}
                title={isEditing ? 'Stop editing' : 'Edit document'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              
              {/* Add Paragraph Button (only when editing) */}
              {isEditing && (
                <button 
                  onClick={handleAddParagraph}
                  className="p-1 hover:bg-[#2a2a2a] rounded text-gray-400 hover:text-white"
                  title="Add paragraph"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
              
              {/* Close Button */}
              <button 
                onClick={onCloseCanvas}
                className="p-1 hover:bg-[#2a2a2a] rounded flex items-center justify-center text-gray-400 hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="relative" style={{ height: 'calc(100% - 57px)', paddingTop: '3rem', paddingBottom: '1.5rem', paddingLeft: '0', paddingRight: '0' }}>
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gray-600"></div>
            
            {/* Title - Editable */}
            {isEditing ? (
              <input
                ref={titleRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`text-3xl font-bold text-white mb-8 bg-transparent border-none outline-none w-full ${
                  animationState === 'exiting' ? '' : 'transition-all duration-300'
                } ${
                  animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in' || animationState === 'exiting'
                    ? 'transform -translate-y-4' 
                    : ''
                }`}
                style={{
                  paddingLeft: animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in' || animationState === 'exiting'
                    ? getCanvasPadding()
                    : '5.5rem',
                  paddingRight: animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in' || animationState === 'exiting'
                    ? getCanvasPadding()
                    : '5.5rem'
                }}
                placeholder="Document title..."
              />
            ) : (
              <h1 className={`text-3xl font-bold text-white mb-8 ${
                animationState === 'exiting' ? '' : 'transition-all duration-300'
              } ${
                animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in' || animationState === 'exiting'
                  ? 'transform -translate-y-4' 
                  : ''
              }`}
              style={{
                paddingLeft: animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in' || animationState === 'exiting'
                  ? getCanvasPadding()
                  : '5.5rem',
                paddingRight: animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in' || animationState === 'exiting'
                  ? getCanvasPadding()
                  : '5.5rem'
              }}>
                {title}
              </h1>
            )}
            
            {/* Content - Editable */}
            <div className={`text-gray-300 leading-relaxed space-y-6 text-base ${
              animationState === 'exiting' ? '' : 'transition-all duration-300'
            } ${
              animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in' || animationState === 'exiting'
                ? 'transform -translate-y-2 translate-x-4' 
                : ''
            }`}
            style={{
              paddingLeft: animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in' || animationState === 'exiting'
                ? getCanvasPadding()
                : '5.5rem',
              paddingRight: animationState === 'content-repositioning' || animationState === 'expanded' || animationState === 'conversation-fade-in' || animationState === 'exiting'
                ? getCanvasPadding()
                : '5.5rem'
            }}>
              {content.map((paragraph, index) => (
                <div key={index} className={`relative ${isEditing ? 'group' : ''}`}>
                  {isEditing ? (
                    <div className="relative">
                      <textarea
                        value={paragraph}
                        onChange={(e) => handleContentChange(index, e.target.value)}
                        className="w-full bg-transparent border border-transparent hover:border-[#3a3a3a] focus:border-[#4a4a4a] rounded-lg p-3 text-gray-300 resize-none outline-none min-h-[100px]"
                        placeholder="Enter paragraph text..."
                        style={{ 
                          lineHeight: '1.6',
                          fontFamily: 'inherit'
                        }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = target.scrollHeight + 'px';
                        }}
                      />
                      {content.length > 1 && (
                        <button
                          onClick={() => handleDeleteParagraph(index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-all"
                          title="Delete paragraph"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className={index % 2 === 1 ? 'text-gray-500' : ''}>
                      {paragraph}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
