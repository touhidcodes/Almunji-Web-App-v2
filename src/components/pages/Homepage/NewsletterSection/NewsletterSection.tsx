"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Send,
  BookOpen,
  Star,
  Heart,
  Globe,
  Calendar,
  Gift,
  Sparkles,
  CheckCircle,
  Bell,
  Zap,
} from "lucide-react";

interface NewsletterFeature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubscribe = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (email && !isLoading) {
      setIsLoading(true);

      setTimeout(() => {
        setIsSubscribed(true);
        setIsLoading(false);

        setTimeout(() => {
          setIsSubscribed(false);
          setEmail("");
        }, 3000);
      }, 800);
    }
  };

  const newsletterFeatures: NewsletterFeature[] = [
    {
      icon: BookOpen,
      title: "Weekly Islamic Insights",
      description:
        "Carefully curated articles on Quran, Hadith, and Islamic wisdom",
    },
    {
      icon: Calendar,
      title: "Course Updates & New Releases",
      description:
        "Be the first to know about new courses and special programs",
    },
    {
      icon: Gift,
      title: "Exclusive Discounts",
      description: "Subscriber-only offers and early access to course sales",
    },
    {
      icon: Star,
      title: "Scholar Spotlights",
      description: "Meet our instructors and learn from their Islamic journey",
    },
  ];

  return (
    <div className="py-20 bg-linear-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-white/15 rounded-full blur-md animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20 shadow-lg">
            <Mail className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Stay Connected with
            <br />
            <span className="text-emerald-200">Islamic Knowledge</span>
          </h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            Join over 50,000 Muslim learners who receive weekly insights, course
            updates, and exclusive content to strengthen their Islamic knowledge
            and practice.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {newsletterFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="shrink-0 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-emerald-100 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:ml-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-200 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    <Gift className="h-4 w-4" />
                    <span>Free Islamic eBook for New Subscribers</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Join Our Learning Community
                  </h3>
                  <p className="text-emerald-100">
                    Subscribe to receive authentic Islamic content directly in
                    your inbox
                  </p>
                </div>

                {!isSubscribed ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEmail(e.target.value)
                        }
                        placeholder="Enter your email address"
                        disabled={isLoading}
                        className="w-full px-4 py-4 bg-white/90 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-slate-800 placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      />
                    </div>

                    <Button
                      onClick={handleSubscribe}
                      disabled={isLoading || !email}
                      className="w-full bg-amber-400 hover:bg-amber-500 text-slate-800 font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <span className="animate-pulse">Subscribing...</span>
                      ) : (
                        <>
                          Subscribe & Get Free eBook
                          <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 animate-bounce">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Welcome to the Community!
                    </h3>
                    <p className="text-emerald-100">
                      Your free eBook is on its way to your inbox.
                    </p>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <p className="text-xs text-emerald-200">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                  <div className="flex justify-center items-center space-x-4 mt-4 text-emerald-200">
                    <div className="flex items-center space-x-1">
                      <Bell className="h-4 w-4" />
                      <span className="text-sm">Weekly Updates</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="h-4 w-4" />
                      <span className="text-sm">No Spam</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-4 text-emerald-100">
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4 text-pink-300" />
                  <span className="text-sm">50K+ Subscribers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">85+ Countries</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span className="text-sm">4.9★ Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;
