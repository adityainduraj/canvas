
# Canvas - ChatGPT-style Canvas Interface

A Next.js application recreating ChatGPT's Canvas feature with smooth expansion animations and real-time editing capabilities. This project demonstrates advanced React component architecture and complex state-driven animations.

## 🚀 Quick Start

### Run the Project Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🧪 How to Test the Canvas Feature

### Testing the Canvas Functionality

1. **Enable Canvas Mode**
   - Click the "Tools" button in the message input area
   - Select "Canvas" from the dropdown menu
   - You'll see a "Canvas" pill indicator appear

2. **Generate Canvas Content**
   - Type any prompt (e.g., "Write a story about a fox")
   - Send the message
   - The assistant will respond and automatically generate a canvas document

3. **Interact with Canvas**
   - **Preview Mode**: See the collapsed canvas with document content
   - **Expand**: Click the expand icon (⛶) to enter full-screen mode
   - **Edit**: Click the pencil icon to edit title and content
   - **Add Content**: Use the + button to add new paragraphs
   - **Resize**: Drag the divider to adjust conversation/canvas split
   - **Collapse**: Click the X to return to preview mode

4. **Test Animation Features**
   - Watch the **typing animation** as assistant messages appear character by character
   - Observe the **canvas preview fade-in** effect after typing completes  
   - See the smooth expansion animation sequence
   - Test the seamless collapse with no text movement

## 🎯 Project Overview

This is a faithful recreation of ChatGPT's Canvas interface, featuring:
- **Conversational UI** with chat bubbles and tool selection
- **ChatGPT-style typing animation** for realistic message delivery
- **Expandable Canvas** that morphs from preview to full-screen editing mode
- **Smooth Animations** with multi-stage expansion sequences and canvas fade-ins
- **Real-time Editing** with inline text modification capabilities
- **Responsive Design** with dynamic content positioning

## 🏗️ Component Architecture

The application is built with a clean component structure separating concerns:

### Core Components

- **`TypingAnimation`** (`/src/components/TypingAnimation.tsx`)
  - Creates ChatGPT-style character-by-character text reveal
  - Configurable typing speed and completion callbacks
  - Includes blinking cursor effect during typing

- **`ChatBubble`** (`/src/components/ChatBubble.tsx`)
  - Handles rendering of user and assistant messages
  - Integrates typing animation for assistant responses
  - Includes action buttons and canvas fade-in effects
  - Supports children props for canvas integration

- **`CanvasPreview`** (`/src/components/CanvasPreview.tsx`)
  - Displays the collapsed/preview state of the canvas
  - Completely static with no animation dependencies
  - Serves as the "background" element during transitions

- **`CanvasPanel`** (`/src/components/CanvasPanel.tsx`)
  - Manages the expanded full-screen canvas experience
  - Handles complex animation states and positioning
  - Includes editing functionality and conversation sidebar
  - Features resizable split view with drag controls

### Supporting Files

- **`/src/types/index.ts`** - Centralized type definitions
- **`/src/app/page.tsx`** - Main application with state management
- **`/src/app/globals.css`** - Global styles and animation classes

## 🎬 Expansion Animation System

The canvas expansion follows a sophisticated multi-stage animation sequence:

### Animation States
1. **`initial`** - Default collapsed state
2. **`ui-fade-out`** - Main UI fades out (200ms)
3. **`bg-change`** - Background color transition begins
4. **`expanding`** - Canvas morphs from preview size to full screen
5. **`content-repositioning`** - Text content adjusts padding and transforms
6. **`conversation-fade-in`** - Sidebar conversation appears (400ms)
7. **`expanded`** - Final expanded state achieved
8. **`exiting`** - Fade out overlay to reveal static preview (500ms)

### Key Animation Features
- **ChatGPT-style typing animation** with character-by-character text reveal
- **Canvas fade-in effect** after typing completion
- **Seamless morphing** from small preview to full-screen canvas
- **Dynamic padding calculation** based on available screen space
- **No text movement** during collapse (static background technique)
- **Resizable split view** with conversation sidebar
- **Smooth state transitions** with proper timing coordination

## ✨ Editing Features

When in expanded mode, the canvas supports:
- **Inline title editing** with auto-focus
- **Paragraph-level text editing** with auto-resizing textareas
- **Add/delete paragraphs** with visual controls
- **Real-time updates** with state persistence
- **Edit mode toggle** with visual feedback

## 🛠️ Technology Stack

- **Next.js 15** with App Router
- **React 19** with modern hooks
- **TypeScript** for type safety
- **Tailwind CSS** for styling and animations
- **CSS Modules** for component-scoped styles

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Alternative Package Managers

You can also use other package managers:

```bash
# Using Yarn
yarn install
yarn dev

# Using pnpm  
pnpm install
pnpm dev

# Using Bun
bun install
bun dev
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main application component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles and animations
├── components/
│   ├── ChatBubble.tsx    # Message rendering component
│   ├── CanvasPreview.tsx # Collapsed canvas preview
│   └── CanvasPanel.tsx   # Expanded canvas with editing
└── types/
    └── index.ts          # Shared TypeScript definitions
```

## 🎨 Animation Architecture

The project demonstrates advanced animation techniques:

- **State-driven animations** with precise timing control
- **Component lifecycle coordination** across multiple elements
- **Transform-based morphing** with CSS transitions
- **Dynamic style calculations** for responsive behavior
- **Layered animation states** for complex sequences

## 🚢 Deployment

The application can be deployed on [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

```bash
npm run build
npm start
```

For detailed deployment instructions, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Animation Patterns](https://reactcommunity.org/react-transition-group/) - Advanced animation techniques
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework

