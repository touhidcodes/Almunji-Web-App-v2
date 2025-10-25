"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Play,
  Book,
  Sparkles,
  Users,
  Heart,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const HeroSection = () => {
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-900 via-teal-900 to-emerald-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Islamic Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-linear(circle at 25px 25px, white 2%, transparent 0%), radial-linear(circle at 75px 75px, white 2%, transparent 0%)`,
          backgroundSize: "100px 100px",
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-white">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 shadow-xl">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="text-sm font-semibold tracking-wide">
                Spiritual Growth Platform
              </span>
            </div>

            {/* Main Heading with linear */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-linear-to-r from-white via-teal-100 to-emerald-200 bg-clip-text text-transparent">
                  Journey Through
                </span>
                <br />
                <span className="bg-linear-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent flex items-center gap-4">
                  The Holy Quran
                  <span className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-yellow-400 to-amber-500 rounded-2xl shadow-2xl transform hover:rotate-12 transition-transform duration-300">
                    <span className="text-3xl">☪</span>
                  </span>
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-teal-100 leading-relaxed max-w-xl font-light">
                Experience the divine wisdom with beautiful recitations,
                translations, and deep spiritual insights at your fingertips.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="group relative bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-10 py-7 text-lg rounded-2xl font-bold shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 border-2 border-white/20 overflow-hidden">
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                <span className="relative flex items-center gap-3">
                  <Book className="w-6 h-6" />
                  Start Reading Now
                </span>
              </Button>

              <Button className="group bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-7 text-lg rounded-2xl font-bold border-2 border-white/30 transition-all duration-300 shadow-xl">
                <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Listen to Recitation
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <Users className="w-5 h-5 text-yellow-300" />
                  <p className="text-3xl font-bold text-white">2M+</p>
                </div>
                <p className="text-sm text-teal-200">Active Users</p>
              </div>
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <Heart className="w-5 h-5 text-rose-400" />
                  <p className="text-3xl font-bold text-white">500K+</p>
                </div>
                <p className="text-sm text-teal-200">5-Star Reviews</p>
              </div>
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <Download className="w-5 h-5 text-emerald-300" />
                  <p className="text-3xl font-bold text-white">5M+</p>
                </div>
                <p className="text-sm text-teal-200">Downloads</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-6 h-6 fill-yellow-400 text-yellow-400 drop-shadow-lg"
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-white">4.9/5</span>
                <span className="text-sm text-teal-200">Rated by millions</span>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Cards */}
          <div className="relative h-[600px] lg:h-[700px]">
            {/* Main Feature Card */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Glowing Effect */}
                <div className="absolute inset-0 bg-linear-to-r from-teal-400 to-emerald-400 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>

                {/* Main Card */}
                <div className="relative bg-linear-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 transform hover:scale-105 transition-all duration-500">
                  {/* Islamic Pattern Header */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-linear-to-br from-teal-400 to-emerald-500 rounded-2xl blur-xl opacity-60"></div>
                      <div className="relative bg-linear-to-br from-teal-600 to-emerald-600 rounded-2xl p-8 shadow-2xl">
                        <div className="text-7xl text-white drop-shadow-2xl">
                          ☪
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arabic Calligraphy Style */}
                  <div className="space-y-6 mb-8">
                    <div className="text-center space-y-3">
                      <h3 className="text-3xl font-bold bg-linear-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">
                        القرآن الكريم
                      </h3>
                      <div className="h-1 w-32 mx-auto bg-linear-to-r from-transparent via-teal-500 to-transparent rounded-full"></div>
                      <p className="text-gray-600 text-lg font-medium">
                        The Noble Quran
                      </p>
                    </div>

                    {/* Quran Pages Mockup */}
                    <div className="bg-linear-to-br from-slate-50 to-teal-50 rounded-2xl p-6 shadow-inner">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            1
                          </div>
                          <div className="flex-1 h-1 bg-linear-to-r from-teal-200 to-transparent rounded"></div>
                        </div>
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="h-2 bg-linear-to-r from-slate-300 to-slate-200 rounded-full animate-pulse"
                            style={{
                              width: `${Math.random() * 30 + 70}%`,
                              animationDelay: `${i * 100}ms`,
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Features Pills */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["Audio", "Translation", "Tafsir", "Bookmarks"].map(
                      (feature, idx) => (
                        <Badge
                          key={feature}
                          className={`px-4 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 ${
                            activeCard === idx % 3
                              ? "bg-linear-to-r from-teal-500 to-emerald-500 text-white scale-110"
                              : "bg-white/80 text-gray-700 hover:bg-teal-50"
                          }`}
                        >
                          {feature}
                        </Badge>
                      )
                    )}
                  </div>
                </div>

                {/* Floating Mini Cards */}
                <div className="absolute -top-8 -left-8 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/50 transform hover:scale-110 transition-all duration-300 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl shadow-lg">
                      🎧
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Premium Audio
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        50+ Reciters
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-8 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/50 transform hover:scale-110 transition-all duration-300 animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl shadow-lg">
                      🌍
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Translations
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        100+ Languages
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 -right-12 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/50 transform hover:scale-110 transition-all duration-300 animate-float-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xl shadow-lg">
                      📖
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Daily Reading
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        Track Progress
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-20 h-20 border-4 border-teal-400/30 rounded-full animate-spin-slow"></div>
            <div className="absolute bottom-20 left-10 w-16 h-16 border-4 border-emerald-400/30 rounded-full animate-spin-slow delay-1000"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-slow {
          animation: float 4s ease-in-out infinite;
          animation-delay: 2s;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
