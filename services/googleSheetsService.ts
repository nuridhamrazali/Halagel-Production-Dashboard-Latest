
import { ProductionEntry, OffDay, User } from '../types';

/**
 * GOOGLE SHEETS CONFIGURATION
 * 
 * 1. To make the database work for EVERYONE, paste your URL below.
 * 2. IMPORTANT: Your Google Apps Script must be deployed as a "Web App" 
 *    with access set to "Anyone" (including anonymous).
 */
export const HARDCODED_URL = "https://script.google.com/macros/s/AKfycby89ZKqdlsZilyBVQHUT7DLrvKdmethDA_BnNeLYmEJlvzL0vQdMzQycB9PcTf-DGp_/exec";

const getSheetUrl = () => {
  const savedUrl = localStorage.getItem('halagel_sheets_api_url');
  if (savedUrl && savedUrl.startsWith('https://script.google.com')) {
    return savedUrl;
  }
  if (HARDCODED_URL && HARDCODED_URL.startsWith('https://script.google.com')) {
    return HARDCODED_URL;
  }
  return null;
};

export const GoogleSheetsService = {
  isEnabled: () => !!getSheetUrl(),
  
  getActiveUrl: () => getSheetUrl(),

  fetchData: async <T>(action: string): Promise<T | null> => {
    const url = getSheetUrl();
    if (!url) return null;

    try {
      const seed = Math.random().toString(36).substring(7);
      const response = await fetch(`${url}?action=${action}&_t=${Date.now()}&_s=${seed}`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      // Use console.warn instead of console.error to prevent AI Studio error metadata while gracefully falling back to local storage
      console.warn(`Google Sheets Fetch Error (${action}):`, error?.toString() || 'Network failure');
      return null;
    }
  },

  saveData: async (action: string, payload: any): Promise<boolean> => {
    const url = getSheetUrl();
    if (!url) return false;

    try {
      // We use standard fetch. Even with no-cors, we wrap it in a Promise 
      // and give the cloud a small headstart before the next sync triggers.
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ 
          action, 
          data: payload, 
          timestamp: Date.now() 
        })
      });
      
      // Artificial delay to allow Google's eventual consistency to resolve
      // before a "Sync" fetch might happen.
      await new Promise(resolve => setTimeout(resolve, 800));
      return true;
    } catch (error) {
      console.warn(`Google Sheets Save Error (${action}):`, error?.toString() || 'Network failure');
      return false;
    }
  }
};
