import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Panel } from "@/components/ui/Panel";
import { Toast } from "@/components/ui/Toast";
import { ActivityLog } from "@/components/layout/ActivityLog";
import { DisplayCard } from "@/components/layout/DisplayCard";
import { ItemRail } from "@/components/layout/ItemRail";
import { LayoutBoard } from "@/components/layout/LayoutBoard";
import { MetricBadge } from "@/components/layout/MetricBadge";
import { ParticipantArea } from "@/components/layout/ParticipantArea";
import { PromptCard } from "@/components/layout/PromptCard";
import { StackSlot } from "@/components/layout/StackSlot";
import { tokens } from "@/design-system/tokens";

const tokenRows = [
  ["Background", tokens.colour.background],
  ["Surface", tokens.colour.surface],
  ["Accent", tokens.colour.accent],
  ["Warning", tokens.colour.warning],
  ["Error", tokens.colour.error]
];

const logEntries = [
  { id: "1", text: "A selectable item was chosen.", tone: "success" as const },
  { id: "2", text: "Move preview is waiting for confirmation.", tone: "warning" as const },
  { id: "3", text: "Illegal move feedback uses a clear error state.", tone: "error" as const }
];

export default function DesignSystemPage() {
  return (
    <div className="page-stack design-system-page">
      <header className="page-heading with-actions">
        <div>
          <p className="eyebrow">Design System</p>
          <h1>Reusable UI foundation</h1>
          <p>
            Live examples for tokens, controls, feedback states and table-style layouts. This route is a development
            reference and does not change existing app behaviour.
          </p>
        </div>
        <Badge tone="warning">Provisional</Badge>
      </header>

      <section className="ds-section">
        <h2>Tokens</h2>
        <div className="ds-token-grid">
          {tokenRows.map(([name, value]) => (
            <div className="ds-token-card" key={name}>
              <span className="ds-swatch" style={{ background: value }} />
              <strong>{name}</strong>
              <code>{value}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="ds-section">
        <h2>Base UI</h2>
        <div className="ds-example-grid">
          <Panel title="Buttons" eyebrow="Actions">
            <div className="button-row">
              <Button variant="primary">Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button disabled>Disabled</Button>
            </div>
          </Panel>

          <Panel title="Badges and feedback" eyebrow="Status">
            <div className="button-row">
              <Badge>Neutral</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="warning">Warning</Badge>
              <Badge tone="error">Error</Badge>
            </div>
            <Toast tone="success">Saved successfully.</Toast>
            <Toast tone="error">That move is not available.</Toast>
          </Panel>

          <EmptyState
            title="No selection"
            message="Use empty states for blank, waiting or unavailable areas without hiding the next useful action."
            action={<Button variant="primary">Choose item</Button>}
          />

          <Modal title="Modal pattern">
            <p>Use modals for focused confirmation or editing. Keep copy short and actions clear.</p>
            <div className="button-row">
              <Button variant="primary">Confirm</Button>
              <Button variant="ghost">Cancel</Button>
            </div>
          </Modal>
        </div>
      </section>

      <section className="ds-section">
        <h2>Table layout pattern</h2>
        <div className="ds-table-surface">
          <div className="ds-table-top">
            <StackSlot label="Stack" count={42} />
            <MetricBadge label="Stage" value="3" />
            <StackSlot label="Archive" count={8} />
          </div>

          <LayoutBoard>
            <DisplayCard title="Selected item" subtitle="Selected" body="Selected items use a warm outline." selected />
            <DisplayCard title="Allowed action" subtitle="Allowed" body="Allowed action feedback is clear and positive." legalMove />
            <DisplayCard title="Blocked action" subtitle="Blocked" body="Blocked actions show explicit feedback." illegalMove />
            <PromptCard title="Prompt card" prompt="Create a readable, practical layout before adding ornament." />
          </LayoutBoard>

          <ParticipantArea name="Workspace" score={12} active>
            <ItemRail>
              <DisplayCard title="Rail item" subtitle="Ready" body="Compact, readable and keyboard reachable." />
              <DisplayCard title="Disabled" subtitle="Unavailable" body="Disabled items reduce emphasis." disabled />
            </ItemRail>
          </ParticipantArea>

          <ActivityLog entries={logEntries} />
        </div>
      </section>
    </div>
  );
}
