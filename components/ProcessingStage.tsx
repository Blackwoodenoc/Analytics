
import React from 'react';
import { Loader2, AudioLines, ScanEye, FileVideo } from 'lucide-react';

interface ProcessingStageProps {
  progress: number;
}

const ProcessingStage: React.FC<ProcessingStageProps> = ({ progress }) => {
  const steps = [
    { label: 'Извлечение аудио', icon: AudioLines, threshold: 25 },
    { label: 'ASR Транскрипция', icon: Loader2, threshold: 50 },
    { label: 'Визуальный анализ', icon: ScanEye, threshold: 75 },
    { label: 'Генерация отчета', icon: FileVideo, threshold: 100 },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8 max-w-2xl mx-auto">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div 
          className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
          style={{ animationDuration: '3s' }}
        ></div>
        <div className="text-4xl font-bold text-blue-400">{Math.round(progress)}%</div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, idx) => {
          const isActive = progress >= step.threshold - 25;
          const isDone = progress >= step.threshold;
          const Icon = step.icon;

          return (
            <div 
              key={idx}
              className={`flex items-center space-x-3 p-4 rounded-xl border transition-all duration-500 ${
                isActive ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10' : 'border-slate-800 bg-slate-900/50 opacity-40'
              }`}
            >
              <div className={`p-2 rounded-lg ${isDone ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {isDone ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                )}
              </div>
              <span className={`font-medium ${isActive ? 'text-white' : 'text-slate-500'}`}>{step.label}</span>
            </div>
          );
        })}
      </div>
      
      <p className="text-slate-400 text-sm animate-pulse">Искусственный интеллект изучает кадры и слушает дорожку...</p>
    </div>
  );
};

export default ProcessingStage;
