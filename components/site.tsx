"use client";

import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { advantages, caveats, faq, insideFeatures, installedPrice, methods, techSpecs } from "@/lib/content";
import { LockScene } from "./lock-scene";
import { PeepDemo } from "./peep-demo";

const heroTitle = "המנעול שמזהה אותך.";
const highlights = [
  ["דרכי פתיחה", "7"],
  ["משתמשים", "250"],
  ["ניהול מרחוק", "Wi‑Fi"],
  ["הפעלת חירום", "USB‑C"],
] as const;

function HighlightStrip() {
  return (
    <div id="highlights" className="stats scroll-reveal">
      <div className="stats-window">
        <div className="stats-track">
          {[false, true].map(copy => (
            <dl key={String(copy)} className="stats-group" aria-hidden={copy || undefined} aria-label={copy ? undefined : "המנעול במבט מהיר"}>
              {highlights.map(([label, value]) => (
                <div key={label} className="stat">
                  <dt>{label}</dt>
                  <dd dir="ltr">{value}</dd>
                </div>
              ))}
            </dl>
          ))}
        </div>
      </div>
    </div>
  );
}

const methodSymbols: Record<(typeof methods)[number]["n"], string> = {
  "01": "M3 8V5a2 2 0 0 1 2-2h3m8 0h3a2 2 0 0 1 2 2v3m0 8v3a2 2 0 0 1-2 2h-3m-8 0H5a2 2 0 0 1-2-2v-3m5-7v1m8-1v1m-8 4q4 5 8 0",
  "02": "M4 11a8 8 0 0 1 16 0v3M7 13v-2a5 5 0 0 1 10 0v4q0 3-1 5M10 15v-4a2 2 0 0 1 4 0v4q0 4-2 6m-2-4q0 2-2 4m-1-6q0 2-2 4",
  "03": "M8 13V6a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-6a1.5 1.5 0 0 1 3 0v7-4a1.5 1.5 0 0 1 3 0v6c0 5-2.5 8-7 8-3 0-5-2-7-5l-3-4a1.6 1.6 0 0 1 2.4-2z",
  "04": "M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm1.5 5h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1",
  "05": "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm-1 5h18M7 15h4",
  "06": "M8 2.5h8a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zm2 0v2h4v-2m-3 16h2",
  "07": "M14 3a6 6 0 0 1 6 6 6 6 0 0 1-8 5.65L6 21H3v-3l6-6.2A6 6 0 0 1 14 3zm2 4h.01",
};

function Check({ color = "#30D158", size = 20 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const securityItems = [
  {
    title: "התראת שהייה",
    body: "שלוש הופעות של פנים לא מוכרות בתוך דקה מפעילות אזעקה.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5F5F7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 7V5a2 2 0 0 1 2-2h2" />
        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    title: "אזעקה נגד פריצה",
    body: "התראה בניסיון פירוק או פריצה.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5F5F7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 18v-6a5 5 0 1 1 10 0v6" />
        <path d="M5 21a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1z" />
        <path d="M21 12h1" />
        <path d="M18.5 4.5 18 5" />
        <path d="M2 12h1" />
        <path d="M12 2v1" />
        <path d="m4.93 4.93.71.71" />
        <path d="M12 12v6" />
      </svg>
    ),
  },
  {
    title: "חסימה אחרי 5 ניסיונות",
    body: "חמישה ניסיונות שגויים נועלים את המקלדת ל‑90 שניות.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5F5F7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 22h14" />
        <path d="M5 2h14" />
        <path d="M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22" />
        <path d="M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2" />
      </svg>
    ),
  },
  {
    title: "אימות כפול",
    body: "דרישה לשני אמצעי זיהוי שונים.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5F5F7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "נעילה אוטומטית",
    body: "הבריח ננעל לבד אחרי 10, 20 או 30 שניות.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5F5F7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 7.5-1.9" />
        <path d="M12 15v2" />
        <path d="M18 2v4h-4" />
      </svg>
    ),
  },
  {
    title: "יומן כניסות",
    body: "מי נכנס, מתי ובאיזו דרך.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5F5F7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M12 11h4" />
        <path d="M12 16h4" />
        <path d="M8 11h.01" />
        <path d="M8 16h.01" />
      </svg>
    ),
  },
];

export function Site() {
  const [open, setOpen] = useState(0);
  const [sent, setSent] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const orderRef = useRef<HTMLElement>(null);
  const [orderVisible, setOrderVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const [footerVisible, setFooterVisible] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page || !("IntersectionObserver" in window)) return;
    page.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target;
        if (!entry.isIntersecting) {
          element.classList.remove("in-view");
        } else if (entry.intersectionRatio >= 0.2) {
          element.classList.add("in-view");
        }
      }
    }, { threshold: [0, 0.2] });
    page.querySelectorAll(".scroll-reveal, .hero-title").forEach(element => observer.observe(element));
    return () => {
      observer.disconnect();
      page.classList.remove("motion-ready");
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 600;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    onScroll();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === orderRef.current) setOrderVisible(entry.isIntersecting);
        if (entry.target === footerRef.current) setFooterVisible(entry.isIntersecting);
      }
    });
    if (orderRef.current) observer.observe(orderRef.current);
    if (footerRef.current) observer.observe(footerRef.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <div className="page" ref={pageRef}>
      <header className="header">
        <div className="header-inner">
          <a href="#top" className="logo-link">
            <img src="/assets/logo-white.png" alt="Pentador" />
          </a>
          <nav className="nav">
            <a href="#methods">דרכי פתיחה</a>
            <a href="#inside">צד פנימי</a>
            <a href="#security">אבטחה</a>
            <a href="#specs">מפרט</a>
            <a href="#faq">שאלות</a>
          </nav>
          <a href="#order" className="btn">
            להזמנה
          </a>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Pentador Smart Lock</span>
            <h1 className="hero-title" aria-label={heroTitle}>
              {heroTitle.split(" ").map((word, index) => (
                <Fragment key={word}>
                  {index > 0 && " "}
                  <span className="focus-word" aria-hidden="true" style={{ animationDelay: `${index * 110}ms` }}>{word}</span>
                </Fragment>
              ))}
            </h1>
            <p className="lede">פותחים בזיהוי פנים ורואים מבפנים מי בדלת.</p>
          </div>
          <div className="lock-stage">
            <LockScene />
          </div>
          <div className="hero-actions">
            <a href="#order" className="btn btn-lg">להזמנת המנעול</a>
            <a href="#methods" className="text-link">
              איך זה עובד
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <span className="install-note"><strong>{installedPrice}</strong> <span>כולל התקנה</span></span>
          </div>
        </div>
        <div className="wrap highlights-wrap">
          <HighlightStrip />
        </div>
      </section>

      <section id="methods" className="section unlock-section" aria-labelledby="unlock-title">
        <header className="unlock-intro scroll-reveal">
          <h2 id="unlock-title">שבע דרכים <br />להיכנס הביתה<span>.</span></h2>
          <p>כל אחד בבית בוחר איך להיכנס. לאבטחה נוספת אפשר לשלב שני אמצעי זיהוי.</p>
        </header>
        <ul className="methods">
          {methods.map((method, index) => (
            <li key={method.n} className="method scroll-reveal" style={{ transitionDelay: `${index * 70}ms` }}>
              <svg className="method-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={methodSymbols[method.n]} />
              </svg>
              <div>
                <h3>{method.title}</h3>
                <p>{method.body}</p>
              </div>
              {method.n === "01" && <img className="method-product" src="/assets/lock-hero.png" alt="" loading="lazy" />}
            </li>
          ))}
        </ul>
        <a href="#order" className="btn method-cta">להזמנת המנעול <span aria-hidden="true">←</span></a>
      </section>

      <section id="inside" className="inside" aria-labelledby="inside-title">
        <div className="inside-inner">
          <header className="center-head">
            <span className="eyebrow-dark">הצד הפנימי</span>
            <h2 id="inside-title">רואים מי בדלת לפני שפותחים.</h2>
          </header>
          <div className="inside-layout">
            <div className="product-shot scroll-reveal">
              <img src="/assets/lock-hero.png" alt="שני צדי המנעול, עם מסך בפנל הפנימי ומצלמה בפנל החיצוני" loading="lazy" />
            </div>
            <dl className="inside-features">
              {insideFeatures.map(({ title, description }) => (
                <div key={title}>
                  <dt>{title}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="security" className="section security" aria-labelledby="security-title">
        <span className="eyebrow">אבטחה</span>
        <h2 id="security-title">שם לב גם למי שלא אמור להיות שם.</h2>
        <div className="peep-card">
          <div className="peep-intro">
            <h3>קוד הסוואה</h3>
            <p>מוסיפים ספרות לפני הקוד ואחריו, עד 24 ספרות בסך הכול. המנעול מזהה את הקוד בתוך הרצף.</p>
          </div>
          <PeepDemo />
        </div>
        <ul className="sec-list">
            {securityItems.map((item) => (
              <li key={item.title} className="sec-item">
                {item.icon}
                <div className="sec-copy">
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </div>
              </li>
            ))}
        </ul>
      </section>

      <section id="specs" className="specs" aria-labelledby="specs-title">
        <div className="specs-block">
          <h2 id="specs-title">בקצרה.</h2>
          <div className="spec-grid">
            <div className="spec-card">
              <h3>יתרונות</h3>
              <ul>
                {advantages.map((item) => (
                  <li key={item}>
                    <Check color="#b7d4c2" size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="spec-card">
              <h3>כדאי לדעת</h3>
              <ul>
                {caveats.map((item) => (
                  <li key={item.text}>
                    <span className="note-mark" aria-hidden="true" />
                    <span>
                      {item.text}
                      {"ltr" in item && item.ltr ? (
                        <>
                          {" "}
                          <bdi dir="ltr">{item.ltr}</bdi>
                        </>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="tech">
            <h3>מפרט טכני</h3>
            <dl className="tech-grid">
              {techSpecs.map((spec) => (
                <div key={spec.k}>
                  <dt>{spec.k}</dt>
                  <dd><bdi dir="ltr">{spec.v}</bdi></dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section ref={orderRef} id="order" className="order" aria-labelledby="order-title">
        <div className="order-inner">
            <div className="order-summary">
              <div className="order-offer">
                <h2 id="order-title">הזמנת Pentador</h2>
                <div className="price-row">
                  <strong>{installedPrice}</strong>
                  <span>כולל התקנה אצלכם בבית</span>
                </div>
                <div className="order-visual">
                  <img src="/assets/lock-hero.png" loading="lazy" alt="מנעול Pentador, הצד הפנימי והחיצוני" />
                </div>
              </div>
              <p className="order-contents">בערכה: שני מפתחות, שני כרטיסים וסוללת ליתיום נטענת.</p>
            </div>
            <div className="order-body">
              {sent ? (
                <div className="thanks" role="status">
                  <strong>תודה, קיבלנו.</strong>
                  <span>ניצור קשר בהקדם לתיאום ההתקנה.</span>
                </div>
              ) : (
                <form className="order-form" onSubmit={submit} aria-labelledby="order-form-title">
                  <h3 id="order-form-title">עם מי לתאם התקנה?</h3>
                  <div className="fields">
                    <label><input required name="name" placeholder=" " autoComplete="name" /><span>שם מלא</span></label>
                    <label><input required name="phone" placeholder=" " type="tel" dir="ltr" autoComplete="tel" /><span>מספר טלפון</span></label>
                  </div>
                  <button type="submit" className="btn submit">
                    חזרו אליי לתיאום <span aria-hidden="true">←</span>
                  </button>
                  <a href="https://wa.me/" target="_blank" rel="noreferrer" className="wa">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />
                    </svg>
                    הזמנה בוואטסאפ
                  </a>
                </form>
              )}
            </div>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-title">
        <div className="faq-block">
          <h2 id="faq-title">שאלות נפוצות</h2>
          <div className="faq-list">
            {faq.map((item, index) => {
              const isOpen = open === index;
              return (
                <div key={item.q} className="faq-item" data-open={isOpen}>
                  <h3>
                    <button type="button" className="faq-q" onClick={() => setOpen(isOpen ? -1 : index)} aria-expanded={isOpen} aria-controls={`faq-answer-${index}`}>
                      {item.q}
                      <span className="faq-chevron" aria-hidden="true" />
                    </button>
                  </h3>
                  <p id={`faq-answer-${index}`} hidden={!isOpen}>{item.a}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer id="footer" ref={footerRef} className="footer">
        <div className="footer-inner">
          <img src="/assets/logo-white.png" alt="Pentador" />
          <div className="footer-copy">
            <span>ביטחון חכם לבית שלך</span>
            <small><bdi dir="ltr">© 2026 Pentador</bdi></small>
          </div>
        </div>
      </footer>

      {scrolled && !orderVisible && !footerVisible ? (
        <aside className="sticky" aria-label="הזמנת מנעול Pentador">
          <div className="sticky-product" aria-hidden="true">
            <img src="/assets/lock-hero.png" alt="" />
          </div>
          <div className="sticky-price">
            <strong>{installedPrice}</strong>
            <span>כולל התקנה</span>
          </div>
          <a href="#order" className="btn sticky-cta">
            להזמנה <span aria-hidden="true">←</span>
          </a>
        </aside>
      ) : null}
    </div>
  );
}
