import { getWebHealthStatus } from "../src/health";

export default function HomePage() {
  const health = getWebHealthStatus();

  return (
    <main className="app-shell">
      <section className="status-panel" aria-label="TasteApp web health">
        <p className="eyebrow">TasteApp Web</p>
        <h1>Dish-first discovery is booting up.</h1>
        <dl>
          <div>
            <dt>Service</dt>
            <dd>{health.service}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{health.status}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
