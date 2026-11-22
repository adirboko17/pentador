import type { Metadata } from "next";
import { contactEmail, contactPhones } from "@/lib/content";

export const metadata: Metadata = {
  title: "הצהרת נגישות · Pentador",
  description: "התאמות הנגישות באתר Pentador ודרכי קשר לדיווח על קושי או לבקשת התאמה.",
};

export default function AccessibilityPage() {
  return (
    <main className="accessibility-statement" id="main-content" tabIndex={-1}>
      <header className="accessibility-statement-intro">
        <a className="accessibility-back" href="/">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12h15m-6-6 6 6-6 6" />
          </svg>
          חזרה לאתר
        </a>
        <h1>הצהרת נגישות</h1>
        <p>התאמות הנגישות באתר Pentador (<bdi dir="ltr">pentador.co.il</bdi>) ודרכי פנייה לקבלת עזרה.</p>
        <a href="#accessibility-contact">מעבר לפרטי הקשר לנגישות</a>
      </header>

      <div className="accessibility-statement-grid">
        <div>
          <section aria-labelledby="accessibility-adjustments">
            <h2 id="accessibility-adjustments">התאמות באתר</h2>
            <ul>
              <li>קישור לדילוג לתוכן הראשי, כותרות לפי נושא ותיאורים לתמונות המוצר.</li>
              <li>אפשר להפעיל את השאלות הנפוצות, פרטי המנעול ותפריט הנגישות במקלדת.</li>
              <li>בתפריט הנגישות אפשר להגדיל טקסט, להפעיל ניגודיות גבוהה, לצמצם תנועה ולהדגיש קישורים. האתר מתחשב גם בהעדפת צמצום התנועה של המכשיר.</li>
            </ul>
            <p>יעד ההנגשה הוא ת״י 5568 חלק 1 ברמה AA. האתר נבדק בדפדפנים בתצוגות דסקטופ ומובייל ובקורא המסך NVDA ב־Windows. אימות עם קוראי מסך במכשירי מובייל עדיין נדרש.</p>
          </section>

          <section aria-labelledby="accessibility-service">
            <h2 id="accessibility-service">קבלת שירות והתקנה</h2>
            <p>ההתקנה מתבצעת בבית הלקוח והעסק פועל ללא קבלת קהל. אפשר לתאם התקנה בוואטסאפ או בטלפון העסק <a href={`tel:+${contactPhones[0].international}`}><bdi dir="ltr">{contactPhones[0].display}</bdi></a>.</p>
          </section>
        </div>

        <section className="accessibility-contact-card" aria-labelledby="accessibility-contact">
          <h2 id="accessibility-contact" tabIndex={-1}>פניות בנושא נגישות</h2>
          <p>רועי הוא איש הקשר לדיווח על קושי באתר, לבקשת התאמה ולתיאום שירות נגיש.</p>
          <ul>
            <li><a href="tel:+972547288164">התקשרו לרועי <bdi dir="ltr">054-728-8164</bdi></a></li>
            <li><a href={`mailto:${contactEmail}`}><bdi dir="ltr">{contactEmail}</bdi></a></li>
            <li><a href={`https://wa.me/${contactPhones[0].international}`}>כתבו ל‑Pentador בוואטסאפ</a></li>
          </ul>
        </section>
      </div>
      <p className="accessibility-updated">עודכן ב־<time dateTime="2026-11-22">22 בנובמבר 2026</time></p>
    </main>
  );
}
