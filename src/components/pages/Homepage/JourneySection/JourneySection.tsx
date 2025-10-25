import { Button } from "@/components/ui/button";
import { BookOpen, Volume2 } from "lucide-react";

const JourneySection = () => {
  return (
    <div className="bg-linear-to-br from-teal-500 to-teal-600 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Begin Your Journey
          <br />
          with the Quran
        </h1>
        <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
          Embrace the transformative power of the Quran today, whether you are
          new to the Quran or a seasoned reader. Our platform offers an
          enriching and accessible experience for all.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium rounded-full"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Start Reading
          </Button>
          <Button
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 text-lg font-medium rounded-full"
          >
            <Volume2 className="mr-2 h-5 w-5" />
            Listen Audio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JourneySection;
