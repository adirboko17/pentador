"use client";

import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";

const ReducedMotion = createContext(false);
const preferencesKey = "pentador-accessibility";

export function useReducedMotion() {
  return useContext(ReducedMotion);
}

export function AccessibilityTools({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  const reduceMotion = preferences.includes("motion");
  const underlineLinks = preferences.includes("links");
  const largeText = preferences.includes("text");
  const highContrast = preferences.includes("contrast");

  useEffect(() => {
    try {
      setPreferences((localStorage.getItem(preferencesKey) ?? "").split(" ").filter(Boolean));
    } catch {
      // Apply preferences for the current page if storage is unavailable.
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("reduced-motion", reduceMotion || systemReducedMotion);
    document.documentElement.classList.toggle("underline-links", underlineLinks);
    document.documentElement.classList.toggle("large-text", largeText);
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [reduceMotion, systemReducedMotion, underlineLinks, largeText, highContrast]);

  function togglePreference(name: string) {
    const next = preferences.includes(name) ? preferences.filter(value => value !== name) : [...preferences, name];
    setPreferences(next);
    try {
      localStorage.setItem(preferencesKey, next.join(" "));
    } catch {
      // The current page still reflects the change.
    }
  }

  return (
    <ReducedMotion.Provider value={reduceMotion || systemReducedMotion}>
      <a className="skip-link" href="#main-content" tabIndex={0}>דילוג לתוכן הראשי</a>
      <button className="accessibility-launch" type="button" aria-label="אפשרויות נגישות"
        aria-haspopup="dialog" aria-controls="accessibility-dialog" onClick={() => dialog.current?.showModal()}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="4.5" r="1.6" />
          <path d="M4 8l8 2 8-2M12 10v4m0 0-3.5 6m3.5-6 3.5 6" />
        </svg>
      </button>
      <dialog className="accessibility-dialog" ref={dialog} id="accessibility-dialog" aria-labelledby="accessibility-title">
        <div className="accessibility-dialog-head">
          <h2 id="accessibility-title">אפשרויות נגישות</h2>
          <button className="accessibility-close" type="button" aria-label="סגירת אפשרויות נגישות" onClick={() => dialog.current?.close()}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="accessibility-options">
          <button type="button" aria-pressed={reduceMotion || systemReducedMotion} disabled={systemReducedMotion} onClick={() => togglePreference("motion")}>
            צמצום תנועה
          </button>
          <button type="button" aria-pressed={underlineLinks} onClick={() => togglePreference("links")}>הדגשת קישורים</button>
          <button type="button" aria-pressed={largeText} onClick={() => togglePreference("text")}>הגדלת טקסט ל־125%</button>
          <button type="button" aria-pressed={highContrast} onClick={() => togglePreference("contrast")}>ניגודיות גבוהה</button>
        </div>
        {systemReducedMotion && <p className="accessibility-system-note">צמצום תנועה מופעל בהגדרות המכשיר.</p>}
        <a href="/accessibility" onClick={() => dialog.current?.close()}>הצהרת הנגישות ופרטי קשר</a>
      </dialog>
      {children}
    </ReducedMotion.Provider>
  );
}
