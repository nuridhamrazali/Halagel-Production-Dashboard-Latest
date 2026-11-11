import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, ChevronRight, CheckCircle2, FileText, ArrowDown, ExternalLink } from 'lucide-react';

interface UpdateAnnouncementPopupProps {
  durationSeconds?: number; // Defaults to 10 seconds as requested
  onDismiss?: () => void;
}

export const UpdateAnnouncementPopup: React.FC<UpdateAnnouncementPopupProps> = ({
  durationSeconds = 10,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number | null>(null);
  const lastScrollPosRef = useRef<number>(0);

  const dismiss = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) onDismiss();
    }, 300);
  };

  // 1. Auto-dismiss timer (counts down for durationSeconds, default 10s, with animated bar)
  useEffect(() => {
    startTimeRef.current = Date.now();
    const durationMs = durationSeconds * 1000;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remainingPct = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setProgress(remainingPct);

      if (elapsed >= durationMs) {
        dismiss();
      } else {
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [durationSeconds]);

  // 2. Scroll detection: If someone scrolls down, disappear immediately!
  useEffect(() => {
    let initialRecorded = false;
    let startScrollY = 0;

    const handleScroll = (e: Event) => {
      let currentY = 0;
      if (e.target instanceof HTMLElement) {
        currentY = e.target.scrollTop;
      } else {
        currentY = window.scrollY || document.documentElement.scrollTop;
      }

      if (!initialRecorded) {
        startScrollY = currentY;
        initialRecorded = true;
        return;
      }

      // If user scrolls down by more than 15px, disappear immediately
      if (currentY > startScrollY + 15 || currentY > 40) {
        dismiss();
      }
    };

    // Listen with capture=true to catch scrolls on both window and inner overflow-y-auto containers
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <aside 
        aria-label="New Update Announcement"
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[94%] max-w-lg transition-all duration-300 ease-out ${
          isExiting 
            ? 'opacity-0 -translate-y-6 scale-95 pointer-events-none' 
            : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        <div 
          className="relative overflow-hidden bg-slate-900/95 dark:bg-slate-900/95 text-white border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl p-3.5 sm:p-4"
          style={{
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.45), 0 0 20px 2px rgba(99, 102, 241, 0.2)'
          }}
        >
          {/* Top Row: Badge, Title & Dismiss Button */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-md shadow-indigo-500/20 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    System Update
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <ArrowDown className="w-2.5 h-2.5 opacity-60" /> scrolls to dismiss
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-100 leading-tight">
                  Excel Remarks, DD/MM/YYYY Dates & System Updates
                </h4>

                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  Full notes with production date context, standardized DD/MM/YYYY date formatting across all views, and automatic duplicate log cleanup.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={dismiss}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer shrink-0"
              title="Dismiss announcement"
              aria-label="Dismiss announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => setShowFullDetails(true)}
              className="inline-flex items-center gap-1 text-indigo-300 hover:text-indigo-200 font-semibold cursor-pointer transition hover:underline"
            >
              <FileText className="w-3 h-3" /> View Update Details <ChevronRight className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={dismiss}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-[10px] transition cursor-pointer"
            >
              Got it
            </button>
          </div>

          {/* Countdown Progress Bar (Disappears automatically when filled) */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/60">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </aside>

      {/* Optional Expanded Release Notes Modal */}
      {showFullDetails && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
          onClick={() => setShowFullDetails(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    What's New in This Version
                  </h3>
                  <p className="text-xs text-slate-400">Production Dashboard & Log enhancements</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFullDetails(false)}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-900 dark:text-white">Excel-Style Dog-Ear Markers:</b> Table cells stay clean with no oversized text tags. A neat triangular mark indicates where notes are attached.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-900 dark:text-white">Unclipped Floating Notes:</b> Notes render smoothly on top of tables with complete text, process info, and targets without getting cut off.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-900 dark:text-white">Production Date & Context:</b> Popovers and modals now clearly display the associated production date, batch number, process, and quantity targets.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-900 dark:text-white">Standardized DD/MM/YYYY Format:</b> All production dates, input fields, log timestamps, and CSV reports strictly follow the DD/MM/YYYY standard.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-900 dark:text-white">Duplicate Prevention:</b> Enhanced signature-based deduplication eliminates duplicate activity logs and production entries across devices and syncs.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-900 dark:text-white">Pin & Expand Controls:</b> Click to pin open any note while comparing data, copy remarks in one click, or expand to full modal view.
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowFullDetails(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
