# Canvas Expansion Animation Plan

## Animation Overview
Create a smooth fullscreen expansion animation where the canvas preview grows from its left edge anchor point to fill most of the screen, with content repositioning smoothly.

## Expansion Animation States

### State 1: Initial (Chat with Canvas Preview)
- Full chat interface visible
- Canvas preview component in message area
- Sidebar, header, input area all visible
- Canvas preview has normal size and position

### State 2: UI Fade Out
**Duration: 200ms**
- Everything EXCEPT canvas preview fades to opacity 0
  - Sidebar fades out
  - Header fades out  
  - Input area fades out
  - Chat messages fade out
  - Action buttons fade out
- Canvas preview remains at opacity 1
- Canvas preview maintains current position

### State 3: Canvas Background Color Change
**Duration: 100ms**
- Canvas preview background color changes from dark to lighter gray (matching main bg)
- Smooth color transition

### State 4: Canvas Expansion
**Duration: 400ms**
- **LEFT edge remains completely FIXED** - acts as anchor point
- **RIGHT edge expands** to reach right side of screen
- **TOP edge expands** upward to reach top of screen  
- **BOTTOM edge expands** downward to reach bottom of screen
- Canvas grows from left anchor point outward in 3 directions
- Smooth easing for natural expansion feel

### State 5: Content Repositioning
**Duration: 300ms (simultaneous with expansion)**
- **Title + Icon (Random Document)**: 
  - Stay same size
  - Move straight UP (Y position changes, X position stays same)
  - End up in top-left area of expanded canvas
- **Main text content**:
  - Moves diagonally UP and potentially RIGHT
  - Reaches center position in new expanded state
  - Text reflows to accommodate new width
- **Cross/close icon**:
  - Moves diagonally UP and RIGHT
  - Ends up in top-right corner of expanded canvas

### State 6: Expanded State Reached
- Canvas occupies ~75% of screen width
- Canvas spans full height
- Left edge remains at original position
- Title and icon in top-left
- Text content centered in expanded area
- Close icon in top-right

### State 7: Conversation Fade In
**Duration: 300ms**
- Previous chat conversation fades in on the RIGHT side (remaining 25%)
- Chat appears in condensed sidebar format
- Smooth opacity transition from 0 to 1

## Closing Animation (Reverse)

### Close State 1: Conversation Fade Out
**Duration: 200ms**
- Chat conversation on right fades to opacity 0

### Close State 2: Content Repositioning (Reverse)
**Duration: 300ms**
- Title moves back down to original position
- Text content moves diagonally down and left back to original position
- Close icon moves back to original position

### Close State 3: Canvas Contraction
**Duration: 400ms**
- **LEFT edge remains FIXED** (anchor point)
- **RIGHT edge contracts** back to original position
- **TOP and BOTTOM edges contract** back to original size
- Canvas shrinks back to original dimensions

### Close State 4: Background Color Revert
**Duration: 100ms**
- Canvas background changes from lighter gray back to dark

### Close State 5: UI Fade In
**Duration: 300ms**
- Original chat interface fades back in
- All UI elements (header, sidebar, input) return with opacity transition

## Key Animation Principles

### Anchor Point Behavior
- **Left edge is the fixed anchor** - never moves horizontally
- All expansion happens rightward, upward, and downward from this anchor
- Ensures smooth, predictable growth pattern

### Content Movement Patterns
- **Title**: Vertical movement only (straight up/down)
- **Text**: Diagonal movement (up and potentially right/left)
- **Close icon**: Diagonal movement (up-right/down-left)
- **Maintain relative positioning** throughout transition

### Timing Coordination
- **Content repositioning happens simultaneously** with canvas expansion
- **Smooth coordination** between size changes and content movement
- **No jarring jumps** or layout shifts

### Visual Continuity
- **Background color transition** provides smooth visual flow
- **Anchor point system** prevents disorienting movement
- **Proportional scaling** maintains design harmony

## Performance Considerations
- Use **transform** properties for movement (translateX, translateY)
- Use **CSS transitions** for smooth performance
- **GPU acceleration** for complex animations
- **Prevent layout thrashing** during expansion
