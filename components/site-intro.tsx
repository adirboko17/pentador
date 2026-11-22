"use client";

import { useLayoutEffect, useState } from "react";
import { readAccessibilityPreferences, useReducedMotion } from "./accessibility-tools";

export function SiteIntro() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (window.location.hash || window.scrollY > 0 ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        readAccessibilityPreferences().includes("motion")) return;

    setVisible(true);
  }, []);

  useLayoutEffect(() => {
    if (!visible || reduceMotion) return;

    const listeners = new AbortController();
    const options = { capture: true, passive: true, signal: listeners.signal };
    const timeout = window.setTimeout(dismiss, 3000);

    function dismiss() {
      setVisible(false);
    }

    window.addEventListener("pointerdown", dismiss, options);
    window.addEventListener("keydown", dismiss, options);
    window.addEventListener("focusin", dismiss, options);
    window.addEventListener("scroll", dismiss, options);
    return () => {
      window.clearTimeout(timeout);
      listeners.abort();
    };
  }, [visible, reduceMotion]);

  if (!visible || reduceMotion) return null;

  return (
    <div className="site-intro" aria-hidden="true" onAnimationEnd={(event) => {
      if (event.target === event.currentTarget) setVisible(false);
    }}>
      <div className="site-intro-content">
        <div className="site-intro-scanner">
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 19V9a4 4 0 0 1 4-4h10m26 0h10a4 4 0 0 1 4 4v10m0 26v10a4 4 0 0 1-4 4H45m-26 0H9a4 4 0 0 1-4-4V45" />
            <path className="site-intro-face" d="M21 27v3m22-3v3m-11-3-2 10h3m-10 5c4 6 14 6 18 0" />
            <path className="site-intro-check" d="m20 33 8 8 16-17" strokeWidth="2.6" />
          </svg>
          <span className="site-intro-line" />
        </div>
        <div className="site-intro-status">
          <span>הדמיית זיהוי פנים</span>
          <span>הפנים זוהו</span>
        </div>
      </div>
      <img className="site-intro-logo" src="/assets/logo-white.png" width={1331} height={319} alt="" />
    </div>
  );
}
