import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare } from 'lucide-react';

export function PwaInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(isStandaloneMode);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (isStandalone) return null;

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSPrompt(true);
    }
  };

  if (!installPrompt && !isIOS) return null;

  return (
    <>
      <button
        onClick={handleInstall}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition border border-indigo-200 dark:border-indigo-800 font-bold text-[11px] uppercase tracking-wider"
        title="Install App"
      >
        <Download className="w-3.5 h-3.5" />
        Install App
      </button>
      
      {/* Mobile Icon Only */}
      <button
        onClick={handleInstall}
        className="md:hidden p-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition border border-indigo-200 dark:border-indigo-800"
        title="Install App"
      >
        <Download className="w-4 h-4" />
      </button>

      {showIOSPrompt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" onClick={() => setShowIOSPrompt(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border dark:border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Install App on iOS</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              To install this app on your iPhone or iPad, tap the <Share className="w-4 h-4 inline mx-1" /> <strong>Share</strong> icon in your browser menu, then select <PlusSquare className="w-4 h-4 inline mx-1" /> <strong>Add to Home Screen</strong>.
            </p>
            <button onClick={() => setShowIOSPrompt(false)} className="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl font-bold transition">
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
