/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Settings, 
  Check, 
  Video, 
  MessageSquare, 
  Hash, 
  Palette, 
  RefreshCcw, 
  ChevronRight,
  Facebook,
  Instagram,
  Type as TypeIcon,
  Zap
} from 'lucide-react';
import { cn } from './lib/utils';
import { ContentOption, ContentStyle, ContentType, GenerationParams } from './types';
import { generateSocialContent, improveContent } from './services/geminiService';

// Custom TikTok-like icon since Lucide doesn't have it natively in all versions
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.59-5.71-.29-4.37 3.35-8.23 7.72-8.23 1.05-.02 2.1.2 3.06.63V9.16c-.72-.31-1.5-.47-2.3-.51-2.12-.13-4.28 1.16-5.12 3.11-.86 1.94-.37 4.41 1.22 5.81 1.58 1.45 4.1 1.7 5.92.51.81-.51 1.44-1.28 1.76-2.18.23-.65.34-1.33.34-2.02.03-5.24-.01-10.48-.02-15.72V.02z" />
  </svg>
);

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 overflow-hidden shadow-lg border border-white/20">
      <div className="absolute inset-0 flex items-center justify-center">
        <Facebook className="text-white w-5 h-5 absolute -translate-x-2 -translate-y-2 opacity-50" />
        <Instagram className="text-white w-5 h-5 absolute translate-x-2 translate-y-2 opacity-50" />
        <TikTokIcon className="text-white w-5 h-5 absolute translate-x-0 translate-y-0" />
      </div>
    </div>
    <span className="font-sans font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
      TuRedCon
    </span>
  </div>
);

export default function App() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<ContentStyle>('creativo');
  const [type, setType] = useState<ContentType>('post corto');
  const [options, setOptions] = useState<ContentOption[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#6366f1'); // Indigo-500
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setOptions([]);
    setSelectedOption(null);
    try {
      const results = await generateSocialContent({ topic, style, type });
      setOptions(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImprove = async (option: ContentOption) => {
    setIsGenerating(true);
    try {
      const improved = await improveContent(option, { topic, style, type });
      setOptions(prev => prev.map(o => o.id === option.id ? improved : o));
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen font-sans transition-colors duration-500",
      isDarkMode ? "bg-[#0f172a] text-slate-100" : "bg-slate-50 text-slate-900"
    )} style={{ '--primary': primaryColor } as React.CSSProperties}>
      
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between",
        isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
      )}>
        <Logo />
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            id="theme-toggle"
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" /> : <Palette className="w-5 h-5 text-indigo-500" />}
          </button>
          <div className="flex items-center gap-2">
             <input 
              type="color" 
              value={primaryColor} 
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-8 h-8 rounded-full border-none cursor-pointer overflow-hidden p-0"
              title="Personalizar Color"
            />
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-6 space-y-8">
        
        {/* Input Form */}
        <section className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium opacity-70 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> ¿Sobre qué quieres publicar?
            </label>
            <textarea
              id="topic-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ej: Lanzamiento de mi nueva marca de café artesanal..."
              className={cn(
                "w-full h-24 p-4 rounded-2xl resize-none focus:ring-2 outline-none transition-all",
                isDarkMode ? "bg-slate-800 border-slate-700 focus:ring-indigo-500/50" : "bg-white border-slate-200 shadow-sm focus:ring-indigo-500/20"
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium opacity-70 flex items-center gap-2">
                <Palette className="w-4 h-4" /> Estilo
              </label>
              <select 
                value={style}
                onChange={(e) => setStyle(e.target.value as ContentStyle)}
                className={cn(
                  "w-full p-3 rounded-xl appearance-none outline-none focus:ring-2",
                  isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                )}
              >
                <option value="formal">👔 Formal</option>
                <option value="creativo">🎨 Creativo</option>
                <option value="motivacional">✨ Motivacional</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium opacity-70 flex items-center gap-2">
                <TypeIcon className="w-4 h-4" /> Tipo de Contenido
              </label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as ContentType)}
                className={cn(
                  "w-full p-3 rounded-xl appearance-none outline-none focus:ring-2",
                  isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                )}
              >
                <option value="post corto">📝 Post Corto</option>
                <option value="idea de video">🎬 Idea de Video</option>
                <option value="caption">🖼️ Caption / Pie</option>
              </select>
            </div>
          </div>

          <button
            id="generate-button"
            onClick={handleGenerate}
            disabled={isGenerating || !topic}
            className={cn(
              "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-xl shadow-indigo-500/20",
              isGenerating ? "opacity-50 cursor-not-allowed" : "hover:brightness-110"
            )}
            style={{ backgroundColor: primaryColor, color: '#fff' }}
          >
            {isGenerating ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isGenerating ? "Generando..." : "Generar Contenido"}
          </button>
        </section>

        {/* Results */}
        <AnimatePresence>
          {options.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold flex items-center gap-2 px-1">
                <Sparkles className="w-5 h-5 text-yellow-500" /> Elige tu opción favorita
              </h2>
              
              <div className="space-y-4">
                {options.map((option, idx) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedOption(option.id)}
                    className={cn(
                      "p-6 rounded-3xl border-2 cursor-pointer transition-all relative group overflow-hidden",
                      selectedOption === option.id 
                        ? "border-[var(--primary)] bg-indigo-500/5 shadow-lg" 
                        : isDarkMode ? "bg-slate-800/50 border-slate-700/50 hover:border-slate-600" : "bg-white border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {selectedOption === option.id && (
                      <div className="absolute top-4 right-4 bg-indigo-500 rounded-full p-1 shadow-lg">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">Opción {idx + 1}</span>
                        <h3 className="text-xl font-black leading-tight">{option.title}</h3>
                      </div>
                      
                      <div className="prose prose-sm dark:prose-invert opacity-80 leading-relaxed italic border-l-2 pl-4 border-indigo-500/30">
                        {option.development}
                      </div>

                      <div className="bg-slate-500/10 p-3 rounded-xl">
                        <p className="text-xs font-bold uppercase opacity-50 mb-1 flex items-center gap-1">
                          <ChevronRight className="w-3 h-3" /> Call to Action
                        </p>
                        <p className="font-semibold text-sm">{option.cta}</p>
                      </div>

                      {option.recordingIdea && (
                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                          <p className="text-xs font-bold uppercase text-blue-500 mb-1 flex items-center gap-1">
                            <Video className="w-3 h-3" /> Idea de Grabación
                          </p>
                          <p className="text-sm opacity-90">{option.recordingIdea}</p>
                        </div>
                      )}

                      {(option.hashtags || option.emojis) && (
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-lg">{option.emojis}</span>
                          {option.hashtags?.map(h => (
                            <span key={h} className="text-xs font-medium text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-md">#{h}</span>
                          ))}
                        </div>
                      )}

                      {/* Improve Button */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImprove(option);
                          }}
                          className="text-xs font-bold flex items-center gap-1 py-2 px-3 rounded-lg hover:bg-slate-500/20 transition-colors uppercase tracking-tight"
                        >
                          <RefreshCcw className="w-3 h-3" /> Optimizar Contenido
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* AI Integration Info */}
        <section className={cn(
          "p-8 rounded-3xl space-y-4 border",
          isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-indigo-50 border-indigo-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold">Futuro con IA Real</h2>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Esta aplicación puede evolucionar integrando Inteligencia Artificial avanzada de las siguientes formas:
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="text-indigo-500 font-bold">01.</span>
              <span><strong>Visión Artificial:</strong> Sube una foto y la IA generará el caption analizando los elementos visuales automáticamente.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-500 font-bold">02.</span>
              <span><strong>Análisis de Tendencias:</strong> Conexión con APIs en tiempo real para sugerir hashtags y temas que son virales en este momento.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-500 font-bold">03.</span>
              <span><strong>Generación de Scripts:</strong> Creación de guiones multimodales (audio + video) para Reels o TikTok con sugerencias de cortes y música.</span>
            </li>
          </ul>
        </section>

      </main>

      <footer className="p-12 text-center opacity-40 text-xs">
        <p>&copy; 2024 TuRedCon - Tu Aliado Digital</p>
      </footer>
    </div>
  );
}

