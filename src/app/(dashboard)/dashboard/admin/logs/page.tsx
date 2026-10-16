"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSearch,
  Filter,
  RefreshCw,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";

import {
  useGetLogsQuery,
  useGetLogSummaryQuery,
  type TLogsQueryParams,
} from "@/redux/api/logsApi";

type LogLevel = "error" | "warn" | "info";
type LogCategory = "HTTP" | "DB" | "DB_ERROR" | "SERVER" | "OTHER";
type SortOrder = "asc" | "desc";

interface TLogRecord {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  raw?: string;
  ip?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  durationMs?: number;
  model?: string;
}

interface TLogMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface TLogPayload {
  totalLogs: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  logs: TLogRecord[];
}

const LEVELS: { label: string; value: LogLevel }[] = [
  { label: "Error", value: "error" },
  { label: "Warning", value: "warn" },
  { label: "Information", value: "info" },
];

const CATEGORIES: { label: string; value: LogCategory }[] = [
  { label: "HTTP", value: "HTTP" },
  { label: "Database", value: "DB" },
  { label: "Database Error", value: "DB_ERROR" },
  { label: "Server", value: "SERVER" },
  { label: "Other", value: "OTHER" },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isLogLevel(value: string): value is LogLevel {
  return value === "error" || value === "warn" || value === "info";
}

function isLogCategory(value: string): value is LogCategory {
  return (
    value === "HTTP" ||
    value === "DB" ||
    value === "DB_ERROR" ||
    value === "SERVER" ||
    value === "OTHER"
  );
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
}

function toStringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeLog(value: unknown): TLogRecord | null {
  if (!isRecord(value)) return null;

  const rawLevel = toStringValue(value.level).toLowerCase();
  const rawCategory = toStringValue(value.category);

  return {
    timestamp: toStringValue(value.timestamp),
    level: isLogLevel(rawLevel) ? rawLevel : "info",
    category: isLogCategory(rawCategory) ? rawCategory : "OTHER",
    message: toStringValue(value.message, "No message"),
    raw: toStringValue(value.raw),
    ip: toStringValue(value.ip),
    method: toStringValue(value.method),
    url: toStringValue(value.url),
    statusCode:
      value.statusCode == null ? undefined : toNumber(value.statusCode),
    durationMs:
      value.durationMs == null ? undefined : toNumber(value.durationMs),
    model: toStringValue(value.model),
  };
}

function normalizeLogs(response: unknown): {
  meta: TLogMeta;
  data: TLogPayload;
} {
  const root = isRecord(response) ? response : {};
  const rootData = isRecord(root.data) ? root.data : root;
  const data = isRecord(rootData.data) ? rootData.data : rootData;

  const rawLogs = Array.isArray(data.logs)
    ? data.logs
    : Array.isArray(data.results)
      ? data.results
      : Array.isArray(data.items)
        ? data.items
        : [];

  const logs = rawLogs
    .map(normalizeLog)
    .filter((log): log is TLogRecord => log !== null);

  const rawMeta = isRecord(root.meta)
    ? root.meta
    : isRecord(rootData.meta)
      ? rootData.meta
      : {};

  const total = toNumber(rawMeta.total, toNumber(data.totalLogs, logs.length));
  const page = toNumber(rawMeta.page, 1);
  const limit = Math.max(1, toNumber(rawMeta.limit, logs.length || 20));
  const totalPages = Math.max(
    1,
    toNumber(rawMeta.totalPages, Math.ceil(total / limit)),
  );

  return {
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage:
        typeof rawMeta.hasNextPage === "boolean"
          ? rawMeta.hasNextPage
          : page < totalPages,
      hasPrevPage:
        typeof rawMeta.hasPrevPage === "boolean"
          ? rawMeta.hasPrevPage
          : page > 1,
    },
    data: {
      totalLogs: toNumber(data.totalLogs, total),
      errorCount: toNumber(data.errorCount),
      warnCount: toNumber(data.warnCount, toNumber(data.warningCount)),
      infoCount: toNumber(data.infoCount),
      logs,
    },
  };
}

function normalizeSummary(response: unknown): TLogPayload {
  const root = isRecord(response) ? response : {};
  const firstData = isRecord(root.data) ? root.data : root;
  const data = isRecord(firstData.data) ? firstData.data : firstData;

  return {
    totalLogs: toNumber(data.totalLogs, toNumber(data.total)),
    errorCount: toNumber(data.errorCount),
    warnCount: toNumber(data.warnCount, toNumber(data.warningCount)),
    infoCount: toNumber(data.infoCount),
    logs: [],
  };
}

function formatTimestamp(value: string): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function formatDuration(value?: number): string {
  if (value === undefined) return "—";
  return value < 1000 ? `${value} ms` : `${(value / 1000).toFixed(2)} s`;
}

function levelStyles(level: LogLevel): string {
  switch (level) {
    case "error":
      return "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900";
    case "warn":
      return "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900";
    default:
      return "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900";
  }
}

function statusStyles(status?: number): string {
  if (status === undefined) return "text-muted-foreground";
  if (status >= 500) return "text-red-600 dark:text-red-400";
  if (status >= 400) return "text-amber-600 dark:text-amber-400";
  if (status >= 200 && status < 300)
    return "text-emerald-600 dark:text-emerald-400";
  return "text-muted-foreground";
}

function DetailItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="min-w-0 rounded-lg border p-3">
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <p className="break-words text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<LogLevel | "">("");
  const [category, setCategory] = useState<LogCategory | "">("");
  const [method, setMethod] = useState("");
  const [statusCode, setStatusCode] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<TLogRecord | null>(null);

  const logParams = useMemo<TLogsQueryParams>(
    () => ({
      page,
      limit,
      sortOrder,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(level ? { level } : {}),
      ...(category ? { category } : {}),
      ...(method ? { method } : {}),
      ...(statusCode.trim() ? { statusCode: Number(statusCode) } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    }),
    [
      page,
      limit,
      sortOrder,
      search,
      level,
      category,
      method,
      statusCode,
      dateFrom,
      dateTo,
    ],
  );

  const summaryParams = useMemo(
    () => ({
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    }),
    [dateFrom, dateTo],
  );

  const {
    data: logsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetLogsQuery(logParams);

  const { data: summaryResponse } = useGetLogSummaryQuery(summaryParams);

  const normalized = useMemo(() => normalizeLogs(logsResponse), [logsResponse]);
  const summary = useMemo(
    () => normalizeSummary(summaryResponse),
    [summaryResponse],
  );

  const logs = normalized.data.logs;
  const meta = normalized.meta;

  const stats = [
    {
      label: "Total log events",
      value: summary.totalLogs || meta.total,
      icon: Activity,
      style: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
    },
    {
      label: "Errors",
      value: summary.errorCount,
      icon: AlertCircle,
      style: "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300",
    },
    {
      label: "Warnings",
      value: summary.warnCount,
      icon: AlertTriangle,
      style:
        "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300",
    },
    {
      label: "Information",
      value: summary.infoCount,
      icon: CheckCircle2,
      style:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
    },
  ];

  function resetFilters() {
    setSearch("");
    setLevel("");
    setCategory("");
    setMethod("");
    setStatusCode("");
    setDateFrom("");
    setDateTo("");
    setSortOrder("desc");
    setPage(1);
  }

  function exportCsv() {
    if (logs.length === 0) return;

    const headers = [
      "Timestamp",
      "Level",
      "Category",
      "Message",
      "Method",
      "URL",
      "Status Code",
      "Duration",
      "IP",
    ];

    const rows = logs.map((log) => [
      log.timestamp,
      log.level,
      log.category,
      log.message,
      log.method ?? "",
      log.url ?? "",
      log.statusCode?.toString() ?? "",
      log.durationMs?.toString() ?? "",
      log.ip ?? "",
    ]);

    const escapeCsv = (value: string) =>
      `"${value.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `logs-page-${page}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  const inputClass =
    "h-10 w-full min-w-0 rounded-lg border bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary";

  return (
    <main className="w-full min-w-0 max-w-full space-y-5 p-3 sm:p-5 lg:p-8">
      {/* Page header */}
      <header className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>Administration</span>
            <span>/</span>
            <span>Monitoring</span>
          </div>

          <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
            Logs &amp; Monitoring
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Monitor application activity, investigate errors, and inspect server
            events.
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0">
          <button
            type="button"
            onClick={exportCsv}
            disabled={logs.length === 0}
            className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            <Download className="h-4 w-4 shrink-0" />
            Export CSV
          </button>

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60 sm:flex-none"
          >
            <RefreshCw
              className={`h-4 w-4 shrink-0 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </header>
      {/* Summary cards */}
      <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="min-w-0 rounded-xl border bg-card p-4 shadow-sm sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 break-words text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <div className={`shrink-0 rounded-lg p-2 ${stat.style}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 break-words text-3xl font-bold tracking-tight">
                {stat.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </section>
      {/* Logs panel */}
      <section className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex min-w-0 flex-col gap-4 border-b p-3 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">Application logs</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {meta.total.toLocaleString()} matching events
              {isFetching ? " · Updating..." : ""}
            </p>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              className="inline-flex min-w-0 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <Filter className="h-4 w-4 shrink-0" />
              Filters
              {filtersOpen ? <X className="h-4 w-4 shrink-0" /> : null}
            </button>

            <label className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Rows</span>
              <select
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value));
                  setPage(1);
                }}
                className="h-9 min-w-0 rounded-lg border bg-background px-2 text-foreground outline-none focus:ring-2 focus:ring-primary"
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => {
                setSortOrder((current) =>
                  current === "desc" ? "asc" : "desc",
                );
                setPage(1);
              }}
              className="inline-flex min-w-0 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
              title="Change sort order"
            >
              {sortOrder === "desc" ? (
                <ArrowDown className="h-4 w-4 shrink-0" />
              ) : (
                <ArrowUp className="h-4 w-4 shrink-0" />
              )}
              <span>{sortOrder === "desc" ? "Newest" : "Oldest"}</span>
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="min-w-0 space-y-4 border-b p-3 sm:p-5">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search messages, URLs, IP addresses..."
              className="h-11 w-full min-w-0 rounded-lg border bg-background pl-10 pr-10 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {filtersOpen && (
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <label className="block min-w-0 space-y-1.5 text-sm">
                <span className="font-medium">Log level</span>
                <select
                  value={level}
                  onChange={(event) => {
                    const value = event.target.value;
                    setLevel(isLogLevel(value) ? value : "");
                    setPage(1);
                  }}
                  className={inputClass}
                >
                  <option value="">All levels</option>
                  {LEVELS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block min-w-0 space-y-1.5 text-sm">
                <span className="font-medium">Category</span>
                <select
                  value={category}
                  onChange={(event) => {
                    const value = event.target.value;
                    setCategory(isLogCategory(value) ? value : "");
                    setPage(1);
                  }}
                  className={inputClass}
                >
                  <option value="">All categories</option>
                  {CATEGORIES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block min-w-0 space-y-1.5 text-sm">
                <span className="font-medium">HTTP method</span>
                <select
                  value={method}
                  onChange={(event) => {
                    setMethod(event.target.value);
                    setPage(1);
                  }}
                  className={inputClass}
                >
                  <option value="">All methods</option>
                  {["GET", "POST", "PUT", "PATCH", "DELETE"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block min-w-0 space-y-1.5 text-sm">
                <span className="font-medium">Status code</span>
                <select
                  value={statusCode}
                  onChange={(event) => {
                    setStatusCode(event.target.value);
                    setPage(1);
                  }}
                  className={inputClass}
                >
                  <option value="">All statuses</option>
                  {[
                    "200",
                    "201",
                    "204",
                    "301",
                    "400",
                    "401",
                    "403",
                    "404",
                    "422",
                    "429",
                    "500",
                    "502",
                    "503",
                  ].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block min-w-0 space-y-1.5 text-sm">
                <span className="font-medium">From date</span>
                <div className="relative min-w-0">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={dateFrom}
                    max={dateTo || undefined}
                    onChange={(event) => {
                      setDateFrom(event.target.value);
                      setPage(1);
                    }}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </label>

              <label className="block min-w-0 space-y-1.5 text-sm">
                <span className="font-medium">To date</span>
                <div className="relative min-w-0">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={dateTo}
                    min={dateFrom || undefined}
                    onChange={(event) => {
                      setDateTo(event.target.value);
                      setPage(1);
                    }}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </label>

              <div className="sm:col-span-2 xl:col-span-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table stays inside its own horizontal scroll container */}
        {isError ? (
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h3 className="mt-3 font-semibold">Unable to load logs</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Check the server connection and try again.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div className="min-w-0 space-y-3 p-4 sm:p-5">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-14 w-full animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <div className="rounded-full bg-muted p-4">
              <FileSearch className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-semibold">No log entries found</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              No logs match the current filters. Try another search or clear
              your filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="w-full min-w-0 max-w-full overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="whitespace-nowrap px-5 py-3.5 font-medium">
                      Timestamp
                    </th>
                    <th className="px-4 py-3.5 font-medium">Level</th>
                    <th className="px-4 py-3.5 font-medium">Category</th>
                    <th className="px-4 py-3.5 font-medium">Message</th>
                    <th className="px-4 py-3.5 font-medium">Request</th>
                    <th className="px-4 py-3.5 font-medium">Status</th>
                    <th className="px-4 py-3.5 font-medium">Duration</th>
                    <th className="px-5 py-3.5 text-right font-medium">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {logs.map((log, index) => (
                    <tr
                      key={`${log.timestamp}-${log.url}-${index}`}
                      className="transition hover:bg-muted/30"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-muted-foreground">
                        {formatTimestamp(log.timestamp)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${levelStyles(log.level)}`}
                        >
                          {log.level}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="rounded-md border px-2 py-1 text-xs font-medium">
                          {log.category}
                        </span>
                      </td>

                      <td className="max-w-[280px] px-4 py-4">
                        <p className="truncate font-medium" title={log.message}>
                          {log.message}
                        </p>
                        {log.model && (
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            Model: {log.model}
                          </p>
                        )}
                      </td>

                      <td className="max-w-[200px] px-4 py-4">
                        {log.method || log.url ? (
                          <div className="space-y-1">
                            {log.method && (
                              <span className="font-mono text-xs font-semibold">
                                {log.method}
                              </span>
                            )}
                            {log.url && (
                              <p
                                className="truncate font-mono text-xs text-muted-foreground"
                                title={log.url}
                              >
                                {log.url}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        {log.statusCode !== undefined ? (
                          <span
                            className={`font-mono text-xs font-semibold ${statusStyles(log.statusCode)}`}
                          >
                            {log.statusCode}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs text-muted-foreground">
                        {formatDuration(log.durationMs)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex min-w-0 flex-col gap-3 border-t px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="min-w-0 break-words text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                  {Math.min(meta.page * meta.limit, meta.total)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {meta.total.toLocaleString()}
                </span>{" "}
                entries
              </p>

              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="mr-1 text-sm text-muted-foreground">
                  Page {meta.page} of {meta.totalPages}
                </span>

                <button
                  type="button"
                  disabled={!meta.hasPrevPage || isFetching}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  aria-label="Previous page"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={!meta.hasNextPage || isFetching}
                  onClick={() =>
                    setPage((current) => Math.min(meta.totalPages, current + 1))
                  }
                  aria-label="Next page"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
      {/* Log details dialog */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-6"
          onClick={() => setSelectedLog(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="log-details-title"
            className="my-auto max-h-[90dvh] w-full min-w-0 max-w-2xl overflow-y-auto rounded-xl border bg-background shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b p-4 sm:p-5">
              <div className="min-w-0">
                <h2 id="log-details-title" className="text-lg font-semibold">
                  Log details
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Full information for this event.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                aria-label="Close log details"
                className="shrink-0 rounded-lg p-2 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-w-0 space-y-5 p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${levelStyles(selectedLog.level)}`}
                >
                  {selectedLog.level}
                </span>
                <span className="rounded-md border px-2.5 py-1 text-xs font-medium">
                  {selectedLog.category}
                </span>
                {selectedLog.statusCode !== undefined && (
                  <span
                    className={`rounded-md border px-2.5 py-1 font-mono text-xs font-semibold ${statusStyles(selectedLog.statusCode)}`}
                  >
                    HTTP {selectedLog.statusCode}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Message
                </p>
                <p className="break-words text-sm font-medium">
                  {selectedLog.message}
                </p>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailItem
                  label="Timestamp"
                  value={formatTimestamp(selectedLog.timestamp)}
                />
                <DetailItem
                  label="Duration"
                  value={formatDuration(selectedLog.durationMs)}
                />
                <DetailItem label="HTTP method" value={selectedLog.method} />
                <DetailItem label="Request URL" value={selectedLog.url} />
                <DetailItem label="IP address" value={selectedLog.ip} />
                <DetailItem label="Database model" value={selectedLog.model} />
              </div>

              {selectedLog.raw && (
                <div className="min-w-0">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Raw log
                  </p>
                  <pre className="max-h-64 max-w-full overflow-auto whitespace-pre-wrap break-all rounded-lg border bg-muted/40 p-3 font-mono text-xs leading-relaxed sm:p-4">
                    {selectedLog.raw}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t p-4">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
