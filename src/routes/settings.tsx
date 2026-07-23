import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Bell, Shield, Palette, Key, CreditCard, Users, HardDrive } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Nexus" },
      { name: "description", content: "Manage profile, theme, notifications, API keys and permissions." },
      { property: "og:title", content: "Settings — Nexus" },
      { property: "og:description", content: "Manage profile, theme, notifications, API keys and permissions." },
    ],
  }),
  component: Settings,
});

const sections = [
  { icon: User, label: "Profile" },
  { icon: Palette, label: "Appearance" },
  { icon: Bell, label: "Notifications" },
  { icon: Shield, label: "Security" },
  { icon: Key, label: "API Keys" },
  { icon: CreditCard, label: "Billing" },
  { icon: Users, label: "Team" },
  { icon: HardDrive, label: "Storage" },
];

const accents = [
  "oklch(0.55 0.22 265)",
  "oklch(0.65 0.22 330)",
  "oklch(0.7 0.18 180)",
  "oklch(0.72 0.19 45)",
  "oklch(0.68 0.16 155)",
  "oklch(0.6 0.22 27)",
];

function Settings() {
  const [dark, setDark] = useState(false);
  const [accent, setAccent] = useState(0);

  return (
    <AppShell title="Settings">
      <div className="grid grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-0.5">
          {sections.map((s, i) => (
            <button key={s.label} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${i === 0 ? "bg-accent font-medium" : "hover:bg-muted text-muted-foreground"}`}>
              <s.icon className="w-4 h-4" />{s.label}
            </button>
          ))}
        </nav>

        <div className="space-y-4 max-w-2xl">
          <Card>
            <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16"><AvatarFallback className="bg-primary text-primary-foreground">AV</AvatarFallback></Avatar>
                <div>
                  <Button size="sm" variant="outline">Change photo</Button>
                  <div className="text-[11px] text-muted-foreground mt-1.5">JPG or PNG. Max 2MB.</div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">First name</Label><Input defaultValue="Alex" className="mt-1.5 h-9" /></div>
                <div><Label className="text-xs">Last name</Label><Input defaultValue="Vance" className="mt-1.5 h-9" /></div>
                <div className="col-span-2"><Label className="text-xs">Email</Label><Input defaultValue="alex@nexus.io" className="mt-1.5 h-9" /></div>
                <div className="col-span-2"><Label className="text-xs">Role</Label><Input defaultValue="Founder & CEO" className="mt-1.5 h-9" /></div>
              </div>
              <div className="flex justify-end"><Button size="sm">Save changes</Button></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Dark mode</div>
                  <div className="text-xs text-muted-foreground">Reduce eyestrain in low light.</div>
                </div>
                <Switch checked={dark} onCheckedChange={(v) => {
                  setDark(v);
                  document.documentElement.classList.toggle("dark", v);
                }} />
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-2">Accent color</div>
                <div className="flex gap-2">
                  {accents.map((c, i) => (
                    <button key={i} onClick={() => setAccent(i)} className={`w-8 h-8 rounded-full ring-offset-2 transition-all ${accent === i ? "ring-2 ring-primary" : ""}`} style={{ background: c }} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {["Email digests","Push notifications","Invoice reminders","Automation failures","Weekly summary"].map((n, i) => (
                <div key={n} className="flex items-center justify-between py-1">
                  <span className="text-sm">{n}</span>
                  <Switch defaultChecked={i !== 3} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">API Keys</CardTitle>
              <Button size="sm">Generate key</Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {[{n:"Production",v:"sk_live_•••••••••••••4820",d:"Created Oct 12, 2026"},{n:"Development",v:"sk_test_•••••••••••••1201",d:"Created Sep 03, 2026"}].map((k) => (
                <div key={k.n} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                  <div className="flex-1">
                    <div className="text-sm font-medium flex items-center gap-2">{k.n}<Badge variant="secondary" className="text-[10px]">active</Badge></div>
                    <div className="text-xs font-mono text-muted-foreground mt-0.5">{k.v}</div>
                  </div>
                  <div className="text-[11px] text-muted-foreground">{k.d}</div>
                  <Button size="sm" variant="ghost">Revoke</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
