"use client";

import { useRef } from "react";
import { contactPhones } from "@/lib/content";

const inquiries = [
  { label: "הזמנה ותיאום התקנה", message: "היי Pentador, אני מתעניין במנעול ואשמח לפרטים על הזמנה ותיאום התקנה." },
  { label: "צבעים וזמינות", message: "היי Pentador, באילו צבעים המנעול זמין כרגע?" },
  { label: "רכישת סוללה נוספת", message: "היי Pentador, אשמח לפרטים על רכישת סוללה נוספת למנעול." },
  { label: "שימוש בשבת", message: "היי Pentador, אשמח לקבל הנחיות לשימוש במנעול בשבת." },
] as const;

export function WhatsAppInquiries() {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button className="whatsapp-launch" type="button" aria-label="התעניינות בוואטסאפ"
        aria-haspopup="dialog" aria-controls="whatsapp-dialog" onClick={() => dialog.current?.showModal()}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.7a8.9 8.9 0 0 1-13 7.9L3 21l1.4-4.8A8.9 8.9 0 1 1 21 11.7Z" />
          <path d="M8 8.5c.1 3.3 3.3 6.5 6.5 6.6l1.3-1.4-2.6-1.6-.9 1c-1.2-.5-2-1.3-2.5-2.5l.9-.9-1.4-2.5L8 8.5Z" />
        </svg>
        <span>וואטסאפ</span>
      </button>
      <dialog className="accessibility-dialog whatsapp-dialog" id="whatsapp-dialog" ref={dialog} aria-labelledby="whatsapp-title">
        <div className="accessibility-dialog-head">
          <h2 id="whatsapp-title">התעניינות בוואטסאפ</h2>
          <button className="accessibility-close" type="button" aria-label="סגירת חלון וואטסאפ" onClick={() => dialog.current?.close()}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <ul className="whatsapp-options">
          {inquiries.map(({ label, message }) => (
            <li key={label}>
              <a href={`https://wa.me/${contactPhones[0].international}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">
                {label}<span className="visually-hidden"> (נפתח בכרטיסייה חדשה)</span>
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </dialog>
    </>
  );
}
