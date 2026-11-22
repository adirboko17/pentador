"use client";

import { FormEvent, Fragment, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { advantages, caveats, contactEmail, contactPhones, faq, insideFeatures, installedPrice, methods, techSpecs } from "@/lib/content";
import { PeepDemo } from "./peep-demo";

const heroTitle = "המנעול שמזהה אותך.";
const leadFields = [
  { name: "name", label: "שם מלא", placeholder: "למשל, דנה כהן", autoComplete: "name", maxLength: 100 },
  { name: "phone", label: "מספר טלפון", placeholder: "050-123-4567", autoComplete: "tel", maxLength: 30 },
  { name: "city", label: "עיר מגורים", placeholder: "למשל, חיפה", autoComplete: "address-level2", maxLength: 100 },
] as const;
type LeadErrors = Partial<Record<(typeof leadFields)[number]["name"], string>>;
const insideSymbols: Record<(typeof insideFeatures)[number]["title"], string> = {
  "מסך פנימי": "M4 4.5h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Zm8 13v3m-4 0h8",
  "מצלמת עינית": "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  "פעמון מובנה": "M5 17h14c-2-2-2-4-2-7a5 5 0 0 0-10 0c0 3 0 5-2 7Zm5 3a2.5 2.5 0 0 0 4 0M12 3v2",
  "נעילה בלחיצה": "M7 10V8a5 5 0 0 1 10 0v2M6 10h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Zm6 4v3",
  "ידית פתיחה מהירה": "M4 21h16M6 20V4l10-1v17M16 5h3v15M10 12h3",
  "חיווי קולי בעברית": "M3 9h4l5-4v14l-5-4H3Zm13-1a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14",
};
const highlights = [
  ["דרכי פתיחה", "7"],
  ["משתמשים", "250"],
  ["ניהול מרחוק", "Wi‑Fi"],
  ["הפעלת חירום", "USB‑C"],
] as const;

function OrderChevron() {
  return (
    <svg className="order-cta-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m10 3-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OrderLink({
  children,
  className = "",
  showChevron = false,
}: {
  children: ReactNode;
  className?: string;
  showChevron?: boolean;
}) {
  return (
    <a href="#order" className={`btn order-cta ${className}`.trimEnd()}>
      <img className="order-cta-image" src="/assets/lock-hero.png" alt="" />
      {children}
      {showChevron && <OrderChevron />}
    </a>
  );
}

function HighlightStrip() {
  return (
    <div id="highlights" className="stats scroll-reveal">
      <dl className="stats-group" aria-label="המנעול במבט מהיר">
        {highlights.map(([label, value]) => (
          <div key={label} className="stat">
            <dt>{label}</dt>
            <dd dir="ltr">{value}</dd>
          </div>
        ))}
      </dl>
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

function SpecCard({ title, panelId, children, initiallyOpen = false }: {
  title: string;
  panelId: string;
  children: ReactNode;
  initiallyOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  return (
    <div className="spec-card" data-open={isOpen}>
      <h2>
        <button type="button" className="tech-toggle" aria-controls={panelId}
          aria-expanded={isOpen} onClick={() => setIsOpen(current => !current)}>
          {title}
          <span className="tech-toggle-icon" aria-hidden="true" />
        </button>
      </h2>
      <div className="accordion-panel" id={panelId} inert={!isOpen}>
        <div>{children}</div>
      </div>
    </div>
  );
}

const specTopics = [
  {
    id: "advantages",
    title: "יתרונות",
    content: <ul>{advantages.map(item => (
      <li key={item}><Check color="currentColor" size={16} /><span>{item}</span></li>
    ))}</ul>,
  },
  {
    id: "caveats",
    title: "כדאי לדעת",
    content: <ul>{caveats.map(item => (
      <li key={item.text}>
        <span className="note-mark" aria-hidden="true" />
        <span>{item.text}{"ltr" in item && <> <bdi dir="ltr">{item.ltr}</bdi></>}</span>
      </li>
    ))}</ul>,
  },
  {
    id: "tech-specs",
    title: "מפרט טכני",
    content: <dl className="tech-grid">{techSpecs.map(spec => (
      <div key={spec.k}><dt>{spec.k}</dt><dd><bdi dir="ltr">{spec.v}</bdi></dd></div>
    ))}</dl>,
  },
];

function SpecDetails() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <section id="specs" className="specs" aria-label="פרטי המנעול">
      <div className="specs-block">
        {specTopics.map(({ id, title, content }, index) => (
          <SpecCard key={id} title={title} panelId={id + "-panel"} initiallyOpen={index === 0}>{content}</SpecCard>
        ))}
        <div className="specs-desktop">
          <div className="specs-nav">
            <h2 id="specs-title">פרטי המנעול</h2>
            <div role="tablist" aria-labelledby="specs-title">
              {specTopics.map(({ id, title }, index) => (
                <button key={id} type="button" role="tab" id={id + "-tab"} aria-controls={id + "-detail"}
                  ref={element => { tabs.current[index] = element; }}
                  aria-selected={index === selected} tabIndex={index === selected ? 0 : -1}
                  onClick={() => setSelected(index)}
                  onKeyDown={event => {
                    const count = specTopics.length;
                    const next = { ArrowLeft: (index + 1) % count, ArrowRight: (index + count - 1) % count, Home: 0, End: count - 1 }[event.key];
                    if (next === undefined) return;
                    event.preventDefault();
                    setSelected(next);
                    tabs.current[next]?.focus();
                  }}>
                  {title}
                </button>
              ))}
            </div>
          </div>
          {specTopics.map(({ id, content }, index) => (
            <div key={id} id={id + "-detail"} role="tabpanel" aria-labelledby={id + "-tab"}
              className="specs-detail" tabIndex={0} hidden={index !== selected}>
              {content}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Site() {
  const [open, setOpen] = useState(0);
  const [leadStatus, setLeadStatus] = useState<"idle" | "sending" | "sent" | "invalid" | "error">("idle");
  const [leadErrors, setLeadErrors] = useState<LeadErrors>({});
  const leadForm = useRef<HTMLFormElement>(null);
  const leadSuccess = useRef<HTMLHeadingElement>(null);
  const lastLeadSubmission = useRef<{ body: string; key: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const orderRef = useRef<HTMLElement>(null);
  const [orderVisible, setOrderVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const [footerVisible, setFooterVisible] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    leadForm.current?.querySelector<HTMLInputElement>("[aria-invalid=true]")?.focus();
  }, [leadErrors]);

  useLayoutEffect(() => {
    if (leadStatus === "sent") leadSuccess.current?.focus();
  }, [leadStatus]);

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

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (leadStatus === "sending") return;

    const fields = new FormData(event.currentTarget);
    const name = String(fields.get("name") ?? "").trim();
    const phone = String(fields.get("phone") ?? "").trim();
    const city = String(fields.get("city") ?? "").trim();
    const errors: LeadErrors = {};
    if (!name) errors.name = "יש להזין שם מלא.";
    if (!/^\+?[0-9(). -]+$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g, ""))) {
      errors.phone = "יש להזין מספר טלפון תקין, למשל 050-123-4567.";
    }
    if (!city) errors.city = "יש להזין עיר מגורים.";
    setLeadErrors(errors);
    if (Object.keys(errors).length) {
      setLeadStatus("idle");
      return;
    }
    const body = JSON.stringify({ name, phone, city, website: fields.get("website") });

    if (lastLeadSubmission.current?.body !== body) {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      const key = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
      lastLeadSubmission.current = { body, key };
    }

    setLeadStatus("sending");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": lastLeadSubmission.current.key,
        },
        body,
      });
      setLeadStatus(response.ok ? "sent" : response.status === 400 ? "invalid" : "error");
    } catch {
      setLeadStatus("error");
    }
  };

  return (
    <div className="page" ref={pageRef}>
      <header className="header">
        <div className="header-inner">
          <a href="#top" className="logo-link">
            <img src="/assets/logo-white.png" alt="Pentador" />
          </a>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section id="top" className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <img className="hero-logo" src="/assets/logo-white.png" width="1331" height="319" alt="Pentador" />
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
            <div className="lock-stage" role="img" aria-label="מנעול Pentador מותקן על דלת הכניסה" />
            <div className="hero-actions">
              <OrderLink className="btn-lg" showChevron>להזמנת המנעול</OrderLink>
              <a href="#methods" className="text-link">איך זה עובד</a>
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
          <OrderLink className="method-cta" showChevron>להזמנת המנעול</OrderLink>
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
                    <dt>
                      <svg className="inside-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={insideSymbols[title]} />
                      </svg>
                      {title}
                    </dt>
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

        <SpecDetails />

        <section ref={orderRef} id="order" className="order" aria-labelledby="order-title">
          <div className="order-inner">
            <div className="order-summary">
              <div className="order-offer">
                <h2 id="order-title">מנעול Pentador</h2>
                <div className="price-row">
                  <strong><bdi dir="ltr">{installedPrice}</bdi></strong>
                  <span>כולל התקנה בבית</span>
                </div>
                <p className="order-contents">בערכה שני מפתחות, שני כרטיסים וסוללת ליתיום נטענת.</p>
              </div>
              <picture className="order-visual">
                <source media="(min-width: 860px)" srcSet="/assets/lock-door-mobile.webp" />
                <img src="/assets/lock-hero.png" loading="lazy" alt="מנעול Pentador" />
              </picture>
            </div>
            <div className="order-body">
              {leadStatus === "sent" ? (
                <div className="thanks">
                  <h3 ref={leadSuccess} tabIndex={-1} aria-describedby="order-success-detail">תודה, קיבלנו.</h3>
                  <p id="order-success-detail">ניצור קשר בהקדם לתיאום ההתקנה.</p>
                </div>
              ) : (
                <form ref={leadForm} className="order-form" onSubmit={submit} aria-labelledby="order-form-title" aria-describedby="order-required" noValidate>
                  <h3 id="order-form-title">תיאום התקנה</h3>
                  <p className="order-form-note" id="order-required">כל השדות חובה.</p>
                  <div className="fields">
                    {leadFields.map(({ name, label, placeholder, autoComplete, maxLength }) => (
                      <div className={name === "name" ? "order-name" : undefined} key={name}>
                        <label htmlFor={`order-${name}`}>{label}</label>
                        <input id={`order-${name}`} name={name} placeholder={placeholder} autoComplete={autoComplete}
                          type={name === "phone" ? "tel" : "text"} dir={name === "phone" ? "ltr" : undefined}
                          required maxLength={maxLength} readOnly={leadStatus === "sending"} aria-invalid={Boolean(leadErrors[name])}
                          aria-describedby={leadErrors[name] ? `order-${name}-error` : undefined} />
                        {leadErrors[name] && <p className="order-field-error" id={`order-${name}-error`}>{leadErrors[name]}</p>}
                      </div>
                    ))}
                  </div>
                  <div hidden>
                    <input name="website" tabIndex={-1} autoComplete="off" />
                  </div>
                  <button type="submit" className="btn submit" aria-disabled={leadStatus === "sending"}>
                    {leadStatus === "sending" ? "שולחים את הפרטים…" : "חזרו אליי לתיאום"}
                  </button>
                  {(leadStatus === "invalid" || leadStatus === "error") && (
                    <p className="order-form-error" role="alert">
                      {leadStatus === "invalid"
                        ? "בדקו שמילאתם שם, מספר טלפון תקין ועיר מגורים."
                        : "הפרטים לא נשלחו. אפשר לנסות שוב או לפנות בוואטסאפ."}
                    </p>
                  )}
                  <a href={`https://wa.me/${contactPhones[0].international}`} target="_blank" rel="noreferrer" className="wa">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />
                    </svg>
                    הזמנה בוואטסאפ<span className="visually-hidden"> (נפתח בכרטיסייה חדשה)</span>
                  </a>
                  <span className="visually-hidden" role="status">{leadStatus === "sending" ? "שולחים את הפרטים." : ""}</span>
                </form>
              )}
            </div>
          </div>
        </section>

        <section id="faq" aria-labelledby="faq-title">
          <div className="faq-block">
            <div className="faq-intro">
              <h2 id="faq-title">שאלות נפוצות</h2>
              <p>מה כלול במחיר, איך המנעול עובד ומה עושים כשהסוללה נגמרת.</p>
            </div>
            <div className="faq-list">
              {faq.map((item, index) => {
                const isOpen = open === index;
                return (
                  <div key={item.q} className="faq-item" data-open={isOpen}>
                    <h3>
                      <button
                        type="button"
                        className="faq-q"
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${index}`}
                        onClick={() => setOpen((current) => current === index ? -1 : index)}
                      >
                        {item.q}
                        <span className="faq-chevron" aria-hidden="true" />
                      </button>
                    </h3>
                    <div className="accordion-panel" id={`faq-answer-${index}`} inert={!isOpen}>
                      <div>
                        <p>{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" ref={footerRef} className="footer">
        <div className="footer-inner">
          <img src="/assets/logo-white.png" alt="Pentador" />
          <div className="footer-copy">
            <span>ביטחון חכם לבית שלך</span>
            <small><bdi dir="ltr">© 2026 Pentador</bdi></small>
          </div>
          <div className="footer-phones">
            <span>ליצירת קשר</span>
            {contactPhones.map(({ display, international }) => (
              <a key={international} href={`tel:+${international}`}><bdi dir="ltr">{display}</bdi></a>
            ))}
            <a href={`mailto:${contactEmail}`}><bdi dir="ltr">{contactEmail}</bdi></a>
          </div>
          <nav className="footer-site-links" aria-label="עמודי האתר">
            <a href="/accessibility">הצהרת נגישות</a>
          </nav>
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
            להזמנה <OrderChevron />
          </a>
        </aside>
      ) : null}
    </div>
  );
}
