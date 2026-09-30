export type AIProvider = 'gemini' | 'openrouter';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
  isFree: boolean;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  action?: string;
  codeSnippet?: string;
  modelUsed?: string;
}

export interface AIConfig {
  provider: AIProvider;
  model: string;
  openRouterApiKey: string;
  googleApiKey: string;
  autoSendContext: boolean;
}

export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'gemini',
  model: 'gemini-2.5-flash',
  openRouterApiKey: '',
  googleApiKey: '',
  autoSendContext: true,
};
