import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Inbox, Send, FileEdit, Archive, Trash2, Star, Tag, Search, Reply, Forward, MoreHorizontal, Paperclip, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email — Nexus" },
      { name: "description", content: "Unified inbox for Gmail, Outlook and IMAP accounts." },
      { property: "og:title", content: "Email — Nexus" },
      { property: "og:description", content: "Unified inbox for Gmail, Outlook and IMAP accounts." },
    ],
  }),
  component: Email,
});

const messages = [
  { from: "Sarah Chen", subj: "Re: Q4 forecast review", preview: "Looks great — one small tweak on the retention curve...", time: "9:42", unread: true, star: true, initials: "SC" },
  { from: "Stripe", subj: "Your payout of $12,480 is on the way", preview: "We initiated a payout to your bank account ending in 4242.", time: "8:11", unread: true, initials: "ST" },
  { from: "Marcus Ali", subj: "Design review — feedback attached", preview: "Left comments on frames 3 and 7. Overall direction is 🔥", time: "Wed", initials: "MA" },
  { from: "GitHub", subj: "[PR] feat: spider graph exports", preview: "3 reviewers requested changes on nexus/graphs#482", time: "Wed", initials: "GH" },
  { from: "Nina Petrov", subj: "Client onboarding call recap", preview: "Sending over the summary from today's kickoff...", time: "Tue", star: true, initials: "NP" },
  { from: "Automation", subj: "Weekly automation summary", preview: "18 workflows ran successfully. 0 failures this week.", time: "Mon", initials: "AU" },
];

function Email() {
  const [selected, setSelected] = useState(0);
  const m = messages[selected];

  return (
    <AppShell title="Email" actions={<Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" />Compose</Button>}>
      <div className="grid grid-cols-[180px_320px_1fr] gap-4 h-[calc(100vh-13rem)]">
        {/* Folders */}
        <div className="space-y-0.5">
          {[
            { icon: Inbox, label: "Inbox", count: 24, active: true },
            { icon: Star, label: "Starred", count: 3 },
            { icon: Send, label: "Sent" },
            { icon: FileEdit, label: "Drafts", count: 2 },
            { icon: Archive, label: "Archive" },
            { icon: Trash2, label: "Trash" },
          ].map((i) => (
            <button key={i.label} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${i.active ? "bg-accent font-medium" : "hover:bg-muted text-muted-foreground"}`}>
              <i.icon className="w-4 h-4" />
              <span className="flex-1 text-left">{i.label}</span>
              {i.count && <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{i.count}</Badge>}
            </button>
          ))}
          <div className="pt-4 pl-2 text-[10px] uppercase tracking-wider text-muted-foreground">Labels</div>
          {[["Clients","oklch(0.55 0.22 265)"],["Personal","oklch(0.72 0.18 145)"],["Finance","oklch(0.72 0.19 45)"]].map(([l,c]) => (
            <button key={l} className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm hover:bg-muted text-muted-foreground">
              <Tag className="w-3.5 h-3.5" style={{ color: c }} />{l}
            </button>
          ))}
        </div>

        {/* List */}
        <Card className="overflow-hidden flex flex-col">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search inbox" className="pl-8 h-8 text-xs" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y">
            {messages.map((msg, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full text-left px-3 py-3 hover:bg-muted/40 transition-colors ${selected === i ? "bg-accent" : ""}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${msg.unread ? "bg-primary" : "bg-transparent"}`} />
                  <span className={`text-xs flex-1 truncate ${msg.unread ? "font-semibold" : ""}`}>{msg.from}</span>
                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                </div>
                <div className={`text-xs truncate ${msg.unread ? "font-medium" : "text-muted-foreground"}`}>{msg.subj}</div>
                <div className="text-[11px] text-muted-foreground truncate mt-0.5">{msg.preview}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Reading */}
        <Card className="p-6 overflow-y-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{m.initials}</AvatarFallback></Avatar>
              <div>
                <h2 className="text-lg font-semibold">{m.subj}</h2>
                <div className="text-xs text-muted-foreground mt-0.5">
                  <span className="font-medium text-foreground">{m.from}</span> · to me · {m.time}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8"><Star className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8"><Archive className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="prose prose-sm max-w-none text-sm text-foreground/90 space-y-3">
            <p>Hi Alex,</p>
            <p>{m.preview} I've attached a revised version with tracked changes so you can quickly see the diff.</p>
            <p>Let me know if you want to jump on a quick 15 min sync — otherwise I'll aim to merge this by Friday.</p>
            <p>Cheers,<br />{m.from}</p>
          </div>
          <div className="mt-6 pt-6 border-t flex gap-2">
            <Button size="sm" variant="outline" className="gap-1.5"><Reply className="w-3.5 h-3.5" />Reply</Button>
            <Button size="sm" variant="outline" className="gap-1.5"><Forward className="w-3.5 h-3.5" />Forward</Button>
            <Button size="sm" variant="ghost" className="gap-1.5 ml-auto"><Paperclip className="w-3.5 h-3.5" />Attach</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
