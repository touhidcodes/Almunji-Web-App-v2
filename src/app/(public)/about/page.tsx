import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Globe,
  Heart,
  Lightbulb,
  Quote,
  Shield,
  Sparkles,
  Star,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";

const AboutPage = () => {
  const [activeValue, setActiveValue] = useState(null);

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
      gradient: "from-emerald-500 via-emerald-600 to-teal-600",
      lightBg: "from-emerald-50 to-teal-50",
    },
    {
      title: "Authentic Knowledge",
      description:
        "All our content is carefully reviewed by qualified Islamic scholars to ensure accuracy and authenticity.",
      icon: Shield,
      gradient: "from-teal-500 via-cyan-600 to-blue-600",
      lightBg: "from-teal-50 to-cyan-50",
    },
    {
      title: "Innovation & Accessibility",
      description:
        "We leverage modern technology to make Islamic learning accessible to everyone, anywhere in the world.",
      icon: Lightbulb,
      gradient: "from-cyan-500 via-blue-600 to-indigo-600",
      lightBg: "from-cyan-50 to-blue-50",
    },
    {
      title: "Community Impact",
      description:
        "Building a global community of learners who support each other in their spiritual and educational journey.",
      icon: Target,
      gradient: "from-blue-500 via-indigo-600 to-purple-600",
      lightBg: "from-blue-50 to-indigo-50",
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Ahmad Hassan",
      role: "Founder & Chief Scholar",
      specialty: "Quranic Studies & Tafseer",
      experience: "20+ Years",
      education: "PhD in Islamic Studies, Al-Azhar University",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      name: "Prof. Fatima Al-Zahra",
      role: "Head of Curriculum",
      specialty: "Islamic History & Jurisprudence",
      experience: "15+ Years",
      education: "PhD in Islamic Law, Oxford University",
      gradient: "from-teal-500 to-cyan-600",
    },
    {
      name: "Imam Mohammed Rashid",
      role: "Senior Instructor",
      specialty: "Hadith Studies & Arabic Language",
      experience: "18+ Years",
      education: "Master in Hadith Sciences, Medina University",
      gradient: "from-cyan-500 to-blue-600",
    },
  ];

  const milestones = [
    { year: "2018", event: "Almunji Founded", icon: Sparkles },
    { year: "2020", event: "Reached 10K Students", icon: Users },
    { year: "2022", event: "Launched Mobile App", icon: Globe },
    { year: "2024", event: "50K+ Active Learners", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-32">
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-12 w-12 text-white" />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              About <span className="text-emerald-100">Almunji</span>
            </h1>
            <p className="text-xl md:text-2xl text-emerald-50 max-w-4xl mx-auto leading-relaxed mb-8">
              Empowering hearts and minds through authentic Islamic education.
              We bridge traditional scholarship with modern learning.
            </p>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-6 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Courses
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-6 rounded-full font-semibold backdrop-blur-sm bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                <Users className="mr-2 h-5 w-5" />
                Join Community
              </Button>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl overflow-hidden group transform hover:-translate-y-2"
            >
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <stat.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </h3>
                <p className="text-slate-600 font-medium text-lg">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mission Section with Image Placeholder */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full mb-6 font-semibold">
                <Heart className="h-4 w-4" />
                Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
                Spreading <span className="text-emerald-600">Authentic</span>
                <br />
                Islamic Knowledge
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                At Almunji, we believe that authentic Islamic knowledge should
                be accessible to every Muslim, regardless of their geographical
                location or background. Our mission is to preserve and share the
                timeless wisdom of Islam through innovative educational
                platforms.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Qualified Islamic scholars review all content",
                  "Modern technology meets traditional scholarship",
                  "Accessible learning for everyone, everywhere",
                  "Building a supportive global community",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Learn More About Our Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative group">
                {/* Main Image Container */}
                <div className="relative w-full h-[500px] bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-3xl shadow-2xl overflow-hidden">
                  {/* Decorative Pattern Overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]"></div>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-8">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      <Heart className="h-20 w-20" />
                    </div>
                    <h3 className="text-3xl font-bold mb-3">
                      Spreading Knowledge
                    </h3>
                    <p className="text-emerald-50 text-xl mb-8">
                      With Love & Dedication
                    </p>
                    <div className="flex gap-8">
                      <div>
                        <div className="text-4xl font-bold">50K+</div>
                        <div className="text-emerald-100">Students</div>
                      </div>
                      <div>
                        <div className="text-4xl font-bold">100+</div>
                        <div className="text-emerald-100">Courses</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full opacity-20 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journey/Timeline Section */}
      <div className="py-24 bg-gradient-to-br from-slate-50 to-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Our <span className="text-emerald-600">Journey</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Growing together through milestones and achievements
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative">
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                    <milestone.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {milestone.year}
                  </div>
                  <div className="text-slate-700 font-semibold">
                    {milestone.event}
                  </div>
                </div>
                {index < milestones.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-300 to-teal-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
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
                onMouseEnter={() => setActiveValue(index)}
                onMouseLeave={() => setActiveValue(null)}
                className={`group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white rounded-3xl overflow-hidden cursor-pointer ${
                  activeValue === index ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                <CardContent className="p-10">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${value.gradient} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    <value.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
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
                className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl overflow-hidden group transform hover:-translate-y-2"
              >
                <CardContent className="p-10">
                  {/* Avatar */}
                  <div
                    className={`w-32 h-32 bg-gradient-to-br ${member.gradient} rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                  >
                    <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
                      <Users className="h-14 w-14 text-emerald-600" />
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-emerald-600 font-semibold mb-4 text-lg">
                    {member.role}
                  </p>
                  <div className="space-y-3 text-left bg-gradient-to-br from-slate-50 to-emerald-50/30 p-6 rounded-2xl">
                    <div className="flex items-start gap-2">
                      <Award className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700">{member.specialty}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700">{member.education}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700">{member.experience}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Quote className="h-16 w-16 text-emerald-600 mx-auto mb-8 opacity-50" />
          <blockquote className="text-2xl md:text-3xl font-medium text-slate-700 mb-8 leading-relaxed">
            "Almunji has transformed the way I learn about Islam. The
            combination of authentic scholarship and modern technology makes
            learning accessible and engaging."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-800 text-lg">
                Sarah Ahmed
              </div>
              <div className="text-slate-600">Student from United Kingdom</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join Our Learning Community
          </h2>
          <p className="text-xl text-emerald-50 mb-10 leading-relaxed max-w-2xl mx-auto">
            Start your journey of Islamic learning today. Discover courses that
            will deepen your understanding and strengthen your faith.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 px-10 py-6 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Explore Courses
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-10 py-6 rounded-full font-semibold backdrop-blur-sm bg-white/10 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
