import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Heart,
  Users,
  Globe,
  Star,
  ArrowRight,
  Award,
  Target,
  Lightbulb,
  Shield,
} from "lucide-react";

const AboutPage = () => {
  const stats = [
    { number: "50K+", label: "Active Learners", icon: Users },
    { number: "100+", label: "Courses Available", icon: BookOpen },
    { number: "25+", label: "Countries Reached", icon: Globe },
    { number: "4.9/5", label: "User Rating", icon: Star },
  ];

  const values = [
    {
      title: "Excellence in Education",
      description:
        "We strive to provide the highest quality Islamic education through innovative teaching methods and authentic scholarship.",
      icon: Award,
      color: "from-emerald-400 to-teal-500",
    },
    {
      title: "Authentic Knowledge",
      description:
        "All our content is carefully reviewed by qualified Islamic scholars to ensure accuracy and authenticity.",
      icon: Shield,
      color: "from-teal-400 to-cyan-500",
    },
    {
      title: "Innovation & Accessibility",
      description:
        "We leverage modern technology to make Islamic learning accessible to everyone, anywhere in the world.",
      icon: Lightbulb,
      color: "from-cyan-400 to-blue-500",
    },
    {
      title: "Community Impact",
      description:
        "Building a global community of learners who support each other in their spiritual and educational journey.",
      icon: Target,
      color: "from-blue-400 to-indigo-500",
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Ahmad Hassan",
      role: "Founder & Chief Scholar",
      specialty: "Quranic Studies & Tafseer",
      experience: "20+ Years",
    },
    {
      name: "Prof. Fatima Al-Zahra",
      role: "Head of Curriculum",
      specialty: "Islamic History & Jurisprudence",
      experience: "15+ Years",
    },
    {
      name: "Imam Mohammed Rashid",
      role: "Senior Instructor",
      specialty: "Hadith Studies & Arabic Language",
      experience: "18+ Years",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-8 shadow-xl">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            About <span className="text-emerald-600">Almunji</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Empowering hearts and minds through authentic Islamic education. We
            bridge traditional scholarship with modern learning to make the
            beauty of Islam accessible to everyone.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-hidden group"
            >
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
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
      </div>

      {/* Mission Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-6">
                Our <span className="text-emerald-600">Mission</span>
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                At Almunji, we believe that authentic Islamic knowledge should
                be accessible to every Muslim, regardless of their geographical
                location or background. Our mission is to preserve and share the
                timeless wisdom of Islam through innovative educational
                platforms.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                We combine traditional Islamic scholarship with cutting-edge
                technology to create immersive learning experiences that
                inspire, educate, and transform lives.
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Learn More About Our Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl shadow-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <Heart className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Spreading Knowledge</h3>
                  <p className="text-emerald-100 mt-2">
                    With Love & Dedication
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Our <span className="text-emerald-600">Core Values</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Almunji
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white rounded-2xl overflow-hidden"
              >
                <CardContent className="p-8">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Meet Our <span className="text-emerald-600">Scholars</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Distinguished Islamic scholars and educators dedicated to
              authentic knowledge sharing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-hidden group"
              >
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-emerald-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-slate-600 mb-2">{member.specialty}</p>
                  <p className="text-sm text-slate-500">{member.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join Our Learning Community
          </h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Start your journey of Islamic learning today. Discover courses that
            will deepen your understanding and strengthen your faith.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Explore Courses
              <BookOpen className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-3 rounded-full font-semibold transition-all duration-300"
            >
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
