
import React, { useState } from 'react';
import { VideoAnalysisResult } from '../types';
import { 
  FileText, Play, Clock, Languages, Lightbulb, 
  Layers, MessageSquare, MonitorPlay, Zap, 
  Smile, Activity, MapPin, Video, Wand2, Loader2, Sparkles, Copy, Check
} from 'lucide-react';
import { generateScriptBasedOnStyle } from '../services/geminiService';

interface AnalysisViewProps {
  result: VideoAnalysisResult;
  videoUrl: string | null;
  onReset: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, videoUrl, onReset }) => {
  const [newTopic, setNewTopic] = useState('');
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateScript = async () => {
    if (!newTopic.trim()) return;
    setIsGenerating(true);
    setGeneratedScript(null);
    try {
      const script = await generateScriptBasedOnStyle(result, newTopic);
      setGeneratedScript(script);
    } catch (error) {
      alert("Ошибка при генерации сценария");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedScript) {
      navigator.clipboard.writeText(generatedScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
        <div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Отчет видеоаналитики</h2>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500 fill-current" />
            Паспорт стиля сформирован
          </p>
        </div>
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all shadow-lg border border-slate-700 active:scale-95"
        >
          Загрузить другое видео
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Column (Stickied Media & Quick Stats) */}
        <div className="xl:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-8">
            <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl ring-1 ring-white/5">
              {videoUrl && (
                <video 
                  src={videoUrl} 
                  controls 
                  className="w-full aspect-[9/16] md:aspect-video bg-black object-contain"
                />
              )}
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-blue-400">
                    <Languages className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-widest">{result.detectedLanguage}</span>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">
                    Style Passport
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-slate-200">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-bold text-lg">AI Резюме</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed italic">
                    "{result.summary}"
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Context Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Обстановка</span>
                </div>
                <p className="text-sm text-white font-medium">{result.визуальный_контекст.обстановка}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <Video className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Тип видео</span>
                </div>
                <p className="text-sm text-white font-medium">{result.визуальный_контекст.тип_видео}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Deep Analysis & Generator) */}
        <div className="xl:col-span-8 space-y-12">
          
          {/* SCRIPT GENERATOR SECTION */}
          <section id="generator" className="bg-gradient-to-br from-indigo-600/20 via-blue-600/10 to-purple-600/20 p-8 md:p-10 rounded-[2.5rem] border border-blue-500/30 shadow-2xl space-y-8 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-1000"></div>
            
            <div className="flex items-center space-x-4 relative z-10">
              <div className="p-4 bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/20">
                <Wand2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Генератор сценариев</h3>
                <p className="text-slate-300 text-sm mt-1">
                  Создайте новое видео в стиле этого автора на любую вашу тему.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Тема нового видео</label>
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" 
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateScript()}
                  placeholder="Напр.: Как сварить кофе дома без кофемашины"
                  className="flex-grow bg-slate-950 border border-slate-700/50 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner text-lg"
                />
                <button 
                  onClick={handleGenerateScript}
                  disabled={isGenerating || !newTopic}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 min-w-[200px]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Генерирую...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Сценарий
                    </>
                  )}
                </button>
              </div>
            </div>

            {generatedScript && (
              <div className="mt-10 space-y-6 animate-in slide-in-from-top-6 duration-700 relative z-10">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h4 className="text-white font-bold text-xl flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-400" />
                    Результат: Посекундный план
                  </h4>
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 text-sm font-bold transition-all border border-slate-700 active:scale-95"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Скопировано!' : 'Копировать'}
                  </button>
                </div>
                <div className="bg-slate-950/90 p-8 rounded-[2rem] border border-slate-800/50 mono text-slate-300 text-base leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto custom-scrollbar shadow-2xl">
                  {generatedScript}
                </div>
                <p className="text-center text-xs text-slate-500 italic">
                  * Сценарий адаптирован под ракурсы и темп автора, но использует новые визуальные сцены.
                </p>
              </div>
            )}
          </section>

          {/* Semantic Structure */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Семантическая структура оригинала</h3>
            </div>
            
            <div className="space-y-4">
              {result.структура_видео.map((item, idx) => (
                <div key={idx} className="relative pl-8 border-l-2 border-slate-800 pb-4 last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                  <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/50 hover:bg-slate-900/60 transition-colors">
                    <h4 className="text-indigo-400 font-bold text-sm uppercase tracking-tighter mb-1">{item.блок}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{item.описание}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Style & Tone */}
          <section className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl space-y-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-pink-500/20 text-pink-400 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Tone of Voice & Манера</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
                  <Zap className="w-3 h-3" /> Скорость
                </div>
                <p className="text-white font-medium">{result.стиль_речи.скорость_речи}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
                  <Smile className="w-3 h-3" /> Эмоции
                </div>
                <p className="text-white font-medium">{result.стиль_речи.эмоциональный_тон}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
                  <MessageSquare className="w-3 h-3" /> Фразы
                </div>
                <p className="text-white font-medium text-sm italic">{result.стиль_речи.паттерны}</p>
              </div>
            </div>
          </section>

          {/* Transcription */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Оригинальный текст (ASR)</h3>
            </div>
            <div className="bg-slate-950/80 p-8 rounded-3xl border border-slate-800/50 shadow-inner group relative">
              <div className="absolute top-4 right-4 text-[10px] text-slate-600 font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                AI Transcription
              </div>
              <div className="mono text-slate-300 text-base leading-loose max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                {result.transcription || "Речь не обнаружена в данном фрагменте."}
              </div>
            </div>
          </section>

          {/* Keyframes Timeline */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-500/20 text-orange-400 rounded-xl">
                <MonitorPlay className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Визуальные вехи оригинала</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.keyframes.map((kf, idx) => (
                <div key={idx} className="group flex items-center space-x-5 p-5 bg-slate-900/60 rounded-[1.5rem] border border-slate-800 hover:border-orange-500/30 hover:bg-slate-900 transition-all cursor-default">
                  <div className="flex-shrink-0 w-20 h-10 bg-orange-500/10 text-orange-400 rounded-xl font-black text-sm flex items-center justify-center border border-orange-500/20">
                    <Clock className="w-3 h-3 mr-1" />
                    {kf.timestamp}
                  </div>
                  <p className="text-slate-300 text-sm leading-snug group-hover:text-white transition-colors">
                    {kf.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AnalysisView;
