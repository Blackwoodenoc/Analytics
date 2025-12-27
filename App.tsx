
import React, { useState, useCallback, useRef } from 'react';
import { Upload, Link as LinkIcon, FileVideo, AlertCircle, Sparkles, BrainCircuit } from 'lucide-react';
import { AppStatus, AnalysisState } from './types';
import { analyzeVideo } from './services/geminiService';
import ProcessingStage from './components/ProcessingStage';
import AnalysisView from './components/AnalysisView';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    status: AppStatus.IDLE,
    progress: 0,
    result: null,
    error: null,
    videoUrl: null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setState({
      status: AppStatus.IDLE,
      progress: 0,
      result: null,
      error: null,
      videoUrl: null
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (file.size > 20 * 1024 * 1024) {
      setState(prev => ({ ...prev, error: "Файл слишком велик (макс. 20MB для демо-версии)", status: AppStatus.ERROR }));
      return;
    }

    const videoUrl = URL.createObjectURL(file);
    setState(prev => ({ ...prev, status: AppStatus.PROCESSING, videoUrl, progress: 10, error: null }));

    try {
      const base64Data = await fileToBase64(file);
      
      // Artificial progress for better UX
      const interval = setInterval(() => {
        setState(prev => {
          if (prev.progress < 90) return { ...prev, progress: prev.progress + 2 };
          return prev;
        });
      }, 500);

      const result = await analyzeVideo(base64Data, file.type);
      
      clearInterval(interval);
      setState(prev => ({
        ...prev,
        status: AppStatus.COMPLETED,
        progress: 100,
        result
      }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        status: AppStatus.ERROR, 
        error: err.message || "Произошла ошибка при обработке видео." 
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Video<span className="text-blue-500">Analytics</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-400">
            <span className="hover:text-white cursor-pointer transition-colors">Обзор</span>
            <span className="hover:text-white cursor-pointer transition-colors">Как это работает</span>
            <span className="hover:text-white cursor-pointer transition-colors">API</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {state.status === AppStatus.IDLE && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                <span>Powered by Gemini 3 Flash</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
                Нейросетевой анализ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">видео в реальном времени</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Загрузите короткое видео или вставьте ссылку, и наш ИИ проведет полный ASR-анализ, извлечет ключевые кадры и составит подробное резюме.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Upload Box */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative h-80 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 bg-slate-900/30 rounded-3xl cursor-pointer hover:border-blue-500/50 hover:bg-slate-900/50 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-4 bg-slate-800 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Загрузить файл</h3>
                <p className="text-slate-500 text-center px-8">Перетащите сюда MP4, MOV или кликните для выбора (макс. 20MB)</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="video/*" 
                />
              </div>

              {/* Link Input Box */}
              <div className="relative h-80 flex flex-col items-center justify-center border-2 border-slate-800 bg-slate-900/30 rounded-3xl p-8 space-y-6">
                <div className="p-4 bg-slate-800 rounded-2xl">
                  <LinkIcon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Вставить ссылку</h3>
                <div className="w-full relative">
                  <input 
                    type="text" 
                    placeholder="TikTok, YouTube Shorts или Reels..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
                  />
                  <button className="absolute right-2 top-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors">
                    Анализ
                  </button>
                </div>
                <p className="text-xs text-slate-500 italic text-center">Примечание: В данной демо-версии рекомендуется прямая загрузка файла.</p>
              </div>
            </div>

            {/* Feature List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              {[
                { title: "ASR Транскрипция", desc: "Распознавание речи любой сложности с помощью нейронных сетей.", icon: FileVideo },
                { title: "Keyframe Extraction", desc: "Автоматическое выделение важных моментов видео с описанием.", icon: Sparkles },
                { title: "Мультиязычность", desc: "Поддержка более 50 языков, включая русский и английский.", icon: BrainCircuit }
              ].map((feature, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center text-blue-400">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white">{feature.title}</h4>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.status === AppStatus.PROCESSING && (
          <ProcessingStage progress={state.progress} />
        )}

        {state.status === AppStatus.COMPLETED && state.result && (
          <AnalysisView 
            result={state.result} 
            videoUrl={state.videoUrl} 
            onReset={resetState} 
          />
        )}

        {state.status === AppStatus.ERROR && (
          <div className="max-w-md mx-auto p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-center space-y-6 animate-in zoom-in duration-300">
            <div className="inline-flex p-4 bg-red-500/20 text-red-500 rounded-full">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Ошибка анализа</h2>
              <p className="text-red-400/80">{state.error}</p>
            </div>
            <button 
              onClick={resetState}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
            >
              Попробовать снова
            </button>
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-white/5 py-12 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-slate-500 text-sm">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="w-4 h-4" />
            <span>© 2024 AI Video Analytics Module. Все права защищены.</span>
          </div>
          <div className="flex space-x-8">
            <span className="hover:text-white cursor-pointer transition-colors">Политика</span>
            <span className="hover:text-white cursor-pointer transition-colors">Условия</span>
            <span className="hover:text-white cursor-pointer transition-colors">Контакты</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
