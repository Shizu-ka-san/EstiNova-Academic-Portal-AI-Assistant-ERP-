export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachedFileName?: string | null;
  timestamp: Date;
  shouldSpeak?: boolean;
  responseTime?: number;
  isError?: boolean;
}

export interface FileData {
  name: string;
  type: string;
  base64: string;
}
