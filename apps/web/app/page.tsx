import { auth } from "@clerk/nextjs/server";

import { getWebHealthStatus } from "../src/health";
import { getWebAccountShellState, type WebAccountShellState } from "../src/account-shell";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { userId } = await auth();
  const account = getWebAccountShellState(
    userId
      ? {
          displayName: null
        }
      : null
  );
  const health = getWebHealthStatus();

  return (
    <main className="app-shell">
      <AccountStatusPanel account={account} health={health} />
    </main>
  );
}

type AccountStatusPanelProps = {
  account: WebAccountShellState;
  health: ReturnType<typeof getWebHealthStatus>;
};

function AccountStatusPanel({ account, health }: AccountStatusPanelProps) {
  return (
    <section className="status-panel" aria-label="TasteApp web health">
      <p className="eyebrow">TasteApp Web</p>
      <h1>{account.heading}</h1>
      <dl>
        <div>
          <dt>Account</dt>
          <dd>{account.statusLabel}</dd>
        </div>
        <div>
          <dt>Service</dt>
          <dd>{health.service}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{health.status}</dd>
        </div>
      </dl>
      <p>{account.actionLabel}</p>
    </section>
  );
}
