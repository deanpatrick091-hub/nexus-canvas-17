import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Download, Send, MoreHorizontal, Filter } from "lucide-react";

export const Route = createFileRoute("/invoices")({
  head: () => ({
    meta: [
      { title: "Invoices — Nexus" },
      { name: "description", content: "Create, send and track invoices with Stripe and PayPal." },
      { property: "og:title", content: "Invoices — Nexus" },
      { property: "og:description", content: "Create, send and track invoices with Stripe and PayPal." },
    ],
  }),
  component: Invoices,
});

const invoices = [
  { num: "INV-2049", customer: "Acme Corp", amount: 4800, status: "Paid", due: "Nov 12, 2026", tone: "success" },
  { num: "INV-2048", customer: "Globex Ltd", amount: 12400, status: "Sent", due: "Nov 18, 2026", tone: "primary" },
  { num: "INV-2047", customer: "Initech", amount: 780, status: "Overdue", due: "Oct 30, 2026", tone: "destructive" },
  { num: "INV-2046", customer: "Umbrella Inc", amount: 3200, status: "Paid", due: "Oct 24, 2026", tone: "success" },
  { num: "INV-2045", customer: "Hooli", amount: 9600, status: "Draft", due: "—", tone: "muted" },
  { num: "INV-2044", customer: "Stark Industries", amount: 22400, status: "Sent", due: "Nov 22, 2026", tone: "primary" },
  { num: "INV-2043", customer: "Wayne Enterprises", amount: 1500, status: "Paid", due: "Oct 12, 2026", tone: "success" },
];

const toneClass = (t: string) =>
  t === "success" ? "bg-success/15 text-success"
  : t === "destructive" ? "bg-destructive/15 text-destructive"
  : t === "primary" ? "bg-primary/15 text-primary"
  : "bg-muted text-muted-foreground";

function Invoices() {
  return (
    <AppShell title="Invoices" actions={<Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" />New invoice</Button>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total invoiced", value: "$284,320", tone: "text-foreground" },
          { label: "Paid", value: "$212,800", tone: "text-success" },
          { label: "Outstanding", value: "$59,120", tone: "text-primary" },
          { label: "Overdue", value: "$12,400", tone: "text-destructive" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className={`text-2xl font-semibold mt-1 ${k.tone}`}>{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by number, customer, amount..." className="pl-9 h-9" />
        </div>
        <Button size="sm" variant="outline" className="gap-1.5"><Filter className="w-3.5 h-3.5" />Filter</Button>
        {["All", "Draft", "Sent", "Paid", "Overdue", "Recurring"].map((t, i) => (
          <Button key={t} size="sm" variant={i === 0 ? "secondary" : "ghost"} className="h-8 text-xs">{t}</Button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Number</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Due date</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {invoices.map((inv) => (
              <tr key={inv.num} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-medium">{inv.num}</td>
                <td className="px-4 py-3">{inv.customer}</td>
                <td className="px-4 py-3 text-muted-foreground">{inv.due}</td>
                <td className="px-4 py-3 text-right font-medium">${inv.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Badge className={`${toneClass(inv.tone)} border-0`}>{inv.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-0.5">
                    <Button size="icon" variant="ghost" className="h-7 w-7"><Send className="w-3.5 h-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7"><Download className="w-3.5 h-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7"><MoreHorizontal className="w-3.5 h-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AppShell>
  );
}
