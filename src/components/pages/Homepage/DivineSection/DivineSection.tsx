"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Heart, Sparkles } from "lucide-react";

const DivineSection: React.FC = () => {
  const [hoveredElement, setHoveredElement] = useState<number | null>(null);

  const quranFeatures = [
    { icon: BookOpen, text: "Divine Revelation" },
    { icon: Star, text: "Timeless Wisdom" },
    { icon: Heart, text: "Spiritual Guidance" },
    { icon: Sparkles, text: "Universal Truth" },
  ];

  return (
    <div className="bg-linear-to-b from-amber-50 to-orange-50 py-20 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Interactive Visual Element */}
          <div className="relative">
            <div className="bg-linear-to-br from-amber-100 via-orange-100 to-amber-200 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              {/* Animated background pattern */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <pattern
                      id="islamic-pattern"
                      x="0"
                      y="0"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="1"
                        fill="currentColor"
                        className="text-amber-600"
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r="1"
                        fill="currentColor"
                        className="text-amber-600"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="1"
                        fill="currentColor"
                        className="text-amber-600"
                      />
                    </pattern>
                    <rect
                      x="0"
                      y="0"
                      width="100"
                      height="100"
                      fill="url(#islamic-pattern)"
                    />
                  </svg>
                </div>
              </div>

              {/* Central Quran representation */}
              <div className="relative z-10 flex items-center justify-center min-h-[500px]">
                <div className="relative group">
                  {/* Glowing effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-amber-400 to-orange-400 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

                  {/* Book container */}
                  <div className="relative bg-linear-to-br from-amber-600 to-orange-700 rounded-2xl p-8 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                    <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-6 min-h-[400px] flex flex-col items-center justify-center space-y-6">
                      {/* Islamic calligraphy representation */}
                      <div className="text-6xl font-serif text-amber-800 mb-4">
                        بِسْمِ
                      </div>
                      <div className="text-4xl font-serif text-orange-700">
                        اللَّهِ
                      </div>

                      {/* Decorative lines */}
                      <div className="w-full space-y-3 mt-8">
                        <div className="h-1 bg-linear-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>
                        <div className="h-1 bg-linear-to-r from-transparent via-orange-400 to-transparent rounded-full"></div>
                        <div className="h-1 bg-linear-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>
                      </div>

                      {/* Feature icons */}
                      <div className="grid grid-cols-2 gap-4 mt-8 w-full">
                        {quranFeatures.map((feature, index) => {
                          const IconComponent = feature.icon;
                          return (
                            <div
                              key={index}
                              onMouseEnter={() => setHoveredElement(index)}
                              onMouseLeave={() => setHoveredElement(null)}
                              className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-300 cursor-pointer"
                            >
                              <IconComponent
                                className={`h-6 w-6 transition-all duration-300 ${
                                  hoveredElement === index
                                    ? "text-amber-600 scale-125"
                                    : "text-amber-700"
                                }`}
                              />
                              <span className="text-xs text-amber-900 font-medium text-center">
                                {feature.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Corner decorations */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-amber-300 rounded-tl-xl"></div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-amber-300 rounded-tr-xl"></div>
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-amber-300 rounded-bl-xl"></div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-amber-300 rounded-br-xl"></div>
                  </div>
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-yellow-300 rounded-full opacity-40 animate-pulse"></div>
              <div
                className="absolute bottom-8 left-8 w-16 h-16 bg-orange-300 rounded-full opacity-50 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-1/2 right-12 w-12 h-12 bg-amber-300 rounded-full opacity-30 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-amber-200 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <BookOpen className="h-4 w-4" />
              <span>The Noble Quran</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Your Source of
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-600 to-orange-600">
                Divine Guidance
              </span>
              <br />
              and Wisdom
            </h2>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg">
                The Quran is not just a book; it is the ultimate source of
                guidance for millions of people around the world.
              </p>

              <p className="text-gray-600 leading-relaxed">
                Revealed over 1,400 years ago, the Quran is a timeless and
                universal scripture that offers profound insights into the human
                condition, morality, spirituality, and the nature of the
                universe. It is the word of Allah, as conveyed to humanity
                through the Prophet Muhammad (peace be upon him).
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">114</div>
                <div className="text-sm text-gray-600">Chapters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">6,236</div>
                <div className="text-sm text-gray-600">Verses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-700">1,400+</div>
                <div className="text-sm text-gray-600">Years</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Learn More
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
              <Button className="bg-white hover:bg-gray-50 text-amber-700 border-2 border-amber-300 px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Start Reading
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DivineSection;
