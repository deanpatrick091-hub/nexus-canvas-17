import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap, Database, Webhook, Mail, MessageSquare, Clock, GitBranch, Filter,
  Play, Save, ZoomIn, ZoomOut, Bot, CreditCard, Cloud,
} from "lucide-react";
import { useRef, useState } from "react";

export const Route = createFileRoute("/api-builder")({
  head: () => ({
    meta: [
      { title: "API Builder — Nexus" },
      { name: "description", content: "Visual workflow builder for APIs, webhooks and automations." },
      { property: "og:title", content: "API Builder — Nexus" },
      { property: "og:description", content: "Visual workflow builder for APIs, webhooks and automations." },
    ],
  }),
  component: ApiBuilder,
});

type Node = { id: string; type: string; label: string; icon: any; x: number; y: number; color: string };

const blocks = [
  { type: "webhook", label: "Webhook", icon: Webhook, color: "oklch(0.55 0.22 265)" },
  { type: "api", label: "REST API", icon: Zap, color: "oklch(0.7 0.18 180)" },
  { type: "db", label: "Database", icon: Database, color: "oklch(0.72 0.19 45)" },
  { type: "openai", label: "OpenAI", icon: Bot, color: "oklch(0.65 0.22 330)" },
  { type: "stripe", label: "Stripe", icon: CreditCard, color: "oklch(0.68 0.2 20)" },
  { type: "gmail", label: "Gmail", icon: Mail, color: "oklch(0.72 0.18 145)" },
  { type: "slack", label: "Slack", icon: MessageSquare, color: "oklch(0.55 0.22 300)" },
  { type: "timer", label: "Timer", icon: Clock, color: "oklch(0.6 0.15 240)" },
  { type: "if", label: "If / Else", icon: GitBranch, color: "oklch(0.65 0.18 60)" },
  { type: "filter", label: "Filter", icon: Filter, color: "oklch(0.6 0.12 200)" },
  { type: "drive", label: "Drive", icon: Cloud, color: "oklch(0.68 0.15 145)" },
];

function ApiBuilder() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "1", type: "webhook", label: "Webhook trigger", icon: Webhook, x: 80, y: 120, color: "oklch(0.55 0.22 265)" },
    { id: "2", type: "openai", label: "OpenAI enrich", icon: Bot, x: 340, y: 120, color: "oklch(0.65 0.22 330)" },
    { id: "3", type: "gmail", label: "Send email", icon: Mail, x: 600, y: 120, color: "oklch(0.72 0.18 145)" },
  ]);
  const [drag, setDrag] = useState<{ id: string; offX: number; offY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const connections = [
    { from: "1", to: "2" },
    { from: "2", to: "3" },
  ];

  const addNode = (b: typeof blocks[number]) => {
    setNodes((p) => [
      ...p,
      { id: crypto.randomUUID(), type: b.type, label: b.label, icon: b.icon, x: 200 + Math.random() * 400, y: 200 + Math.random() * 200, color: b.color },
    ]);
  };

  const onMouseDown = (e: React.MouseEvent, n: Node) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    setDrag({ id: n.id, offX: e.clientX - rect.left - n.x, offY: e.clientY - rect.top - n.y });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    setNodes((p) => p.map((n) => (n.id === drag.id ? { ...n, x: e.clientX - rect.left - drag.offX, y: e.clientY - rect.top - drag.offY } : n)));
  };

  return (
    <AppShell title="API Builder">
      <div className="grid grid-cols-[220px_1fr] gap-4 h-[calc(100vh-14rem)]">
        {/* Palette */}
        <Card className="overflow-y-auto">
          <CardContent className="p-3 space-y-1">
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2 py-1.5">Blocks</div>
            {blocks.map((b) => (
              <button
                key={b.type}
                onClick={() => addNode(b)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm hover:bg-accent transition-colors group"
              >
                <div className="w-7 h-7 rounded-md grid place-items-center" style={{ background: `color-mix(in oklab, ${b.color} 15%, transparent)` }}>
                  <b.icon className="w-3.5 h-3.5" style={{ color: b.color }} />
                </div>
                <span>{b.label}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
            <div className="flex gap-1">
              <Button size="sm" variant="secondary" className="gap-1.5 h-8"><Play className="w-3.5 h-3.5" /> Run</Button>
              <Button size="sm" variant="outline" className="gap-1.5 h-8"><Save className="w-3.5 h-3.5" /> Save</Button>
            </div>
            <div className="flex gap-1">
              <Badge variant="secondary" className="font-mono text-[10px]">100%</Badge>
              <Button size="icon" variant="ghost" className="h-8 w-8"><ZoomOut className="w-3.5 h-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8"><ZoomIn className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
          <div
            ref={canvasRef}
            className="w-full h-full relative select-none"
            style={{
              backgroundImage: "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
            onMouseMove={onMouseMove}
            onMouseUp={() => setDrag(null)}
            onMouseLeave={() => setDrag(null)}
          >
            {/* connectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((c, i) => {
                const from = nodes.find((n) => n.id === c.from);
                const to = nodes.find((n) => n.id === c.to);
                if (!from || !to) return null;
                const x1 = from.x + 180, y1 = from.y + 30, x2 = to.x, y2 = to.y + 30;
                const mx = (x1 + x2) / 2;
                return (
                  <path key={i} d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`} stroke="var(--color-primary)" strokeWidth="2" fill="none" strokeDasharray="4 3" />
                );
              })}
            </svg>
            {nodes.map((n) => (
              <div
                key={n.id}
                onMouseDown={(e) => onMouseDown(e, n)}
                className="absolute w-[180px] rounded-xl bg-card border shadow-md cursor-move hover:shadow-lg transition-shadow"
                style={{ left: n.x, top: n.y, borderColor: `color-mix(in oklab, ${n.color} 30%, var(--color-border))` }}
              >
                <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ background: `color-mix(in oklab, ${n.color} 10%, transparent)` }}>
                  <n.icon className="w-4 h-4" style={{ color: n.color }} />
                  <span className="text-xs font-medium">{n.label}</span>
                </div>
                <div className="px-3 py-2 text-[10px] text-muted-foreground">Configure inputs →</div>
                <div className="absolute -left-1.5 top-6 w-3 h-3 rounded-full border-2 bg-background" style={{ borderColor: n.color }} />
                <div className="absolute -right-1.5 top-6 w-3 h-3 rounded-full border-2 bg-background" style={{ borderColor: n.color }} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
