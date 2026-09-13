import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CtaBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#6C3DF5] via-[#4F46E5] to-[#2563EB] p-8 sm:p-12 shadow-2xl shadow-purple-500/20 text-white card-glow">
        
        {/* Background decorative glow blobs */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Text */}
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Ready to Plan Your Next Adventure?
            </h2>
            <p className="text-sm sm:text-base text-purple-100 font-medium">
              Join millions of travelers and create unforgettable memories with AI.
            </p>
          </div>

          {/* Right Action & Avatars */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatars + Count */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="User 1"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="User 2"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="User 3"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                  alt="User 4"
                />
              </div>
              <span className="text-sm font-bold text-white tracking-tight whitespace-nowrap">
                2M+ Travelers
              </span>
            </div>

            {/* CTA Button */}
            <Link
              to="/ai-planner"
              className="px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#6C3DF5] font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
