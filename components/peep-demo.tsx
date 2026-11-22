"use client";

import { useEffect, useRef, useState } from "react";

const exampleCode = "123456";
const paddingLength = 4;
const sample = "8371" + exampleCode + "5928";

const statusText = {
  typing: "מקלידים את הרצף…",
  scan: "מזהה את הקוד בתוך הרצף",
  open: "הקוד זוהה · הדלת נפתחה",
};

export function PeepDemo() {
  const display = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [digits, setDigits] = useState(sample);
  const [count, setCount] = useState(sample.length);
  const [phase, setPhase] = useState<keyof typeof statusText>("open");

  useEffect(() => {
    if (!display.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRun(1);
        observer.disconnect();
      }
    }, { threshold: 0.6 });
    observer.observe(display.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!run) return;
    const padding = () => Array.from({ length: paddingLength }, () => Math.floor(Math.random() * 10)).join("");
    const sequence = padding() + exampleCode + padding();
    setDigits(sequence);
    setPhase("typing");
    setCount(0);

    let timer: ReturnType<typeof setTimeout>;
    function typeNext(index: number) {
      setCount(index);
      if (index < sequence.length) {
        timer = setTimeout(() => typeNext(index + 1), 135);
      } else {
        timer = setTimeout(() => {
          setPhase("scan");
          timer = setTimeout(() => setPhase("open"), 900);
        }, 450);
      }
    }
    timer = setTimeout(() => typeNext(1), 160);
    return () => clearTimeout(timer);
  }, [run]);

  return (
    <div className="peep-box" ref={display} data-phase={phase}>
      <div className="peep-toolbar">
        <span>הדגמת פתיחה</span>
        <button type="button" onClick={() => setRun(value => value + 1)}>הדגמה חוזרת <span aria-hidden="true">↻</span></button>
      </div>
      <div className="peep-digits" dir="ltr" aria-hidden="true">
        {digits.split("").map((digit, index) => (
          <span key={index} className={index >= paddingLength && index < paddingLength + exampleCode.length ? "code-digit" : undefined}>
            {index < count ? digit : "·"}
          </span>
        ))}
      </div>
      <div className="peep-meta">
        <span role="status">{statusText[phase]}</span>
        <span dir="ltr" aria-hidden="true">{count} / 24</span>
      </div>
    </div>
  );
}
