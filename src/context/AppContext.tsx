import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth, testConnection } from '../lib/firebase';
import { checkIsAdminUser, subscribeWebsiteSettings } from '../services/repository';
import { DEFAULT_WEBSITE_SETTINGS, type WebsiteSettings } from '../types';

export interface CookieConsentState {
  decided: boolean;
  essential: true;
  analytics: boolean;
  advertising: boolean;
  updatedAt: string;
}

const COOKIE_STORAGE_KEY = 'shortstudy_cookie_consent_v1';

const DEFAULT_CONSENT: CookieConsentState = {
  decided: false,
  essential: true,
  analytics: false,
  advertising: false,
  updatedAt: ''
};

function readStoredConsent(): CookieConsentState {
  try {
    const raw = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!raw) return DEFAULT_CONSENT;
    const parsed = JSON.parse(raw) as Partial<CookieConsentState>;
    return {
      decided: Boolean(parsed.decided),
      essential: true,
      analytics: Boolean(parsed.analytics),
      advertising: Boolean(parsed.advertising),
      updatedAt: String(parsed.updatedAt || '')
    };
  } catch {
    return DEFAULT_CONSENT;
  }
}

interface AppContextValue {
  settings: WebsiteSettings;
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  adminCheckReady: boolean;
  logout: () => Promise<void>;
  cookieConsent: CookieConsentState;
  cookieModalOpen: boolean;
  setCookieModalOpen: (open: boolean) => void;
  saveCookieConsent: (analytics: boolean, advertising: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_WEBSITE_SETTINGS);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckReady, setAdminCheckReady] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<CookieConsentState>(() => readStoredConsent());
  const [cookieModalOpen, setCookieModalOpen] = useState(false);

  useEffect(() => {
    void testConnection();
    const unsubSettings = subscribeWebsiteSettings((next) => {
      setSettings(next);
    });
    const unsubAuth = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      if (nextUser && nextUser.emailVerified) {
        const adminOk = await checkIsAdminUser(nextUser.uid, nextUser.email);
        setIsAdmin(adminOk);
      } else {
        setIsAdmin(false);
      }
      setAdminCheckReady(true);
    });
    return () => {
      unsubSettings();
      unsubAuth();
    };
  }, []);

  const logout = async () => {
    await signOut(auth);
    setIsAdmin(false);
  };

  const saveCookieConsent = (analytics: boolean, advertising: boolean) => {
    const next: CookieConsentState = {
      decided: true,
      essential: true,
      analytics,
      advertising,
      updatedAt: new Date().toISOString()
    };
    setCookieConsent(next);
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage quota restrictions
    }
    setCookieModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        user,
        authReady,
        isAdmin,
        adminCheckReady,
        logout,
        cookieConsent,
        cookieModalOpen,
        setCookieModalOpen,
        saveCookieConsent
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
