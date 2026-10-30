import React, { useState } from 'react';
import { Attraction } from '../types/travel';
import { X, Volume2, Copy, Check, Navigation } from 'lucide-react';

interface TaxiCardModalProps {
  attraction: Attraction | null;
  onClose: () => void;
}

export const TaxiCardModal: React.FC<TaxiCardModalProps> = ({ attraction, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!attraction) return null;

  const handleCopyAddress = () => {
    const textToCopy = `${attraction.nameCn} (${attraction.addressCn})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const phrase = `师傅，麻烦去${attraction.nameCn}，${attraction.addressCn}`;
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-400 text-slate-900 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Fiche Chauffeur de Taxi / 向司机出示
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Chinese Prompt for Driver */}
        <div className="my-6 text-center bg-amber-50/70 p-5 rounded-2xl border border-amber-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">
            « 师傅，麻烦送我去这个地方，谢谢！ »
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight my-2">
            {attraction.nameCn}
          </h2>
          <p className="text-sm font-mono text-slate-600 mt-1">
            Pinyin: {attraction.pinyin}
          </p>
          <p className="text-xs text-rose-700 font-medium mt-0.5">
            Cantonais : {attraction.cantonesePhonetic}
          </p>
        </div>

        {/* Address in Chinese */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Adresse exacte / 详细地址 :
          </span>
          <p className="text-base font-bold text-slate-900 leading-snug">
            {attraction.addressCn}
          </p>
          <p className="text-xs text-slate-500 pt-1">
            Repère Métro : {attraction.metroInfoFr}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={handleSpeak}
            disabled={isPlayingAudio}
            className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudio ? 'Lecture...' : 'Écouter (Vocal)'}</span>
          </button>

          <button
            onClick={handleCopyAddress}
            className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copier l'adresse</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-center text-slate-400 mt-4">
          Astuce : Vous pouvez montrer directement cet écran au chauffeur de taxi ou copier l’adresse dans l’application Didi.
        </p>
      </div>
    </div>
  );
};
