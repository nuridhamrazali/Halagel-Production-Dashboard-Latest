import React, { useState } from 'react';
import { 
  X, Monitor, Download, Smartphone, Chrome, Copy, 
  Check, ExternalLink, Sparkles, Compass, ShieldCheck,
  MousePointerClick
} from 'lucide-react';

interface DesktopShortcutModalProps {
  onClose: () => void;
}

export const DesktopShortcutModal: React.FC<DesktopShortcutModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'download' | 'chrome' | 'edge' | 'mobile'>('download');
  const [copied, setCopied] = useState(false);

  // Full current web application URL
  const appUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Function to download a Windows .URL Internet Shortcut file
  const handleDownloadShortcut = () => {
    // Windows internet shortcut file (.url) format
    const shortcutContent = `[InternetShortcut]\r\nURL=${appUrl}\r\nIconIndex=0\r\nHotKey=0\r\n`;
    
    const blob = new Blob([shortcutContent], { type: 'application/internet-shortcut' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Halagel_Dashboard.url';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-850 rounded-2xl sm:rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-gradient-to-r from-indigo-50/50 via-transparent to-emerald-50/30 dark:from-indigo-950/20 dark:to-emerald-950/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white leading-tight">
                Desktop Shortcut & Mobile
              </h3>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                Instant access without PWA
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-1.5 gap-1 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'download'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            1-Click .URL
          </button>
          <button
            onClick={() => setActiveTab('chrome')}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'chrome'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Chrome className="w-3.5 h-3.5" />
            Chrome
          </button>
          <button
            onClick={() => setActiveTab('edge')}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'edge'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Edge
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'mobile'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar text-left flex-1">
          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">
                      Windows Desktop Shortcut (.URL)
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      Download a standard Windows internet shortcut file. Move or drag it to your Desktop, and double-click it anytime to launch Halagel Dashboard!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleDownloadShortcut}
                  className="flex-1 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
                >
                  <Download className="w-4 h-4" />
                  Download Halagel_Dashboard.url
                </button>

                <button
                  onClick={handleCopyUrl}
                  className="py-3.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
                <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  How to use after downloading:
                </h5>
                <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside font-medium leading-relaxed">
                  <li>Find <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 font-mono font-bold text-indigo-600 dark:text-indigo-400">Halagel_Dashboard.url</code> in your Downloads folder.</li>
                  <li>Drag or move it directly to your <strong>Desktop</strong>.</li>
                  <li>Double-click to open directly in your favorite browser!</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'chrome' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50">
                <h4 className="text-sm font-black text-slate-800 dark:text-white">
                  Create Chrome Desktop Shortcut (App Window Mode)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Chrome allows you to create a desktop shortcut that opens Halagel in a clean, dedicated window without toolbars.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black shrink-0">1</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Click the <strong>Three Dots Menu</strong> (<code className="font-bold">⋮</code>) at the top-right of Google Chrome.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black shrink-0">2</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Hover over <strong>Save and share</strong> (or <strong>More tools</strong> in older Chrome versions) ➔ Click <strong>Create shortcut...</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black shrink-0">3</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Type <strong>Halagel Dashboard</strong>, check the box <span className="font-bold text-indigo-600 dark:text-indigo-400">"Open as window"</span>, then click <strong>Create</strong>.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40 flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                A Halagel icon will now appear on your Windows/Mac Desktop!
              </div>
            </div>
          )}

          {activeTab === 'edge' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50">
                <h4 className="text-sm font-black text-slate-800 dark:text-white">
                  Microsoft Edge Desktop Shortcut
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Microsoft Edge makes it effortless to pin or create a desktop shortcut with the official icon.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-black shrink-0">1</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Click the <strong>Three Dots Menu</strong> (<code className="font-bold">...</code>) at the top-right of Microsoft Edge.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-black shrink-0">2</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Hover over <strong>More tools</strong> ➔ Click <strong>Pin to taskbar</strong> or <strong>Launch taskbar pinning wizard</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-black shrink-0">3</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Alternatively, drag the padlock or URL icon from the Edge address bar directly onto your Windows Desktop.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mobile' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
                <h4 className="text-sm font-black text-slate-800 dark:text-white">
                  Add to Mobile Home Screen (Without PWA)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Both iOS and Android browsers can add an icon directly to your phone or tablet home screen without needing any PWA download!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Android Guide */}
                <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                  <div className="flex items-center gap-2 font-black text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <Smartphone className="w-4 h-4" /> Android (Chrome)
                  </div>
                  <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside font-medium">
                    <li>Open this URL in Chrome on your phone.</li>
                    <li>Tap the <strong>Three dots</strong> (<code className="font-bold">⋮</code>) menu.</li>
                    <li>Tap <strong>"Add to Home screen"</strong>.</li>
                    <li>Tap <strong>Add</strong>. Done!</li>
                  </ol>
                </div>

                {/* iOS Guide */}
                <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                  <div className="flex items-center gap-2 font-black text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <Smartphone className="w-4 h-4" /> iPhone / iPad (Safari)
                  </div>
                  <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside font-medium">
                    <li>Open this URL in Safari.</li>
                    <li>Tap the <strong>Share</strong> button (box with arrow).</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                    <li>Tap <strong>Add</strong>. Done!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/70 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] font-bold text-slate-400 truncate max-w-[240px] sm:max-w-xs">
            URL: {appUrl}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
