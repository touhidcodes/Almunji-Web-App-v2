import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Award,
  Globe,
  GraduationCap,
  Shield,
  Calendar,
} from "lucide-react";

const FeaturedSection = () => {
  const instructorStats = [
    { number: "25+", label: "Expert Instructors", icon: Users },
    { number: "150+", label: "Years Combined Experience", icon: Calendar },
    { number: "50K+", label: "Students Taught", icon: GraduationCap },
    { number: "15+", label: "Countries Represented", icon: Globe },
  ];

  return (
    <div className="py-20 bg-linear-to-br from-slate-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full mb-8 shadow-xl">
            <Award className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Learn from{" "}
            <span className="text-emerald-600">Renowned Scholars</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Our world-class instructors are qualified Islamic scholars with
            decades of experience, dedicated to authentic Islamic education and
            student success.
          </p>
        </div>

        {/* Instructor Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {instructorStats.map((stat, index) => (
            <Card
              key={index}
              className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-hidden group"
            >
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-emerald-100 to-teal-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-2">
                  {stat.number}
                </h3>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white p-12 rounded-3xl shadow-xl">
          <Shield className="h-16 w-16 text-emerald-600 mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-slate-800 mb-4">
            Learn from the <span className="text-emerald-600">Best</span>
          </h3>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Our instructors are carefully selected based on their Islamic
            scholarship, teaching excellence, and commitment to authentic
            Islamic education.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection;
