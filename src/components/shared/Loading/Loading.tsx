"use client";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated Rings */}
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-emerald-600 animate-spin"></div>
          <div className="absolute inset-4 rounded-full border-4 border-teal-50"></div>
          <div className="absolute inset-4 rounded-full border-b-4 border-teal-500 animate-[spin_1.5s_linear_infinite_reverse]"></div>
        </div>

        {/* Branding */}
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-black tracking-[0.2em] text-gray-900 animate-pulse">
            ALMUNJI
          </h2>
          <div className="flex gap-1.5 mt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
