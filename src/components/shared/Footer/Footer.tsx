import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Smartphone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-teal-600 rounded mr-2"></div>
              <span className="text-xl font-bold text-gray-900">Almunji</span>
            </div>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Where you can embark on a transformative journey through the
              sacred text of Islam.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs"
              >
                <Play className="h-4 w-4" />
                Google Play
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs"
              >
                <Smartphone className="h-4 w-4" />
                App Store
              </Button>
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Navigate</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Recitors
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Link */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Popular Link</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Ayatul Kursi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Yaaseen
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Ar-Rahman
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Al Mulk
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Al Muzammil
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Cookie Preferences
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              Copyright © 2023 Moslium Asam
            </p>
            <div className="flex items-center gap-6">
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Terms
                </a>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Legal
                </a>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Privacy
                </a>
              </div>
              <div className="flex gap-3 ml-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-xs">in</span>
                </div>
                <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-xs">@</span>
                </div>
                <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-xs">ig</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
