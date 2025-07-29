import { forwardRef } from 'react';

interface CanvasPreviewProps {
  isCanvasExpanded: boolean;
  onExpandCanvas: () => void;
  onCloseCanvas: () => void;
}

const CanvasPreview = forwardRef<HTMLDivElement, CanvasPreviewProps>(
  ({ isCanvasExpanded, onExpandCanvas, onCloseCanvas }, ref) => {
    return (
      <div 
        ref={ref}
        className="mt-4 border border-[#3a3a3a] rounded-xl overflow-hidden bg-[#1a1a1a]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#3a3a3a]">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-gray-300 font-medium">Random Document</span>
          </div>
          <button 
            onClick={isCanvasExpanded ? onCloseCanvas : onExpandCanvas}
            className="p-1 hover:bg-[#2a2a2a] rounded"
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
        <div className="p-6 relative overflow-y-auto" style={{ maxHeight: '300px' }}>
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gray-600"></div>
          <h1 
            className="text-3xl font-bold text-white mb-6"
            style={{
              paddingLeft: '5.5rem',
              paddingRight: '5.5rem'
            }}
          >
            The Fox and the Forest
          </h1>
          <div 
            className="text-gray-300 leading-relaxed space-y-4"
            style={{
              paddingLeft: '5.5rem',
              paddingRight: '5.5rem'
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
              parchment that seemed to glow faintly in the morning light. The fox&apos;s ears perked up as it heard 
              footsteps approaching from deeper within the forest.
            </p>
            <p>
              The stranger, cloaked in deep green robes that seemed to blend with the forest itself, paused at 
              the disturbed earth and frowned. They had been too late. The ancient artifact, hidden here for 
              centuries, was now in the possession of a creature that had no understanding of its true power.
            </p>
            <p className="text-gray-500">
              As the fox bounded away through the undergrowth, the mysterious parchment began to unfold itself, 
              revealing intricate symbols that pulsed with an otherworldly energy. The forest itself seemed to 
              respond to this awakening, with leaves rustling without wind and shadows moving independent of their sources.
            </p>
            <p>
              Deep in its burrow, the fox examined its treasure. The stones felt warm to the touch, and the iron key 
              hummed with a low, almost inaudible frequency. But it was the parchment that truly captivated the 
              creature&apos;s attention—for as it looked upon the symbols, images began to form in its mind.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

CanvasPreview.displayName = 'CanvasPreview';

export default CanvasPreview;
