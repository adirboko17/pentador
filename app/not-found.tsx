import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "העמוד לא נמצא · Pentador",
};

export default function NotFound() {
  return (
    <main className="accessibility-statement" id="main-content" tabIndex={-1}>
      <header className="accessibility-statement-intro">
        <h1>העמוד לא נמצא</h1>
        <p>אפשר לחזור לאתר ולעבור משם למידע על המנעול או לתיאום התקנה.</p>
        <a href="/">חזרה לאתר Pentador</a>
      </header>
    </main>
  );
}
