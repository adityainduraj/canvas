export interface Message {
  id: number;
  content: string;
  role: 'user' | 'assistant';
  hasCanvas?: boolean;
}

export type AnimationState = 'initial' | 'ui-fade-out' | 'bg-change' | 'expanding' | 'content-repositioning' | 'expanded' | 'conversation-fade-in' | 'exiting';
