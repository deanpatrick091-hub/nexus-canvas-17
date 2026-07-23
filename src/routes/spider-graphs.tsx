import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Copy, Download, Lock, Share2, Palette } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/spider-graphs")({
  head: () => ({
    meta: [
      { title: "Spider Graphs — Nexus" },
      { name: "description", content: "Build, compare and export radar charts for performance and analysis." },
      { property: "og:title", content: "Spider Graphs — Nexus" },
      { property: "og:description", content: "Build, compare and export radar charts for performance and analysis." },
    ],
  }),
  component: SpiderGraphs,
});

type Axis = { id: string; name: string; color: string };
type Series = { id: string; name: string; color: string; values: Record<string, number> };
type Graph = { id: string; name: string; axes: Axis[]; series: Series[]; locked?: boolean };

const PALETTE = [
  "oklch(0.55 0.22 265)",
  "oklch(0.7 0.18 180)",
  "oklch(0.72 0.19 45)",
  "oklch(0.65 0.22 330)",
  "oklch(0.72 0.18 145)",
  "oklch(0.68 0.2 20)",
];

const templates: Record<string, Omit<Graph, "id">> = {
  "Business Performance": {
    name: "Business Performance",
    axes: [
      { id: "a1", name: "Revenue", color: PALETTE[0] },
      { id: "a2", name: "Growth", color: PALETTE[1] },
      { id: "a3", name: "Retention", color: PALETTE[2] },
      { id: "a4", name: "Team", color: PALETTE[3] },
      { id: "a5", name: "Product", color: PALETTE[4] },
      { id: "a6", name: "Brand", color: PALETTE[5] },
    ],
    series: [
      { id: "s1", name: "Q3", color: PALETTE[0], values: { a1: 70, a2: 60, a3: 80, a4: 65, a5: 75, a6: 55 } },
      { id: "s2", name: "Q4", color: PALETTE[2], values: { a1: 85, a2: 78, a3: 82, a4: 74, a5: 88, a6: 70 } },
    ],
  },
  "Employee Skills": {
    name: "Employee Skills",
    axes: [
      { id: "a1", name: "Communication", color: PALETTE[0] },
      { id: "a2", name: "Technical", color: PALETTE[1] },
      { id: "a3", name: "Leadership", color: PALETTE[2] },
      { id: "a4", name: "Creativity", color: PALETTE[3] },
      { id: "a5", name: "Delivery", color: PALETTE[4] },
    ],
    series: [{ id: "s1", name: "Rating", color: PALETTE[0], values: { a1: 80, a2: 90, a3: 60, a4: 75, a5: 85 } }],
  },
  Fitness: {
    name: "Fitness",
    axes: [
      { id: "a1", name: "Strength", color: PALETTE[0] },
      { id: "a2", name: "Endurance", color: PALETTE[1] },
      { id: "a3", name: "Mobility", color: PALETTE[2] },
      { id: "a4", name: "Recovery", color: PALETTE[3] },
      { id: "a5", name: "Nutrition", color: PALETTE[4] },
    ],
    series: [{ id: "s1", name: "Current", color: PALETTE[0], values: { a1: 65, a2: 70, a3: 55, a4: 60, a5: 80 } }],
  },
  "Customer Satisfaction": {
    name: "Customer Satisfaction",
    axes: [
      { id: "a1", name: "Support", color: PALETTE[0] },
      { id: "a2", name: "Quality", color: PALETTE[1] },
      { id: "a3", name: "Price", color: PALETTE[2] },
      { id: "a4", name: "Speed", color: PALETTE[3] },
      { id: "a5", name: "UX", color: PALETTE[4] },
    ],
    series: [{ id: "s1", name: "NPS", color: PALETTE[2], values: { a1: 88, a2: 92, a3: 70, a4: 84, a5: 90 } }],
  },
};

const uid = () => Math.random().toString(36).slice(2, 9);

function makeGraph(template?: keyof typeof templates): Graph {
  const base = template ? templates[template] : templates["Business Performance"];
  return { id: uid(), name: base.name, axes: base.axes.map((a) => ({ ...a })), series: base.series.map((s) => ({ ...s, values: { ...s.values } })) };
}

function SpiderGraphs() {
  const [graphs, setGraphs] = useState<Graph[]>([makeGraph("Business Performance")]);
  const [activeId, setActiveId] = useState(graphs[0].id);
  const active = graphs.find((g) => g.id === activeId)!;

  const data = useMemo(
    () =>
      active.axes.map((axis) => {
        const row: Record<string, string | number> = { axis: axis.name };
        active.series.forEach((s) => (row[s.name] = s.values[axis.id] ?? 0));
        return row;
      }),
    [active],
  );

  const update = (fn: (g: Graph) => Graph) =>
    setGraphs((prev) => prev.map((g) => (g.id === activeId ? fn(g) : g)));

  const addAxis = () => {
    const id = uid();
    update((g) => ({
      ...g,
      axes: [...g.axes, { id, name: `Axis ${g.axes.length + 1}`, color: PALETTE[g.axes.length % PALETTE.length] }],
      series: g.series.map((s) => ({ ...s, values: { ...s.values, [id]: 50 } })),
    }));
  };

  const removeAxis = (id: string) =>
    update((g) => ({
      ...g,
      axes: g.axes.filter((a) => a.id !== id),
      series: g.series.map((s) => {
        const { [id]: _drop, ...rest } = s.values;
        return { ...s, values: rest };
      }),
    }));

  const addSeries = () =>
    update((g) => {
      const values: Record<string, number> = {};
      g.axes.forEach((a) => (values[a.id] = 50));
      return {
        ...g,
        series: [...g.series, { id: uid(), name: `Series ${g.series.length + 1}`, color: PALETTE[g.series.length % PALETTE.length], values }],
      };
    });

  const exportCSV = () => {
    const header = ["Axis", ...active.series.map((s) => s.name)].join(",");
    const rows = active.axes.map((a) => [a.name, ...active.series.map((s) => s.values[a.id] ?? 0)].join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${active.name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const duplicate = () => {
    const copy: Graph = { ...active, id: uid(), name: `${active.name} (copy)` };
    setGraphs((p) => [...p, copy]);
    setActiveId(copy.id);
  };

  return (
    <AppShell title="Spider Graphs">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-4">
        {/* Graphs list */}
        <Card className="h-fit">
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm">Your graphs</CardTitle>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => {
              const g = makeGraph();
              setGraphs((p) => [...p, g]);
              setActiveId(g.id);
            }}>
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {graphs.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveId(g.id)}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-sm transition-colors ${
                  g.id === activeId ? "bg-accent text-accent-foreground font-medium" : "hover:bg-muted"
                }`}
              >
                {g.name}
              </button>
            ))}
            <Separator className="my-2" />
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2 py-1">Templates</div>
            {Object.keys(templates).map((t) => (
              <button
                key={t}
                onClick={() => {
                  const g = makeGraph(t as keyof typeof templates);
                  setGraphs((p) => [...p, g]);
                  setActiveId(g.id);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {t}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <Input
              value={active.name}
              onChange={(e) => update((g) => ({ ...g, name: e.target.value }))}
              className="text-lg font-semibold border-0 shadow-none focus-visible:ring-0 px-0 h-9"
            />
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={duplicate}><Copy className="w-4 h-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => update((g) => ({ ...g, locked: !g.locked }))}><Lock className="w-4 h-4" /></Button>
              <Button size="sm" variant="ghost"><Share2 className="w-4 h-4" /></Button>
              <Button size="sm" variant="outline" onClick={exportCSV} className="gap-1.5"><Download className="w-4 h-4" /> Export</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[420px] rounded-xl bg-gradient-to-br from-muted/40 to-transparent p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12, fill: "var(--color-foreground)" }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                  {active.series.map((s) => (
                    <Radar key={s.id} name={s.name} dataKey={s.name} stroke={s.color} fill={s.color} fillOpacity={0.25} strokeWidth={2} />
                  ))}
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-2 mt-3">
              <Badge variant="secondary">{active.axes.length} axes</Badge>
              <Badge variant="secondary">{active.series.length} series</Badge>
              {active.locked && <Badge className="bg-warning text-warning-foreground">Locked</Badge>}
            </div>
          </CardContent>
        </Card>

        {/* Editor */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[440px] pr-3">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Axes</Label>
                  <Button size="sm" variant="ghost" className="h-7 gap-1" onClick={addAxis}><Plus className="w-3 h-3" /> Add</Button>
                </div>
                <div className="space-y-1.5">
                  {active.axes.map((a) => (
                    <div key={a.id} className="flex items-center gap-1.5">
                      <label className="relative">
                        <input
                          type="color"
                          value={oklchToHex(a.color)}
                          onChange={(e) => update((g) => ({ ...g, axes: g.axes.map((x) => (x.id === a.id ? { ...x, color: e.target.value } : x)) }))}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="w-6 h-6 rounded-md border" style={{ background: a.color }} />
                      </label>
                      <Input
                        value={a.name}
                        onChange={(e) => update((g) => ({ ...g, axes: g.axes.map((x) => (x.id === a.id ? { ...x, name: e.target.value } : x)) }))}
                        className="h-8 text-sm"
                      />
                      <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => removeAxis(a.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Series</Label>
                <Button size="sm" variant="ghost" className="h-7 gap-1" onClick={addSeries}><Plus className="w-3 h-3" /> Add</Button>
              </div>
              <div className="space-y-4">
                {active.series.map((s) => (
                  <div key={s.id} className="p-3 rounded-lg border bg-muted/30 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                      <Input
                        value={s.name}
                        onChange={(e) => update((g) => ({ ...g, series: g.series.map((x) => (x.id === s.id ? { ...x, name: e.target.value } : x)) }))}
                        className="h-7 text-sm font-medium"
                      />
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => update((g) => ({ ...g, series: g.series.filter((x) => x.id !== s.id) }))}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {active.axes.map((a) => (
                        <div key={a.id} className="flex items-center gap-1.5">
                          <span className="text-[10px] text-muted-foreground truncate flex-1">{a.name}</span>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={s.values[a.id] ?? 0}
                            onChange={(e) =>
                              update((g) => ({
                                ...g,
                                series: g.series.map((x) =>
                                  x.id === s.id ? { ...x, values: { ...x.values, [a.id]: Number(e.target.value) } } : x,
                                ),
                              }))
                            }
                            className="h-7 w-16 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function oklchToHex(_: string) {
  // input[type=color] needs hex; return a neutral fallback since we don't parse oklch
  return "#7c5cff";
}
