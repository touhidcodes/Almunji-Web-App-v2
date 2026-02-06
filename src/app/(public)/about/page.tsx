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
  Shield,
  Star,
  Target,
  Users,
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
    },
    {
      title: "Authentic Knowledge",
      description:
        "All our content is carefully reviewed by qualified Islamic scholars to ensure accuracy and authenticity.",
      icon: Shield,
    },
    {
      title: "Innovation & Accessibility",
      description:
        "We leverage modern technology to make Islamic learning accessible to everyone, anywhere in the world.",
      icon: Lightbulb,
    },
    {
      title: "Community Impact",
      description:
        "Building a global community of learners who support each other in their spiritual and educational journey.",
      icon: Target,
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

  const milestones = [
    { year: "2018", event: "Almunji Founded" },
    { year: "2020", event: "10K Students" },
    { year: "2022", event: "Mobile App Launch" },
    { year: "2024", event: "50K+ Learners" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <BookOpen className="h-8 w-8 text-white" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              About Almunji
            </h1>
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto mb-8">
              Empowering hearts and minds through authentic Islamic education
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50">
                Explore Courses
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-emerald-600"
              >
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border shadow-sm">
              <CardContent className="p-6">
                <stat.icon className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-3xl font-bold text-slate-800 mb-1">
                  {stat.number}
                </h3>
                <p className="text-slate-600 text-sm">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                Our Mission
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                At Almunji, we believe that authentic Islamic knowledge should
                be accessible to every Muslim, regardless of their geographical
                location or background.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  "Qualified scholars review all content",
                  "Modern technology meets tradition",
                  "Accessible learning for everyone",
                  "Building a global community",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div>
              <div className="w-full h-80 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white">
                <div className="text-center">
                  <Heart className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">
                    Spreading Knowledge
                  </h3>
                  <p className="text-emerald-100">With Love & Dedication</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-3">
              Our Journey
            </h2>
            <p className="text-slate-600">
              Growing together through milestones
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-emerald-600 mb-2">
                  {milestone.year}
                </div>
                <div className="text-slate-700">{milestone.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-3">
              Our Core Values
            </h2>
            <p className="text-slate-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border shadow-sm">
                <CardContent className="p-6">
                  <value.icon className="h-10 w-10 text-emerald-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
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
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-3">
              Meet Our Scholars
            </h2>
            <p className="text-slate-600">
              Distinguished educators dedicated to authentic knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center border shadow-sm">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-emerald-600 font-semibold mb-3 text-sm">
                    {member.role}
                  </p>
                  <p className="text-slate-600 text-sm mb-1">
                    {member.specialty}
                  </p>
                  <p className="text-slate-500 text-sm">{member.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-br from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Join Our Learning Community
          </h2>
          <p className="text-emerald-50 mb-8">
            Start your journey of Islamic learning today
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-emerald-600 hover:bg-emerald-50">
              <BookOpen className="mr-2 h-4 w-4" />
              Explore Courses
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-emerald-600"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
