export type ContentStyle = 'formal' | 'creativo' | 'motivacional';
export type ContentType = 'post corto' | 'idea de video' | 'caption';

export interface ContentOption {
  id: string;
  title: string;
  development: string;
  cta: string;
  recordingIdea?: string;
  hashtags?: string[];
  emojis?: string;
}

export interface GenerationParams {
  topic: string;
  style: ContentStyle;
  type: ContentType;
}
