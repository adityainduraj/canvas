import { Message } from '../types';
import TypingAnimation from './TypingAnimation';

interface ChatBubbleProps {
  message: Message;
  children?: React.ReactNode;
  isTyping?: boolean;
  showCanvas?: boolean;
  onTypingComplete?: () => void;
}

export default function ChatBubble({ 
  message, 
  children, 
  isTyping = false, 
  showCanvas = true, 
  onTypingComplete 
}: ChatBubbleProps) {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.role === 'user' ? (
        <div className="bg-[#2f2f2f] rounded-3xl px-6 py-4 max-w-xs md:max-w-md lg:max-w-lg">
          <div className="text-white">{message.content}</div>
        </div>
      ) : (
        <div className="max-w-none w-full">
          <div className="text-white leading-relaxed mb-4">
            {isTyping ? (
              <TypingAnimation 
                text={message.content} 
                onComplete={onTypingComplete}
                speed={20}
              />
            ) : (
              message.content
            )}
          </div>
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
          {/* Canvas with fade-in animation */}
          {children && (
            <div className={`transition-opacity duration-500 ${
              showCanvas ? 'opacity-100' : 'opacity-0'
            }`}>
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
