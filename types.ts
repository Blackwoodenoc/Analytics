
export interface Keyframe {
  timestamp: string;
  description: string;
}

export interface SemanticBlock {
  блок: string;
  описание: string;
}

export interface SpeechStyle {
  скорость_речи: string;
  паттерны: string;
  эмоциональный_тон: string;
}

export interface VisualContext {
  обстановка: string;
  тип_видео: string;
}

export interface VideoAnalysisResult {
  transcription: string;
  keyframes: Keyframe[];
  summary: string;
  detectedLanguage: string;
  структура_видео: SemanticBlock[];
  стиль_речи: SpeechStyle;
  визуальный_контекст: VisualContext;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface AnalysisState {
  status: AppStatus;
  progress: number;
  result: VideoAnalysisResult | null;
  error: string | null;
  videoUrl: string | null;
}
