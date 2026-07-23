import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  CheckCircle2,
  DollarSign,
  FileWarning,
  Mail,
  Workflow,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Radar as RadarIcon,
  Receipt,
  Sparkles,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Nexus Workspace" },
      { name: "description", content: "Unified overview of projects, revenue, invoices, email and automations." },
      { property: "og:title", content: "Dashboard — Nexus Workspace" },
      { property: "og:description", content: "Unified overview of projects, revenue, invoices, email and automations." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Active Projects", value: "24", delta: "+3", up: true, icon: Briefcase, hint: "vs last week" },
  { label: "Open Tasks", value: "128", delta: "+12", up: true, icon: CheckCircle2, hint: "42 due this week" },
  { label: "Revenue (MTD)", value: "$84,320", delta: "+18.2%", up: true, icon: DollarSign, hint: "on track" },
  { label: "Outstanding", value: "$12,480", delta: "-6.1%", up: false, icon: FileWarning, hint: "3 overdue" },
  { label: "Emails Today", value: "47", delta: "+9", up: true, icon: Mail, hint: "4 unread" },
  { label: "Automations", value: "18", delta: "running", up: true, icon: Workflow, hint: "0 failed" },
];

const revenueData = Array.from({ length: 14 }, (_, i) => ({
  day: `Day ${i + 1}`,
  value: 4200 + Math.round(Math.sin(i / 2) * 1400 + i * 180 + Math.random() * 400),
}));

const activity = [
  { who: "Sarah", what: "closed invoice", target: "INV-2049", when: "2m ago", tone: "success" },
  { who: "You", what: "edited graph", target: "Q4 Performance", when: "18m ago", tone: "default" },
  { who: "Marcus", what: "shared document", target: "Roadmap.pdf", when: "1h ago", tone: "default" },
  { who: "Automation", what: "ran workflow", target: "Stripe → Sheets", when: "2h ago", tone: "primary" },
  { who: "Nina", what: "commented on", target: "Task #482", when: "3h ago", tone: "default" },
];

function Dashboard() {
  return (
    <AppShell
      title="Good morning, Alex"
      actions={
        <Button size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" /> New
        </Button>
      }
    >
      <p className="text-sm text-muted-foreground -mt-2 mb-6">
        Here's what's happening across your workspace today.
      </p>

      {/* Stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="relative overflow-hidden group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-accent grid place-items-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span
                    className={`text-[11px] font-medium inline-flex items-center gap-0.5 ${
                      s.up ? "text-success" : "text-destructive"
                    }`}
                  >
                    {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {s.delta}
                  </span>
                </div>
                <div className="text-xl font-semibold tracking-tight">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                <div className="text-[10px] text-muted-foreground/70 mt-1">{s.hint}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Revenue trend</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Last 14 days · updated live</p>
            </div>
            <div className="flex gap-1">
              {["7D", "14D", "30D", "90D"].map((t, i) => (
                <Button key={t} size="sm" variant={i === 1 ? "secondary" : "ghost"} className="h-7 px-2 text-xs">
                  {t}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {[
              { icon: RadarIcon, label: "New graph" },
              { icon: Receipt, label: "New invoice" },
              { icon: Workflow, label: "New workflow" },
              { icon: Mail, label: "Compose" },
            ].map((a) => (
              <Button key={a.label} variant="outline" className="h-20 flex-col gap-2 hover:border-primary/40 hover:bg-accent">
                <a.icon className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">{a.label}</span>
              </Button>
            ))}
            <div className="col-span-2 mt-2 rounded-xl p-4" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles className="w-5 h-5 text-white mb-2" />
              <div className="text-white text-sm font-semibold">Automate anything</div>
              <div className="text-white/80 text-xs mt-0.5">Build a workflow in minutes with the visual API builder.</div>
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  a.tone === "success" ? "bg-success" : a.tone === "primary" ? "bg-primary" : "bg-muted-foreground/40"
                }`} />
                <span className="font-medium">{a.who}</span>
                <span className="text-muted-foreground">{a.what}</span>
                <Badge variant="secondary" className="font-normal">{a.target}</Badge>
                <span className="ml-auto text-xs text-muted-foreground">{a.when}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Project progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Project progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Website redesign", pct: 72, tone: "bg-primary" },
              { name: "Q4 campaign", pct: 45, tone: "bg-chart-3" },
              { name: "Mobile app v2", pct: 88, tone: "bg-success" },
              { name: "Data migration", pct: 23, tone: "bg-warning" },
            ].map((p) => (
              <div key={p.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted-foreground">{p.pct}%</span>
                </div>
                <Progress value={p.pct} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
