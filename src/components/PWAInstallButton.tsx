import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Share } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Suppress when already installed / standalone
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Installer l’App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-rose-500" />
          <span>Sur iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-rose-500" />
                  Installer sur iPhone / iPad
                </h4>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Touchez le bouton <strong>Partager</strong> (<Share className="w-3 h-3 inline text-blue-500" />) dans la barre Safari en bas.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Faites défiler puis touchez <strong>Sur l’écran d’accueil</strong>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0">3</span>
                  <span>L’app apparaîtra avec sa carte hors ligne accessible d’un simple clic !</span>
                </p>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 text-xs font-bold transition"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
