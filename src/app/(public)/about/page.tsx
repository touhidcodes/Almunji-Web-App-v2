import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  BookOpenText,
  Bookmark,
  Check,
  Compass,
  Heart,
  Library,
  MessageCircleHeart,
  Search,
  Sparkles,
  Sprout,
} from "lucide-react";

const resources = [
  {
    number: "01",
    title: "The Holy Quran",
    description:
      "Explore Surahs and Quranic verses through a dedicated reading experience designed for focus and reflection.",
    href: "/surahs",
    label: "Explore Quran",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Islamic Books",
    description:
      "Discover a growing collection of Islamic books and educational reading materials in one place.",
    href: "/books",
    label: "Browse books",
    icon: Library,
  },
  {
    number: "03",
    title: "Daily Duas",
    description:
      "Find duas with Arabic text, transliteration, translations, and references to support your daily practice.",
    href: "/duas",
    label: "Explore duas",
    icon: Heart,
  },
  {
    number: "04",
    title: "Islamic Dictionary",
    description:
      "Explore Islamic and Quranic terminology to improve your understanding of important words and meanings.",
    href: "/dictionary",
    label: "Explore dictionary",
    icon: BookMarked,
  },
];

const principles = [
  {
    title: "Knowledge with Purpose",
    description:
      "Make useful Islamic knowledge easier to explore, understand, and revisit.",
    icon: Sprout,
  },
  {
    title: "Accessible Learning",
    description:
      "Create a welcoming digital experience where learning resources are easy to find and use.",
    icon: Compass,
  },
  {
    title: "A Thoughtful Experience",
    description:
      "Keep the reading and learning experience simple, organized, and focused on the content.",
    icon: Heart,
  },
];

const features = [
  "Explore Quranic Surahs and verses",
  "Read Islamic books and learning materials",
  "Access duas with translations",
  "Discover Islamic terminology",
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#FCFCF8] text-[#193C32]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#123D32]">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #D6B76C 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute -right-40 -top-48 h-[500px] w-[500px] rounded-full border border-[#D6B76C]/20"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-32 h-[350px] w-[350px] rounded-full border border-[#D6B76C]/20"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-64 -left-32 h-[480px] w-[480px] rounded-full bg-[#2D6652]/30 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 sm:px-8 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:py-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D6B76C]/30 bg-white/[0.06] px-4 py-2 text-xs font-medium tracking-[0.16em] text-[#E8D29A] uppercase">
              <Sparkles size={14} />
              Welcome to Almunji
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.18] tracking-tight text-white sm:text-5xl lg:text-6xl">
              A place to explore,
              <span className="block font-serif italic text-[#DCC58D]">
                learn & reflect.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#D5E3DB] sm:text-lg">
              Almunji is a digital space for exploring Quranic knowledge,
              Islamic books, duas, and useful learning resources — bringing
              meaningful knowledge closer to everyday life.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/surahs"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D6B76C] px-6 py-3.5 text-sm font-semibold text-[#193C32] transition hover:bg-[#E7CE91]"
              >
                Explore the Quran
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/books"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-medium text-white transition hover:border-[#D6B76C] hover:bg-white/10"
              >
                Discover our library
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-3 border-t border-white/15 pt-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D6B76C]/15 text-[#E8D29A]">
                <BookOpenText size={20} />
              </div>
              <p className="text-sm leading-6 text-[#D5E3DB]">
                Read. Understand. Reflect.
                <span className="block text-xs text-[#D6B76C]">
                  A meaningful journey of learning.
                </span>
              </p>
            </div>
          </div>

          {/* Decorative Quran-inspired composition */}
          <div className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center">
            <div className="absolute inset-5 rounded-full border border-[#D6B76C]/20" />
            <div className="absolute inset-12 rounded-full border border-[#D6B76C]/30" />
            <div className="absolute inset-[72px] rounded-full border border-dashed border-[#D6B76C]/30" />

            <div className="relative flex h-64 w-64 items-center justify-center rounded-[2rem] border border-[#D6B76C]/40 bg-gradient-to-br from-[#275B48] to-[#153D32] shadow-2xl shadow-black/20 sm:h-72 sm:w-72">
              <div className="absolute inset-3 rounded-[1.5rem] border border-[#D6B76C]/20" />

              <div className="relative text-center">
                <BookOpenText
                  className="mx-auto mb-5 text-[#D6B76C]"
                  size={72}
                  strokeWidth={1}
                />
                <p
                  lang="ar"
                  dir="rtl"
                  className="font-serif text-5xl leading-relaxed text-[#F0DDA9]"
                >
                  اقرأ
                </p>
                <div className="mx-auto mt-4 h-px w-16 bg-[#D6B76C]/60" />
                <p className="mt-3 text-xs tracking-[0.3em] text-[#D5E3DB] uppercase">
                  Seek Knowledge
                </p>
              </div>
            </div>

            <div className="absolute left-1 top-1/4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D6B76C]/30 bg-[#1D4C3C] text-[#E8D29A] shadow-lg">
              <BookOpen size={25} />
            </div>

            <div className="absolute bottom-1/4 right-0 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D6B76C]/30 bg-[#1D4C3C] text-[#E8D29A] shadow-lg">
              <Heart size={24} />
            </div>

            <div className="absolute right-8 top-6 flex h-10 w-10 items-center justify-center rounded-xl bg-[#D6B76C] text-[#193C32] shadow-lg">
              <Sparkles size={19} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#D6B76C]/60 to-transparent" />
      </section>

      {/* Introduction */}
      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-[#A98443] uppercase">
              About Almunji
            </span>

            <h2 className="mt-5 max-w-xl font-serif text-3xl leading-tight text-[#193C32] sm:text-4xl lg:text-5xl">
              Making Islamic knowledge easier to explore.
            </h2>

            <div className="mt-7 h-1 w-16 rounded-full bg-[#D6B76C]" />

            <p className="mt-7 text-[15px] leading-8 text-[#64756D]">
              Almunji brings together useful Islamic learning resources in a
              single digital platform. Whether you want to read the Quran,
              discover Islamic books, explore duas, or understand important
              terminology, Almunji provides a simple place to begin.
            </p>

            <p className="mt-4 text-[15px] leading-8 text-[#64756D]">
              Our goal is to make these resources more accessible through an
              organized, comfortable, and user-friendly experience.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-5 -top-5 h-28 w-28 rounded-tl-[3rem] border-l-2 border-t-2 border-[#D6B76C]/70" />

            <div className="relative rounded-[2rem] bg-[#EDF2EB] p-7 sm:p-10">
              <div className="rounded-2xl border border-[#D7E2D8] bg-[#FCFCF8] p-7 shadow-sm sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E6EFE7] text-[#246047]">
                  <MessageCircleHeart size={25} />
                </div>

                <h3 className="mt-6 font-serif text-2xl text-[#193C32]">
                  Knowledge for everyday life
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#64756D]">
                  A thoughtful collection of resources to help you discover,
                  revisit, and engage with Islamic knowledge at your own pace.
                </p>

                <div className="mt-7 flex items-center gap-3 border-t border-[#E4E9E1] pt-5">
                  <div className="h-2 w-2 rounded-full bg-[#C5A45D]" />
                  <span className="text-xs font-medium tracking-wide text-[#557366]">
                    Explore at your own pace
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-4 h-24 w-24 rounded-br-[3rem] border-b-2 border-r-2 border-[#D6B76C]/70" />
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="bg-[#F0F4EF] px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#A98443] uppercase">
              Explore Almunji
            </span>

            <h2 className="mt-4 font-serif text-3xl text-[#193C32] sm:text-4xl">
              Everything in one place
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#64756D] sm:text-base">
              Discover the resources available on Almunji and find something
              meaningful to explore.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((resource) => {
              const Icon = resource.icon;

              return (
                <Link
                  key={resource.number}
                  href={resource.href}
                  className="group flex min-h-[300px] flex-col rounded-2xl border border-[#DFE8DE] bg-[#FCFCF8] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#B7CDBB] hover:shadow-xl hover:shadow-[#193C32]/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-widest text-[#B39A62]">
                      {resource.number}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E9F0E8] text-[#246047] transition group-hover:bg-[#193C32] group-hover:text-[#E8D29A]">
                      <Icon size={23} strokeWidth={1.7} />
                    </div>
                  </div>

                  <h3 className="mt-8 text-xl font-semibold text-[#193C32]">
                    {resource.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-7 text-[#718078]">
                    {resource.description}
                  </p>

                  <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-[#246047]">
                    {resource.label}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#173F33]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden p-10 sm:p-14">
              <div className="absolute inset-0 opacity-20">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, #D6B76C 1px, transparent 0)",
                    backgroundSize: "28px 28px",
                  }}
                />
              </div>

              <div className="relative text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] border border-[#D6B76C]/40 bg-white/[0.06] text-[#E8D29A]">
                  <Compass size={45} strokeWidth={1.2} />
                </div>

                <p className="mt-7 font-serif text-3xl text-white">
                  Our Mission
                </p>

                <p className="mt-2 text-sm text-[#D6B76C]">
                  A meaningful learning experience
                </p>
              </div>
            </div>

            <div className="p-8 sm:p-12 lg:p-14">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#D6B76C] uppercase">
                What guides us
              </span>

              <h2 className="mt-5 max-w-xl font-serif text-3xl leading-tight text-white sm:text-4xl">
                Bringing knowledge closer to everyday life.
              </h2>

              <p className="mt-6 text-sm leading-8 text-[#D5E3DB]">
                We aim to build a welcoming digital platform where people can
                access useful Islamic resources without unnecessary complexity.
                Every part of the experience is designed around discoverability,
                readability, and ease of use.
              </p>

              <div className="mt-8 space-y-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D6B76C]/15 text-[#E8D29A]">
                      <Check size={13} />
                    </div>

                    <p className="text-sm text-[#E1EAE3]">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core principles */}
      <section className="bg-[#F8F7F0] px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#A98443] uppercase">
              Our approach
            </span>

            <h2 className="mt-4 font-serif text-3xl text-[#193C32] sm:text-4xl">
              Principles behind the experience
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#64756D] sm:text-base">
              The values that shape how we organize and present learning
              resources.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {principles.map((principle, index) => {
              const Icon = principle.icon;

              return (
                <div
                  key={principle.title}
                  className="relative rounded-2xl border border-[#E6E7DA] bg-[#FCFCF8] p-8"
                >
                  <span className="absolute right-7 top-7 font-serif text-3xl text-[#D6B76C]/50">
                    0{index + 1}
                  </span>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E9F0E8] text-[#246047]">
                    <Icon size={27} strokeWidth={1.6} />
                  </div>

                  <h3 className="mt-7 text-xl font-semibold text-[#193C32]">
                    {principle.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#718078]">
                    {principle.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#EAF0E7] px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-[#B9C9B5]/50"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full border border-[#B9C9B5]/50"
          />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCE9DB] text-[#246047]">
              <BookOpenText size={27} />
            </div>

            <h2 className="mt-7 font-serif text-3xl leading-tight text-[#193C32] sm:text-4xl lg:text-5xl">
              Begin your journey of discovery.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#64756D] sm:text-base">
              Explore Quranic resources, discover Islamic books, and make space
              for learning and reflection with Almunji.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/surahs"
                className="inline-flex items-center gap-2 rounded-full bg-[#193F33] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#245A45]"
              >
                Start exploring
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/duas"
                className="inline-flex items-center gap-2 rounded-full border border-[#B8CABB] bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#193C32] transition hover:border-[#193F33] hover:bg-white"
              >
                Explore duas
                <Heart size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
