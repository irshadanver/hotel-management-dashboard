"use client";

import { FileText, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PanelCard, PanelListItem } from "@/components/shared";
import { formatCurrency } from "@/components/shared";

interface PurchaseOrder {
  poNumber: string;
  vendor: string;
  amount: number;
  items: number;
  createdBy: string;
  createdAt: string;
  daysOld: number;
  priority: "urgent" | "normal";
}

const pendingOrders: PurchaseOrder[] = [
  {
    poNumber: "PO-2024-0892",
    vendor: "Al-Safi Foods",
    amount: 14200,
    items: 12,
    createdBy: "Ahmad K.",
    createdAt: "2 days ago",
    daysOld: 2,
    priority: "urgent",
  },
  {
    poNumber: "PO-2024-0891",
    vendor: "Premium Linens Co.",
    amount: 8500,
    items: 5,
    createdBy: "Sara M.",
    createdAt: "2 days ago",
    daysOld: 2,
    priority: "urgent",
  },
  {
    poNumber: "PO-2024-0890",
    vendor: "Gulf Beverages",
    amount: 6800,
    items: 8,
    createdBy: "Mohammed A.",
    createdAt: "3 days ago",
    daysOld: 3,
    priority: "urgent",
  },
  {
    poNumber: "PO-2024-0889",
    vendor: "CleanPro Supplies",
    amount: 4200,
    items: 15,
    createdBy: "Fatima R.",
    createdAt: "Yesterday",
    daysOld: 1,
    priority: "normal",
  },
  {
    poNumber: "PO-2024-0888",
    vendor: "Office World",
    amount: 1850,
    items: 6,
    createdBy: "Khalid S.",
    createdAt: "Today",
    daysOld: 0,
    priority: "normal",
  },
  {
    poNumber: "PO-2024-0887",
    vendor: "Fresh Seafood Trading",
    amount: 5100,
    items: 4,
    createdBy: "Ahmad K.",
    createdAt: "Today",
    daysOld: 0,
    priority: "normal",
  },
  {
    poNumber: "PO-2024-0886",
    vendor: "Dairy Direct",
    amount: 2150,
    items: 7,
    createdBy: "Sara M.",
    createdAt: "Today",
    daysOld: 0,
    priority: "normal",
  },
];

function POListItem({ po }: { po: PurchaseOrder }) {
  return (
    <div
      className={`rounded-lg border p-4 transition-colors hover:bg-muted/30 ${
        po.priority === "urgent" ? "border-l-2 border-l-red-500 bg-red-50/50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm font-medium">{po.poNumber}</p>
            {po.priority === "urgent" && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                Urgent
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-sm text-foreground">{po.vendor}</p>
          <p className="mt-1 text-lg font-semibold">{formatCurrency(po.amount)}</p>
          <p className="text-xs text-muted-foreground">{po.items} items</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {po.createdBy}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {po.createdAt}
        </span>
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="default" className="h-7 text-xs">
          Approve
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-xs">
          Review
        </Button>
      </div>
    </div>
  );
}

export function PendingPOsPanel() {
  const totalValue = pendingOrders.reduce((sum, po) => sum + po.amount, 0);
  const urgentCount = pendingOrders.filter((po) => po.priority === "urgent").length;

  return (
    <PanelCard
      title="Pending Approvals"
      icon={<FileText className="h-4 w-4 text-primary" />}
      badge={{ value: `${pendingOrders.length} POs`, variant: "secondary" }}
      subtitle={`Total: ${formatCurrency(totalValue)}`}
      action={
        urgentCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            {urgentCount} urgent
          </Badge>
        )
      }
      maxHeight="480px"
      className="h-full"
    >
      <div className="space-y-3">
        {pendingOrders.map((po) => (
          <POListItem key={po.poNumber} po={po} />
        ))}
      </div>
    </PanelCard>
  );
}
