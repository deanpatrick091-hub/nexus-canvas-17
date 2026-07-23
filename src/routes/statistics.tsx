import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Settings2, Plus } from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, Line, LineChart, Pie, PieChart, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, RadialBar, RadialBarChart,
} from "recharts";

export const Route = createFileRoute("/statistics")({
  head: () => ({
    meta: [
      { title: "Statistics — Nexus" },
      { name: "description", content: "Customizable analytics dashboard with real-time charts." },
      { property: "og:title", content: "Statistics — Nexus" },
      { property: "og:description", content: "Customizable analytics dashboard with real-time charts." },
    ],
  }),
  component: Statistics,
});

const sales = Array.from({ length: 12 }, (_, i) => ({ m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], value: 4000 + Math.round(Math.sin(i / 2) * 1200 + i * 200) }));
const traffic = Array.from({ length: 10 }, (_, i) => ({ d: `${i+1}`, visitors: 800 + Math.round(Math.random() * 800), conv: 40 + Math.round(Math.random() * 40) }));
const channels = [
  { name: "Direct", value: 42, color: "oklch(0.55 0.22 265)" },
  { name: "Organic", value: 28, color: "oklch(0.7 0.18 180)" },
  { name: "Social", value: 18, color: "oklch(0.72 0.19 45)" },
  { name: "Referral", value: 12, color: "oklch(0.65 0.22 330)" },
];
const goals = [{ name: "Revenue", value: 84, fill: "oklch(0.55 0.22 265)" }];

function Statistics() {
  return (
    <AppShell title="Statistics" actions={
      <>
        <Button size="sm" variant="outline" className="gap-1.5"><Download className="w-4 h-4" />Export</Button>
        <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" />Widget</Button>
      </>
    }>
      <div className="flex items-center gap-2 mb-4">
        {["Today","7D","30D","90D","YTD","Custom"].map((t, i) => (
          <Button key={t} size="sm" variant={i === 2 ? "secondary" : "ghost"} className="h-8 text-xs">{t}</Button>
        ))}
        <Badge variant="secondary" className="ml-auto"><span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5" />Live</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { label: "Revenue", value: "$284k", delta: "+18.2%" },
          { label: "Conversion", value: "4.82%", delta: "+0.6%" },
          { label: "Visitors", value: "48.2k", delta: "+12%" },
          { label: "NPS", value: "72", delta: "+4" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className="text-2xl font-semibold mt-1">{k.value}</div>
              <div className="text-[11px] text-success font-medium mt-1">{k.delta} vs prev.</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Sales performance</CardTitle>
            <Button size="icon" variant="ghost" className="h-7 w-7"><Settings2 className="w-3.5 h-3.5" /></Button>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={sales}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="m" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 10, fontSize: 12 }} />
                  <Bar dataKey="value" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Traffic channels</CardTitle></CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={channels} dataKey="value" innerRadius={45} outerRadius={80} paddingAngle={3}>
                    {channels.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 10, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {channels.map((c) => (
                <div key={c.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c.color }} />
                  <span className="flex-1">{c.name}</span>
                  <span className="font-medium">{c.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Visitors vs Conversions</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer>
                <LineChart data={traffic}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="d" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 10, fontSize: 12 }} />
                  <Line type="monotone" dataKey="visitors" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="conv" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Revenue growth</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer>
                <AreaChart data={sales}>
                  <defs>
                    <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="m" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 10, fontSize: 12 }} />
                  <Area type="monotone" dataKey="value" stroke="var(--color-chart-2)" fill="url(#rev2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Goal progress</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer>
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={goals} startAngle={90} endAngle={-270}>
                  <RadialBar background dataKey="value" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center -mt-32 mb-16">
              <div className="text-3xl font-semibold">84%</div>
              <div className="text-xs text-muted-foreground mt-1">to $100k MRR</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
