"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  MapPin,
  Scale,
  Layers,
  Sparkles,
} from "lucide-react";

interface LearningCard {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: React.ElementType;
  linear: string;
  accentColor: string;
}

const IslamicLearningSection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const learningCards: LearningCard[] = [
    {
      id: 1,
      title: "Where Was Islam Created & First Established?",
      description:
        "In this world, Islam is the major world religion promulgated by the Prophet Muhammad in...",
      category: "History",
      icon: BookOpen,
      linear: "from-emerald-500 to-teal-600",
      accentColor: "emerald",
    },
    {
      id: 2,
      title: "Where Is The Birthplace of Islam?",
      description:
        "Here are five basic about religion in Jesus Christ in... a locality that is the birthplace of Islam.",
      category: "Geography",
      icon: MapPin,
      linear: "from-cyan-500 to-blue-600",
      accentColor: "cyan",
    },
    {
      id: 3,
      title: "What Is Taqiyya In Islam? (Correct answer)",
      description:
        "Taqiyya is the Islamic practice of concealing one's belief and forestalling religious...",
      category: "Theology",
      icon: Layers,
      linear: "from-violet-500 to-purple-600",
      accentColor: "violet",
    },
    {
      id: 4,
      title: "What Is A Wakil In Islam? (Solution)",
      description:
        "Learn What is a Wakil in the Sharia law. Wakil is an attorney, agent, and a trustee. The term...",
      category: "Law",
      icon: Scale,
      linear: "from-amber-500 to-orange-600",
      accentColor: "amber",
    },
  ];

  return (
    <div className="relative bg-linear-to-br from-slate-50 via-emerald-50/30 to-teal-50/50 py-20 px-4 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-200 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-20 w-80 h-80 bg-teal-200 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Knowledge Center</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight">
              Learn Quran & Basics
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">
                knowledge of Islam
              </span>
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl">
              Explore authentic Islamic teachings, history, and wisdom through
              our comprehensive collection of articles and guides.
            </p>
          </div>
          <Button className="bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold px-8 py-6 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 whitespace-nowrap">
            <BookOpen className="mr-2 h-5 w-5" />
            Read All Blog
          </Button>
        </div>

        {/* Learning Cards - New Modern Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {learningCards.map((card) => {
            const IconComponent = card.icon;
            const isHovered = hoveredCard === card.id;

            return (
              <div
                key={card.id}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative"
              >
                {/* Main Card Container */}
                <div
                  className={`relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${
                    isHovered ? "transform scale-[1.02]" : ""
                  }`}
                >
                  {/* linear Background Bar */}
                  <div className={`h-2 bg-linear-to-r ${card.linear}`}></div>

                  <div className="p-8">
                    {/* Header with Icon and Category */}
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={`relative p-4 bg-linear-to-br ${
                          card.linear
                        } rounded-2xl shadow-lg transform transition-all duration-500 ${
                          isHovered ? "scale-110 rotate-3" : ""
                        }`}
                      >
                        <IconComponent className="h-8 w-8 text-white" />
                        {/* Glow effect */}
                        <div
                          className={`absolute inset-0 bg-linear-to-br ${card.linear} rounded-2xl blur-xl opacity-50 -z-10`}
                        ></div>
                      </div>

                      <span
                        className={`px-4 py-2 bg-${card.accentColor}-100 text-${card.accentColor}-700 text-sm font-semibold rounded-full`}
                      >
                        {card.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-2xl text-slate-900 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-emerald-600 group-hover:to-teal-600 transition-all duration-300">
                        {card.title}
                      </h3>

                      <p className="text-slate-600 text-base leading-relaxed line-clamp-2">
                        {card.description}
                      </p>

                      {/* Read More Button */}
                      <div className="pt-4">
                        <button
                          className={`inline-flex items-center space-x-2 text-${card.accentColor}-600 hover:text-${card.accentColor}-700 font-semibold text-base group/btn transition-all duration-300`}
                        >
                          <span>Read Full Article</span>
                          <ArrowRight
                            className={`h-5 w-5 transition-all duration-300 ${
                              isHovered ? "translate-x-2" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom decorative line */}
                  <div
                    className={`h-1 bg-linear-to-r ${
                      card.linear
                    } transform origin-left transition-transform duration-500 ${
                      isHovered ? "scale-x-100" : "scale-x-0"
                    }`}
                  ></div>
                </div>

                {/* Animated corner accent */}
                <div
                  className={`absolute -top-2 -right-2 w-20 h-20 bg-linear-to-br ${card.linear} rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-linear-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Deepen Your Knowledge?
            </h3>
            <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
              Explore our complete library of Islamic articles, guides, and
              resources to strengthen your faith and understanding.
            </p>
            <Button className="bg-white hover:bg-gray-50 text-emerald-600 px-10 py-6 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IslamicLearningSection;
