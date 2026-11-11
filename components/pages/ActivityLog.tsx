
import React, { useEffect, useState, useCallback } from 'react';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboard } from '../../contexts/DashboardContext';
import { ActivityLog as LogEntry } from '../../types';
import { History, User, Clock, Loader2, RotateCw } from 'lucide-react';
import { formatFullTimestamp } from '../../utils/dateUtils';

export const ActivityLog: React.FC = () => {
  const { user: authUser } = useAuth();
  const { refreshKey, triggerRefresh } = useDashboard();
  // Initialize immediately with existing deduplicated local logs (never blank)
  const [logs, setLogs] = useState<LogEntry[]>(() => StorageService.getLogs());
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync with cloud to pull latest actions from other devices/users
  const syncLogs = useCallback(async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      await StorageService.syncWithSheets();
      setLogs(StorageService.getLogs());
    } catch (err) {
      console.warn("Log Sync Error:", err?.toString() || 'Network failure');
    } finally {
      if (!silent) setIsSyncing(false);
    }
  }, []);

  // Initial cloud sync & periodic polling while looking at activity logs
  useEffect(() => {
    if (authUser) {
      syncLogs(false);

      // Live polling every 10 seconds so actions from other sessions appear automatically
      const pollInterval = setInterval(() => {
        if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
          syncLogs(true);
        }
      }, 10000);

      return () => clearInterval(pollInterval);
    }
  }, [authUser, syncLogs]);

  // Real-time immediate update when a new action is submitted anywhere in the app
  useEffect(() => {
    const handleLogUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.logs && Array.isArray(customEvent.detail.logs)) {
        setLogs(customEvent.detail.logs);
      } else {
        setLogs(StorageService.getLogs());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'halagel_activity_logs' || (e.key && e.key.startsWith('halagel_'))) {
        setLogs(StorageService.getLogs());
      }
    };

    window.addEventListener('activity-log-updated', handleLogUpdate);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('halagel-data-updated', () => setLogs(StorageService.getLogs()));

    return () => {
      window.removeEventListener('activity-log-updated', handleLogUpdate);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('halagel-data-updated', () => setLogs(StorageService.getLogs()));
    };
  }, []);

  // Update list whenever refreshKey changes
  useEffect(() => {
    setLogs(StorageService.getLogs());
  }, [refreshKey]);

  if (!authUser) {
    return (
        <div className="p-12 text-center text-slate-400 font-bold">Please log in to view system activity.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <History className="w-6 h-6 text-indigo-500" />
            System Activity Log
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Audit trail of all manufacturing operations</p>
        </div>
        <div className="flex items-center gap-2">
          {isSyncing ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-800 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              Syncing Cloud...
            </div>
          ) : (
            <button
              onClick={() => syncLogs(false)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
              title="Refresh and sync latest logs"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}
          <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-800 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">
            {logs.length} Total Actions
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <ul className="divide-y divide-gray-100 dark:divide-slate-700">
            {logs.length === 0 && !isSyncing ? (
                <li className="p-12 text-center flex flex-col items-center justify-center gap-4">
                   <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-200">
                      <History className="w-10 h-10" />
                   </div>
                   <p className="text-slate-400 font-bold italic">No system activity recorded yet.</p>
                </li>
            ) : logs.map(log => (
                <li key={log.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
                    <div className="flex justify-between items-start gap-6">
                        <div className="flex gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                              <User className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-black text-slate-800 dark:text-white">{log.userName}</span>
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 font-mono tracking-tighter">
                                  {log.action}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{log.details}</p>
                           </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1 shrink-0">
                           <div className="flex items-center gap-1.5 text-slate-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                {formatFullTimestamp(log.timestamp)}
                              </span>
                           </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
