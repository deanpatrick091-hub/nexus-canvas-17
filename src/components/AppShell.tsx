import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Radar,
  Table,
  Workflow,
  FolderOpen,
  Mail,
  BarChart3,
  Receipt,
  Settings as SettingsIcon,
  Search,
  Bell,
  Command,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/spider-graphs", label: "Spider Graphs", icon: Radar },
  { to: "/spreadsheet", label: "Spreadsheet", icon: Table },
  { to: "/api-builder", label: "API Builder", icon: Workflow },
  { to: "/documents", label: "Documents", icon: FolderOpen },
  { to: "/email", label: "Email", icon: Mail, badge: 4 },
  { to: "/statistics", label: "Statistics", icon: BarChart3 },
  { to: "/invoices", label: "Invoices", icon: Receipt },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function AppShell({ children, title, actions }: { children: ReactNode; title?: string; actions?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-sidebar-border">
          <div className="grid place-items-center w-8 h-8 rounded-lg" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-sm">Nexus</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Workspace</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-primary" : ""}`} />
                <span className="flex-1">{item.label}</span>
                {"badge" in item && item.badge ? (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{item.badge}</Badge>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent/60 transition-colors cursor-pointer">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">AV</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">Alex Vance</div>
              <div className="text-[10px] text-muted-foreground truncate">alex@nexus.io</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center gap-4 px-5">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search anything..." className="pl-9 pr-16 h-9 bg-muted/50 border-transparent focus-visible:bg-background" />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground flex items-center gap-0.5 pointer-events-none">
              <Command className="w-3 h-3" /> K
            </kbd>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <ThemeToggle />
            <Button size="icon" variant="ghost" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
            </Button>
          </div>
        </header>
        <main className="flex-1 min-w-0">
          {title && (
            <div className="px-6 md:px-8 pt-6">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            </div>
          )}
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
