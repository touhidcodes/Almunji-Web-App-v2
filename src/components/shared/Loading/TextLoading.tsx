"use client";

const TextLoading = () => {
  return (
    <div className="fixed inset-0 z-999 bg-white flex items-center justify-center">
      <div className="text-2xl md:text-4xl font-bold text-gray-800 animate-pulse">
        <span className="inline-block animate-slideUpFade">
          ALMUNJI
          <span className="animate-bounceDots inline-block ml-1">...</span>
        </span>
      </div>
    </div>
  );
};

export default TextLoading;
