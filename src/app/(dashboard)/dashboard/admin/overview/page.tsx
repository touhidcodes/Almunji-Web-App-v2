"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Bookmark,
  BookText,
  CheckCircle2,
  CircleAlert,
  FileText,
  FolderOpen,
  Heart,
  Library,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

import { useGetDashboardStatsQuery } from "@/redux/api/dashboardApi";

interface TDashboardStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalSurahs: number;
  totalParas: number;
  totalAyahs: number;
  totalTafsirs: number;
  totalDictionaries: number;
  activeDictionaries: number;
  totalBooks: number;
  totalBookCategories: number;
  totalBookContents: number;
  totalBlogs: number;
  publishedBlogs: number;
  featuredBlogs: number;
  totalDuas: number;
  totalBookmarks: number;
  bookmarkedAyahs: number;
  bookmarkedDuas: number;
  featuredBooks: number;
}

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
}

const formatNumber = (value: number) => value.toLocaleString("en-US");

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  iconColor,
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-200/80 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-950/5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {formatNumber(value)}
          </h3>
        </div>

        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${color}`}
        >
          <Icon className={`size-6 ${iconColor}`} />
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

interface ProgressRowProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

function ProgressRow({ label, value, maxValue, color }: ProgressRowProps) {
  const percentage = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {label}
        </span>

        <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
          {formatNumber(value)}
        </span>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={maxValue}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

export default function AdminDashboardOverview() {
  const { data, isLoading, isError, refetch, isFetching } =
    useGetDashboardStatsQuery({});

  // Assumes the API returns { success, message, data: {...stats} }.
  const stats = data?.data as TDashboardStats | undefined;

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900"
            />
          ))}
        </div>

        <div className="h-72 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-900" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30">
          <CircleAlert className="size-7 text-red-500" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
          Unable to load dashboard
        </h2>

        <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
          We couldn&apos;t retrieve your dashboard statistics. Please check your
          connection and try again.
        </p>

        <button
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <RefreshCw className="size-4" />
          Try again
        </button>
      </div>
    );
  }

  const userPercentage =
    stats.totalUsers > 0
      ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
      : 0;

  const dictionaryPercentage =
    stats.totalDictionaries > 0
      ? Math.round((stats.activeDictionaries / stats.totalDictionaries) * 100)
      : 0;

  const publishedPercentage =
    stats.totalBlogs > 0
      ? Math.round((stats.publishedBlogs / stats.totalBlogs) * 100)
      : 0;

  const totalBookmarkedItems = stats.bookmarkedAyahs + stats.bookmarkedDuas;

  const contentCollections = [
    {
      label: "Surahs",
      value: stats.totalSurahs,
      icon: BookOpen,
      color: "bg-emerald-50 dark:bg-emerald-950/30",
      iconColor: "text-emerald-600",
    },
    {
      label: "Paras",
      value: stats.totalParas,
      icon: BookMarked,
      color: "bg-blue-50 dark:bg-blue-950/30",
      iconColor: "text-blue-600",
    },
    {
      label: "Ayahs",
      value: stats.totalAyahs,
      icon: BookText,
      color: "bg-violet-50 dark:bg-violet-950/30",
      iconColor: "text-violet-600",
    },
    {
      label: "Tafsirs",
      value: stats.totalTafsirs,
      icon: Library,
      color: "bg-amber-50 dark:bg-amber-950/30",
      iconColor: "text-amber-600",
    },
  ];

  const libraryCollections = [
    {
      label: "Books",
      value: stats.totalBooks,
      icon: BookOpen,
    },
    {
      label: "Book categories",
      value: stats.totalBookCategories,
      icon: FolderOpen,
    },
    {
      label: "Book contents",
      value: stats.totalBookContents,
      icon: FileText,
    },
    {
      label: "Featured books",
      value: stats.featuredBooks,
      icon: Sparkles,
    },
  ];

  const publicationCollections = [
    {
      label: "Total blogs",
      value: stats.totalBlogs,
    },
    {
      label: "Published blogs",
      value: stats.publishedBlogs,
    },
    {
      label: "Featured blogs",
      value: stats.featuredBlogs,
    },
    {
      label: "Duas",
      value: stats.totalDuas,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/70 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-8">
        {/* Header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                Al-Munji Administration
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
              Dashboard Overview
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Monitor your platform, manage content, and review key statistics.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-60 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 sm:self-auto"
          >
            {isFetching ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Refresh statistics
          </button>
        </header>

        {/* Platform status banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 p-6 text-white shadow-lg shadow-emerald-950/10 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-24 size-72 rounded-full border-[36px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-28 right-40 size-56 rounded-full bg-white/5 blur-2xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-50">
                <Activity className="size-3.5" />
                Platform summary
              </div>

              <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
                Your platform at a glance
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80">
                Your Quran resources, user accounts, digital library, and
                community bookmarks in one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-72">
              <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <Users className="size-5 text-emerald-100" />
                <p className="mt-3 text-2xl font-bold">
                  {formatNumber(stats.totalUsers)}
                </p>
                <p className="mt-1 text-xs text-emerald-50/80">
                  Registered users
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <BookOpen className="size-5 text-emerald-100" />
                <p className="mt-3 text-2xl font-bold">
                  {formatNumber(
                    stats.totalSurahs + stats.totalParas + stats.totalAyahs,
                  )}
                </p>
                <p className="mt-1 text-xs text-emerald-50/80">Quran records</p>
              </div>
            </div>
          </div>
        </section>

        {/* Primary statistics */}
        <section>
          <SectionHeading
            title="Key metrics"
            description="An overview of your most important platform statistics."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total users"
              value={stats.totalUsers}
              description="All registered platform accounts"
              icon={Users}
              color="bg-blue-50 dark:bg-blue-950/30"
              iconColor="text-blue-600 dark:text-blue-400"
            />

            <StatCard
              title="Active users"
              value={stats.activeUsers}
              description={`${userPercentage}% of registered users are active`}
              icon={ShieldCheck}
              color="bg-emerald-50 dark:bg-emerald-950/30"
              iconColor="text-emerald-600 dark:text-emerald-400"
            />

            <StatCard
              title="Total dictionaries"
              value={stats.totalDictionaries}
              description={`${formatNumber(stats.activeDictionaries)} active dictionary entries`}
              icon={Library}
              color="bg-violet-50 dark:bg-violet-950/30"
              iconColor="text-violet-600 dark:text-violet-400"
            />

            <StatCard
              title="Total bookmarks"
              value={stats.totalBookmarks}
              description={`${formatNumber(totalBookmarkedItems)} bookmarked Ayahs and Duas`}
              icon={Bookmark}
              color="bg-amber-50 dark:bg-amber-950/30"
              iconColor="text-amber-600 dark:text-amber-400"
            />
          </div>
        </section>

        {/* Quran and user analytics */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {/* Quran content */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6 xl:col-span-2">
            <SectionHeading
              title="Quran content"
              description="Your primary Quran resources and their current record counts."
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {contentCollections.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 transition hover:border-emerald-200 hover:bg-gray-50/70 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  >
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                    >
                      <Icon className={`size-5 ${item.iconColor}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(item.value)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl bg-emerald-50/80 p-4 dark:bg-emerald-950/20">
              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 size-5 shrink-0 text-emerald-700 dark:text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-300">
                    Quran resource overview
                  </p>
                  <p className="mt-1 text-xs leading-5 text-emerald-800/80 dark:text-emerald-400/80">
                    {formatNumber(stats.totalSurahs)} Surahs,{" "}
                    {formatNumber(stats.totalParas)} Paras, and{" "}
                    {formatNumber(stats.totalAyahs)} Ayahs are currently
                    recorded in your database.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User account status */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <SectionHeading
              title="User status"
              description="Account distribution across current statuses."
            />

            <div className="flex justify-center py-4">
              <div
                className="relative flex size-44 items-center justify-center rounded-full"
                style={{
                  background:
                    stats.totalUsers > 0
                      ? `conic-gradient(#059669 0% ${userPercentage}%, #e5e7eb ${userPercentage}% 100%)`
                      : "#e5e7eb",
                }}
                role="img"
                aria-label={`${userPercentage}% active users`}
              >
                <div className="flex size-32 flex-col items-center justify-center rounded-full bg-white dark:bg-gray-900">
                  <span className="text-3xl font-bold text-gray-950 dark:text-white">
                    {userPercentage}%
                  </span>
                  <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Active users
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-2.5 rounded-full bg-emerald-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Active
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.activeUsers)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-2.5 rounded-full bg-gray-300" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Blocked
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.blockedUsers)}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total accounts
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatNumber(stats.totalUsers)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Library and publications */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <SectionHeading
              title="Digital library"
              description="Books, categories, and published book content."
            />

            <div className="space-y-5">
              {libraryCollections.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                        <Icon className="size-5 text-gray-600 dark:text-gray-300" />
                      </div>

                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {item.label}
                      </span>
                    </div>

                    <span className="text-lg font-bold tabular-nums text-gray-900 dark:text-white">
                      {formatNumber(item.value)}
                    </span>
                  </div>
                );
              })}
            </div>

            {stats.totalBooks === 0 && (
              <div className="mt-5 rounded-xl border border-dashed border-amber-300 bg-amber-50/70 p-4 dark:border-amber-900 dark:bg-amber-950/20">
                <div className="flex gap-3">
                  <CircleAlert className="size-5 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                      No books added yet
                    </p>
                    <p className="mt-1 text-xs leading-5 text-amber-800/80 dark:text-amber-400/80">
                      Your library has {formatNumber(stats.totalBookCategories)}{" "}
                      categories. Add books to start building your digital
                      collection.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <SectionHeading
              title="Publications & duas"
              description="Publication status and available community resources."
            />

            <div className="space-y-5">
              {publicationCollections.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {item.label}
                  </span>
                  <span className="text-lg font-bold tabular-nums text-gray-900 dark:text-white">
                    {formatNumber(item.value)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-5 border-t border-gray-100 pt-5 dark:border-gray-800">
              <ProgressRow
                label="Active dictionaries"
                value={stats.activeDictionaries}
                maxValue={stats.totalDictionaries}
                color="bg-emerald-500"
              />

              <ProgressRow
                label="Published blogs"
                value={stats.publishedBlogs}
                maxValue={stats.totalBlogs}
                color="bg-blue-500"
              />
            </div>

            <p className="mt-4 text-xs text-gray-400">
              {dictionaryPercentage}% of dictionary entries are active.
              {stats.totalBlogs > 0
                ? ` ${publishedPercentage}% of blogs are published.`
                : " No blogs have been recorded yet."}
            </p>
          </div>
        </section>

        {/* Engagement and content health */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <SectionHeading
              title="Bookmark engagement"
              description="A breakdown of saved resources and bookmark records."
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-950/20">
                <Bookmark className="size-5 text-amber-600" />
                <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(stats.totalBookmarks)}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Total bookmarks
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
                <BookOpen className="size-5 text-emerald-600" />
                <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(stats.bookmarkedAyahs)}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Bookmarked Ayahs
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/20">
                <Heart className="size-5 text-blue-600" />
                <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(stats.bookmarkedDuas)}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Bookmarked Duas
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Total bookmarks represent the API&apos;s overall bookmark count.
              Ayah and Dua counts are displayed separately and are not assumed
              to account for every bookmark.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <SectionHeading
              title="Content health"
              description="A quick view of resource availability and areas to review."
            />

            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl bg-emerald-50/70 p-4 dark:bg-emerald-950/20">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Dictionary coverage
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-400">
                    {formatNumber(stats.activeDictionaries)} of{" "}
                    {formatNumber(stats.totalDictionaries)} dictionary entries
                    are active.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-blue-50/70 p-4 dark:bg-blue-950/20">
                <FileText className="mt-0.5 size-5 shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Blog publishing
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-400">
                    {formatNumber(stats.publishedBlogs)} published out of{" "}
                    {formatNumber(stats.totalBlogs)} total blogs, with{" "}
                    {formatNumber(stats.featuredBlogs)} featured.
                  </p>
                </div>
              </div>

              {stats.totalBooks === 0 || stats.totalTafsirs === 0 ? (
                <div className="flex items-start gap-3 rounded-xl bg-amber-50/70 p-4 dark:bg-amber-950/20">
                  <CircleAlert className="mt-0.5 size-5 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Content needs attention
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-400">
                      {[
                        stats.totalBooks === 0 ? "Books" : null,
                        stats.totalTafsirs === 0 ? "Tafsirs" : null,
                      ]
                        .filter(Boolean)
                        .join(" and ")}{" "}
                      currently have no records. Review these collections if
                      they are expected to be available.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-xl bg-emerald-50/70 p-4 dark:bg-emerald-950/20">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Content collections available
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-400">
                      Books and Tafsir records are present in the database.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col justify-between gap-2 border-t border-gray-200 pt-5 text-xs text-gray-400 dark:border-gray-800 sm:flex-row sm:items-center">
          <p>Almunji · Administration Dashboard</p>
          <p className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Statistics loaded from your dashboard API
          </p>
        </footer>
      </div>
    </div>
  );
}
