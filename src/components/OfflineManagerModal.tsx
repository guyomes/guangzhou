import React, { useState } from 'react';
import { OfflineStatus, downloadOfflinePack, clearOfflinePack } from '../utils/offlineStorage';
import { X, Download, Trash2, CheckCircle2, ShieldCheck, WifiOff, HardDrive, Map, RefreshCw } from 'lucide-react';

interface OfflineManagerModalProps {
  status: OfflineStatus;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  status,
  isOpen,
  onClose,
  onStatusUpdated,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    setProgress(5);
    setProgressStatus('Démarrage du téléchargement du pack...');

    try {
      await downloadOfflinePack((pct, text) => {
        setProgress(pct);
        setProgressStatus(text);
      });
      onStatusUpdated();
    } catch (err) {
      console.error(err);
      setProgressStatus('Erreur de téléchargement.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClear = () => {
    if (confirm('Voulez-vous supprimer les données hors ligne en cache ?')) {
      clearOfflinePack();
      onStatusUpdated();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Pack Hors Ligne & Carte Voyageur
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 space-y-4 text-xs">
          {/* Current status display */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Statut du guide hors ligne :</span>
              {status.isDownloaded ? (
                <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Prêt & Téléchargé
                </span>
              ) : (
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  Non téléchargé
                </span>
              )}
            </div>

            {status.downloadDate && (
              <div className="flex items-center justify-between text-slate-500">
                <span>Dernière mise en cache :</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{status.downloadDate}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-slate-500">
              <span>Attractions & Itinéraires :</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {status.itemCount} fiches complètes avec photos
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <span>Espace mémoire occupé :</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                ~{status.estimatedSizeMb} Mo
              </span>
            </div>
          </div>

          {/* Value proposition note */}
          <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 text-slate-700 dark:text-slate-300 space-y-1">
            <span className="font-bold text-rose-800 dark:text-rose-300 block">
              Pourquoi télécharger le pack ?
            </span>
            <p className="leading-relaxed">
              En Chine, le réseau internet mobile peut être instable dans le métro souterrain ou lors d'excursions sans forfait local. Une fois téléchargé, ce pack conserve la carte, les descriptions en français et les fiches taxi en chinois même en mode avion.
            </p>
          </div>

          {/* Progress bar if active */}
          {isDownloading && (
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-slate-700 dark:text-slate-300 truncate">{progressStatus}</span>
                <span className="text-rose-600 font-mono">{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-rose-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Téléchargement en cours...</span>
              </>
            ) : status.isDownloaded ? (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Mettre à jour le pack</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Télécharger la Carte & Guide</span>
              </>
            )}
          </button>

          {status.isDownloaded && (
            <button
              onClick={handleClear}
              disabled={isDownloading}
              aria-label="Vider le cache hors ligne"
              className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 dark:bg-slate-800 dark:text-slate-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
