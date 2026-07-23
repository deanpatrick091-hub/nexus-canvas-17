import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Folder, FileText, Image, FileSpreadsheet, FileVideo, Music, Archive, Star, Clock, Users, Upload, Search, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — Nexus" },
      { name: "description", content: "Manage folders, files and shared documents." },
      { property: "og:title", content: "Documents — Nexus" },
      { property: "og:description", content: "Manage folders, files and shared documents." },
    ],
  }),
  component: Documents,
});

const folders = [
  { name: "Contracts", count: 24, color: "oklch(0.55 0.22 265)" },
  { name: "Design", count: 138, color: "oklch(0.65 0.22 330)" },
  { name: "Finance", count: 56, color: "oklch(0.72 0.18 145)" },
  { name: "Marketing", count: 89, color: "oklch(0.72 0.19 45)" },
];

const files = [
  { name: "Q4-strategy.pdf", size: "2.4 MB", type: "pdf", modified: "2h ago", icon: FileText, color: "oklch(0.6 0.22 27)" },
  { name: "Brand-guidelines.pdf", size: "18 MB", type: "pdf", modified: "yesterday", icon: FileText, color: "oklch(0.6 0.22 27)" },
  { name: "Revenue-2026.xlsx", size: "312 KB", type: "xlsx", modified: "3d ago", icon: FileSpreadsheet, color: "oklch(0.68 0.16 155)" },
  { name: "Hero-shot.png", size: "4.1 MB", type: "png", modified: "5d ago", icon: Image, color: "oklch(0.65 0.22 330)" },
  { name: "Product-demo.mp4", size: "84 MB", type: "mp4", modified: "1w ago", icon: FileVideo, color: "oklch(0.55 0.22 265)" },
  { name: "Podcast-ep-12.mp3", size: "42 MB", type: "mp3", modified: "1w ago", icon: Music, color: "oklch(0.72 0.19 45)" },
  { name: "Assets-2026.zip", size: "220 MB", type: "zip", modified: "2w ago", icon: Archive, color: "oklch(0.55 0.02 260)" },
];

function Documents() {
  return (
    <AppShell title="Documents">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-1">
          {[
            { icon: Folder, label: "All files", active: true },
            { icon: Clock, label: "Recent" },
            { icon: Star, label: "Starred" },
            { icon: Users, label: "Shared with me" },
          ].map((i) => (
            <button key={i.label} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${i.active ? "bg-accent font-medium" : "hover:bg-muted text-muted-foreground"}`}>
              <i.icon className="w-4 h-4" />{i.label}
            </button>
          ))}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="text-xs font-medium mb-2">Storage</div>
              <Progress value={64} className="h-1.5 mb-2" />
              <div className="text-[11px] text-muted-foreground">32 GB of 50 GB used</div>
              <Button size="sm" className="w-full mt-3">Upgrade</Button>
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search files..." className="pl-9 h-9" />
            </div>
            <Button size="sm" variant="outline" className="ml-auto gap-1.5"><Upload className="w-4 h-4" />Upload</Button>
            <Button size="sm" className="gap-1.5"><Folder className="w-4 h-4" />New folder</Button>
          </div>

          {/* Folders */}
          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Folders</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {folders.map((f) => (
              <Card key={f.name} className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all">
                <CardContent className="p-4">
                  <div className="w-9 h-9 rounded-lg grid place-items-center mb-3" style={{ background: `color-mix(in oklab, ${f.color} 15%, transparent)` }}>
                    <Folder className="w-4 h-4" style={{ color: f.color }} />
                  </div>
                  <div className="text-sm font-medium">{f.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{f.count} items</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Files */}
          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Files</div>
          <Card>
            <div className="divide-y">
              {files.map((f) => (
                <div key={f.name} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors">
                  <div className="w-9 h-9 rounded-lg grid place-items-center" style={{ background: `color-mix(in oklab, ${f.color} 15%, transparent)` }}>
                    <f.icon className="w-4 h-4" style={{ color: f.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{f.name}</div>
                    <div className="text-xs text-muted-foreground">{f.size} · modified {f.modified}</div>
                  </div>
                  <Badge variant="secondary" className="uppercase text-[10px]">{f.type}</Badge>
                  <Button size="icon" variant="ghost" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
