import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Download, Upload, Plus } from "lucide-react";
import { useMemo, useState, useCallback, KeyboardEvent } from "react";

export const Route = createFileRoute("/spreadsheet")({
  head: () => ({
    meta: [
      { title: "Spreadsheet — Nexus" },
      { name: "description", content: "Excel-like spreadsheet with formulas, sorting and export." },
      { property: "og:title", content: "Spreadsheet — Nexus" },
      { property: "og:description", content: "Excel-like spreadsheet with formulas, sorting and export." },
    ],
  }),
  component: Spreadsheet,
});

const COLS = 12;
const ROWS = 30;
const colLabel = (i: number) => String.fromCharCode(65 + i);

function evalFormula(expr: string, data: Record<string, string>): string {
  try {
    const replaced = expr.replace(/([A-L])(\d+)/g, (_, c, r) => {
      const cell = data[`${c}${r}`] ?? "0";
      const num = parseFloat(cell);
      return String(isNaN(num) ? 0 : num);
    });
    // SUM(A1:A5) support
    const sum = replaced.replace(/SUM\(([A-L])(\d+):([A-L])(\d+)\)/gi, (_, c1, r1, c2, r2) => {
      let total = 0;
      for (let c = c1.charCodeAt(0); c <= c2.charCodeAt(0); c++) {
        for (let r = +r1; r <= +r2; r++) {
          const v = parseFloat(data[`${String.fromCharCode(c)}${r}`] ?? "0");
          if (!isNaN(v)) total += v;
        }
      }
      return String(total);
    });
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict";return (${sum})`)();
    return String(result);
  } catch {
    return "#ERR";
  }
}

function Spreadsheet() {
  const [data, setData] = useState<Record<string, string>>({
    A1: "Product", B1: "Q1", C1: "Q2", D1: "Q3", E1: "Q4", F1: "Total",
    A2: "Widgets", B2: "1200", C2: "1800", D2: "2100", E2: "2400", F2: "=B2+C2+D2+E2",
    A3: "Gadgets", B3: "900", C3: "1100", D3: "1500", E3: "1700", F3: "=B3+C3+D3+E3",
    A4: "Gizmos", B4: "600", C4: "800", D4: "950", E4: "1250", F4: "=B4+C4+D4+E4",
    A6: "Total", B6: "=SUM(B2:B4)", C6: "=SUM(C2:C4)", D6: "=SUM(D2:D4)", E6: "=SUM(E2:E4)", F6: "=SUM(F2:F4)",
  });
  const [active, setActive] = useState("A1");
  const [editing, setEditing] = useState<string | null>(null);

  const displayed = useMemo(() => {
    const out: Record<string, string> = {};
    Object.keys(data).forEach((k) => {
      const v = data[k];
      out[k] = v?.startsWith("=") ? evalFormula(v.slice(1), data) : v;
    });
    return out;
  }, [data]);

  const setCell = useCallback((key: string, value: string) => {
    setData((p) => ({ ...p, [key]: value }));
  }, []);

  const move = (row: number, col: number, dr: number, dc: number) => {
    const nr = Math.max(1, Math.min(ROWS, row + dr));
    const nc = Math.max(0, Math.min(COLS - 1, col + dc));
    setActive(`${colLabel(nc)}${nr}`);
    setEditing(null);
  };

  const onKey = (e: KeyboardEvent, row: number, col: number) => {
    if (e.key === "Enter") { e.preventDefault(); setEditing(null); move(row, col, 1, 0); }
    else if (e.key === "Tab") { e.preventDefault(); setEditing(null); move(row, col, 0, e.shiftKey ? -1 : 1); }
    else if (e.key === "Escape") { setEditing(null); }
    else if (!editing) {
      if (e.key === "ArrowUp") { e.preventDefault(); move(row, col, -1, 0); }
      else if (e.key === "ArrowDown") { e.preventDefault(); move(row, col, 1, 0); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); move(row, col, 0, -1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); move(row, col, 0, 1); }
    }
  };

  const exportCSV = () => {
    const rows: string[] = [];
    for (let r = 1; r <= ROWS; r++) {
      const row: string[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push(displayed[`${colLabel(c)}${r}`] ?? "");
      }
      rows.push(row.join(","));
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sheet.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell title="Spreadsheet">
      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 border-b px-3 py-2">
          {[Bold, Italic, Underline].map((Icon, i) => (
            <Button key={i} size="icon" variant="ghost" className="h-8 w-8"><Icon className="w-3.5 h-3.5" /></Button>
          ))}
          <div className="w-px h-5 bg-border mx-1" />
          {[AlignLeft, AlignCenter, AlignRight].map((Icon, i) => (
            <Button key={i} size="icon" variant="ghost" className="h-8 w-8"><Icon className="w-3.5 h-3.5" /></Button>
          ))}
          <div className="w-px h-5 bg-border mx-1" />
          <Button size="sm" variant="ghost" className="h-8 gap-1.5"><Upload className="w-3.5 h-3.5" /> Import</Button>
          <Button size="sm" variant="ghost" className="h-8 gap-1.5" onClick={exportCSV}><Download className="w-3.5 h-3.5" /> Export</Button>
        </div>

        {/* Formula bar */}
        <div className="flex items-center gap-2 border-b px-3 py-2 bg-muted/30">
          <div className="w-16 text-xs font-mono font-semibold text-muted-foreground">{active}</div>
          <div className="w-px h-5 bg-border" />
          <div className="text-xs font-mono text-muted-foreground">fx</div>
          <Input
            value={data[active] ?? ""}
            onChange={(e) => setCell(active, e.target.value)}
            className="h-7 font-mono text-xs border-0 shadow-none focus-visible:ring-0 bg-transparent"
          />
        </div>

        {/* Grid */}
        <CardContent className="p-0 overflow-auto max-h-[62vh]">
          <table className="border-collapse text-sm w-max">
            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
              <tr>
                <th className="w-10 h-8 border border-border text-xs font-medium text-muted-foreground"></th>
                {Array.from({ length: COLS }).map((_, c) => (
                  <th key={c} className="min-w-[110px] h-8 border border-border text-xs font-medium text-muted-foreground">
                    {colLabel(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: ROWS }).map((_, r) => {
                const row = r + 1;
                return (
                  <tr key={row}>
                    <td className="w-10 h-8 border border-border text-xs text-center font-medium text-muted-foreground bg-muted/40 sticky left-0">
                      {row}
                    </td>
                    {Array.from({ length: COLS }).map((_, c) => {
                      const key = `${colLabel(c)}${row}`;
                      const isActive = active === key;
                      const isEditing = editing === key;
                      return (
                        <td
                          key={key}
                          className={`min-w-[110px] h-8 border border-border p-0 ${isActive ? "outline outline-2 outline-primary -outline-offset-2 relative z-[1]" : ""}`}
                          onClick={() => { setActive(key); setEditing(null); }}
                          onDoubleClick={() => setEditing(key)}
                        >
                          {isEditing ? (
                            <input
                              autoFocus
                              value={data[key] ?? ""}
                              onChange={(e) => setCell(key, e.target.value)}
                              onBlur={() => setEditing(null)}
                              onKeyDown={(e) => onKey(e, row, c)}
                              className="w-full h-full px-2 outline-none bg-background text-sm"
                            />
                          ) : (
                            <div
                              className="px-2 h-full flex items-center text-sm truncate"
                              onKeyDown={(e) => onKey(e as any, row, c)}
                              tabIndex={0}
                            >
                              {displayed[key] ?? ""}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>

        {/* Sheet tabs */}
        <div className="flex items-center gap-1 border-t px-3 py-1.5 bg-muted/30">
          {["Sheet1", "Q4 Report", "Budget"].map((s, i) => (
            <button key={s} className={`text-xs px-3 py-1 rounded-md ${i === 0 ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:bg-muted"}`}>
              {s}
            </button>
          ))}
          <Button size="icon" variant="ghost" className="h-6 w-6"><Plus className="w-3 h-3" /></Button>
        </div>
      </Card>
    </AppShell>
  );
}
