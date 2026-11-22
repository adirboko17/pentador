"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./accessibility-tools";

const exampleCode = "123456";
const paddingLength = 4;
const sample = "8371" + exampleCode + "5928";

function makeSequence() {
  const padding = () => Array.from({ length: paddingLength }, () => Math.floor(Math.random() * 10)).join("");
  return padding() + exampleCode + padding();
}

const statusText = {
  typing: "מקלידים את הרצף…",
  scan: "מזהה את הקוד בתוך הרצף",
  open: "הקוד זוהה · הדלת נפתחה",
};

export function PeepDemo() {
  const reduceMotion = useReducedMotion();
  const display = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [digits, setDigits] = useState(sample);
  const [count, setCount] = useState(sample.length);
  const [phase, setPhase] = useState<keyof typeof statusText>("open");

  useEffect(() => {
    if (!display.current || reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRun(1);
        observer.disconnect();
      }
    }, { threshold: 0.6 });
    observer.observe(display.current);
    return () => observer.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    if (!run || reduceMotion) return;
    const sequence = makeSequence();
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
  }, [run, reduceMotion]);

  const visiblePhase = reduceMotion ? "open" : phase;
  const visibleCount = reduceMotion ? digits.length : count;

  function replay() {
    if (reduceMotion) {
      setDigits(makeSequence());
      return;
    }
    setRun(value => value + 1);
  }

  return (
    <div className="peep-box" ref={display} data-phase={visiblePhase}>
      <div className="peep-toolbar">
        <span>הדגמת פתיחה</span>
        <button type="button" onClick={replay}>הדגמה חוזרת <span aria-hidden="true">↻</span></button>
      </div>
      <div className="peep-digits" dir="ltr" aria-hidden="true">
        {digits.split("").map((digit, index) => (
          <span key={index} className={index >= paddingLength && index < paddingLength + exampleCode.length ? "code-digit" : undefined}>
            {index < visibleCount ? digit : "·"}
          </span>
        ))}
      </div>
      <div className="peep-meta">
        <span role="status">{statusText[visiblePhase]}</span>
        <span dir="ltr" aria-hidden="true">{visibleCount} / 24</span>
      </div>
      <p className="peep-example">הקוד בדוגמה <bdi dir="ltr">{exampleCode}</bdi></p>
    </div>
  );
}
