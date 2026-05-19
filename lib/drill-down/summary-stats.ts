import type { DrillDownDataset } from "@/lib/drill-down/data";
import { parseSarToNumber } from "@/lib/format/sar";

function parsePercentString(value: string | number): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const s = String(value).trim();
  const m = s.match(/([\d.]+)\s*%/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return Number.isFinite(n) ? n : null;
}

function sumColumnNumbers(
  rows: Record<string, string | number>[],
  key: string
): number {
  let sum = 0;
  for (const row of rows) {
    const v = row[key];
    if (typeof v === "number" && Number.isFinite(v)) sum += v;
  }
  return sum;
}

/** Third summary card: view-aware stat instead of generic status-group count. */
function thirdSummaryCard(dataset: DrillDownDataset): {
  label: string;
  value: string;
  helper: string;
} {
  const { domain, view, rows, columns } = dataset;

  if (domain === "rooms" && view === "occupancy" && rows.length) {
    const nums = rows
      .map((r) => parsePercentString(r.occupancy ?? ""))
      .filter((n): n is number => n !== null);
    if (nums.length) {
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      const last = nums[nums.length - 1]!;
      return {
        label: "Occupancy range",
        value: `${Math.round(min)}–${Math.round(max)}%`,
        helper: `Last day: ${Math.round(last)}%`,
      };
    }
  }

  if (
    (domain === "rooms" &&
      (view === "sold" || view === "occupied" || view === "available")) ||
    (domain === "fnb" &&
      (view === "today-sales" ||
        view === "covers" ||
        view === "average-check" ||
        view === "discounts" ||
        view === "voids"))
  ) {
    const segKey =
      columns.find((c) => c.key === "segment")?.key ??
      columns.find((c) => c.key === "outlet")?.key;
    const numKey = columns.find((c) => c.key === "rooms")?.key ?? "value";
    if (segKey && rows.length) {
      let best = { name: "", n: 0 };
      for (const row of rows) {
        const n =
          typeof row[numKey] === "number"
            ? (row[numKey] as number)
            : parseSarToNumber(String(row[numKey] ?? 0));
        if (n > best.n) {
          best = { name: String(row[segKey] ?? ""), n };
        }
      }
      const total =
        numKey === "rooms"
          ? sumColumnNumbers(rows, numKey)
          : rows.reduce(
              (s, r) => s + parseSarToNumber(String(r[numKey] ?? 0)),
              0
            );
      const pct =
        total > 0 && best.n > 0 ? Math.round((best.n / total) * 100) : 0;
      return {
        label: "Largest slice",
        value: best.name || "—",
        helper: pct ? `${pct}% of rows below` : "Share of total",
      };
    }
  }

  if (domain === "finance" && view === "accounts-receivable" && rows.length) {
    const amounts = rows.map((r) => parseSarToNumber(String(r.amount ?? 0)));
    const max = Math.max(...amounts, 0);
    const idx = amounts.indexOf(max);
    const bucket =
      idx >= 0 ? String(rows[idx]?.account ?? "—") : "—";
    return {
      label: "Largest aging bucket",
      value: bucket,
      helper: max > 0 ? `≈ ${max.toLocaleString()} SAR` : "By amount",
    };
  }

  const uniqueStatuses = new Set(
    rows
      .map((row) => row.status)
      .filter((status): status is string | number => status !== undefined)
  );
  return {
    label: "Status groups",
    value: uniqueStatuses.size ? String(uniqueStatuses.size) : "1",
    helper: "Distinct statuses in table",
  };
}

export function getDrillSummaryCards(
  dataset: DrillDownDataset,
  primaryDisplay: string
): {
  label: string;
  value: string;
  helper: string;
}[] {
  const third = thirdSummaryCard(dataset);

  return [
    {
      label: "Breakdown rows",
      value: dataset.rows.length.toString(),
      helper: "Rows in supporting table",
    },
    {
      label: "Primary value",
      value: primaryDisplay || "—",
      helper: dataset.primaryMetric
        ? "Matches the KPI you clicked"
        : "Top visible metric from data",
    },
    {
      label: third.label,
      value: third.value,
      helper: third.helper,
    },
  ];
}

const BUCKET_KEYS = [
  "status",
  "metric",
  "type",
  "segment",
  "outlet",
  "account",
  "item",
  "name",
];

/** Mini breakdown list: prefer categorical buckets when status is flat. */
export function getDrillBreakdownRows(
  dataset: DrillDownDataset
): [string, number][] {
  const { rows, columns } = dataset;
  if (!rows.length) return [];

  const statusValues = new Set(
    rows.map((r) => String(r.status ?? "")).filter(Boolean)
  );
  const useStatus = statusValues.size > 1;

  if (useStatus) {
    const statusCounts = new Map<string, number>();
    for (const row of rows) {
      const key = String(row.status ?? row.metric ?? row.type ?? "Other");
      statusCounts.set(key, (statusCounts.get(key) ?? 0) + 1);
    }
    return Array.from(statusCounts.entries()).slice(0, 6);
  }

  for (const col of columns) {
    if (BUCKET_KEYS.includes(col.key) && col.key !== "status") {
      const counts = new Map<string, number>();
      for (const row of rows) {
        const key = String(row[col.key] ?? "Other");
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      if (counts.size > 1) {
        return Array.from(counts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6);
      }
    }
  }

  const fallback = new Map<string, number>();
  for (const row of rows) {
    const key = String(row.status ?? row.metric ?? row.type ?? "Other");
    fallback.set(key, (fallback.get(key) ?? 0) + 1);
  }
  return Array.from(fallback.entries()).slice(0, 6);
}

export function sumSarLikeColumn(
  rows: Record<string, string | number>[],
  columnKeys: string[]
): number {
  let sum = 0;
  for (const row of rows) {
    for (const key of columnKeys) {
      if (key in row) {
        sum += parseSarToNumber(String(row[key] ?? ""));
        break;
      }
    }
  }
  return sum;
}

export function reconciliationForDataset(
  dataset: DrillDownDataset
): { show: boolean; tableTotal: number; primaryParsed: number; ok: boolean } | null {
  const primary = dataset.primaryMetric;
  if (!primary || !dataset.rows.length) return null;

  const keys = dataset.columns.map((c) => c.key);
  const amountLike = keys.filter((k) =>
    ["amount", "value", "stock", "reorderLevel"].includes(k)
  );

  let tableTotal = 0;
  if (dataset.domain === "finance") {
    tableTotal = sumSarLikeColumn(dataset.rows, ["amount"]);
  } else if (dataset.domain === "fnb") {
    tableTotal = sumSarLikeColumn(dataset.rows, ["value"]);
  } else if (
    dataset.domain === "inventory" &&
    dataset.view === "stock-value"
  ) {
    tableTotal = sumSarLikeColumn(dataset.rows, ["stock"]);
  } else {
    return null;
  }

  const primaryParsed = parseSarToNumber(String(primary));
  if (!primaryParsed || !tableTotal) return null;

  const drift = Math.abs(tableTotal - primaryParsed) / primaryParsed;
  const ok = drift <= 0.02;
  return { show: true, tableTotal, primaryParsed, ok };
}
