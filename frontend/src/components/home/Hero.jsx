import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Play, Bot, Users, Star, X } from 'lucide-react';

export const Hero = () => {
  const navigate = useNavigate();
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  return (
    <section className="relative pt-6 pb-12 overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] dark:from-[#0B1120] dark:via-[#0E1628] dark:to-[#0B1120] transition-colors duration-150">
      {/* Subtle ambient lighting glows for Dark Mode */}
      <div className="absolute top-12 left-1/4 w-[600px] h-[450px] pointer-events-none hidden dark:block ambient-glow-purple opacity-40 blur-3xl -z-0" />
      <div className="absolute top-24 right-10 w-[500px] h-[400px] pointer-events-none hidden dark:block ambient-glow-blue opacity-35 blur-3xl -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Calls to Action */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200/70 dark:border-purple-800/80 text-[#6C3DF5] dark:text-purple-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />
              <span>Powered by AI</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#14213D] dark:text-white leading-[1.08] mb-6">
              Plan Smarter <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#6C3DF5] to-[#2563EB]">
                Travel Better
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-lg mb-8">
              Your personal AI travel planner. Discover destinations, create custom itineraries, get real-time recommendations and make every trip unforgettable.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <Link
                to="/ai-planner"
                className="btn-glow-primary w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#6C3DF5] to-[#2563EB] hover:from-[#7C3AED] hover:to-[#1D4ED8] text-white font-semibold text-base shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>Plan My Trip</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setShowDemoVideo(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold text-base hover:bg-slate-50 dark:hover:bg-[#1A2740] hover:border-purple-300 dark:hover:border-purple-500/50 transition-all flex items-center justify-center gap-2.5 shadow-xs cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-purple-50 dark:bg-purple-950/80 flex items-center justify-center text-[#6C3DF5] dark:text-purple-400">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Handwritten note with arrow */}
            <div className="relative pl-6 hidden sm:block">
              <div className="font-handwriting text-2xl text-slate-700 dark:text-slate-300 rotate-[-8deg] leading-tight flex items-center gap-2">
                <span>Dream</span>
                <span className="text-purple-400">•</span>
                <span>Plan</span>
                <span className="text-purple-400">•</span>
                <span>Explore</span>
                <span className="text-purple-400">•</span>
                <span>Repeat</span>
              </div>
              <svg className="w-20 h-10 text-slate-400 dark:text-slate-500 -mt-2 ml-16" viewBox="0 0 100 50" fill="none" stroke="currentColor">
                <path d="M10,10 Q50,45 85,25" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3" />
                <path d="M80,20 L86,25 L80,30" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Right Column: Hero Visual & Floating Elements */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Primary Visual Showcase Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 aspect-[4/5] sm:aspect-[16/14]">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85"
                  alt="Traveler admiring turquoise mountain lake and alpine peaks"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                {/* Floating Destination Vertical Thumbnail Cards (Right side inside hero) */}
                <div className="absolute top-4 right-4 flex flex-col gap-2.5 z-20">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/90 dark:border-slate-700/80 shadow-md hover:scale-105 transition-transform">
                    <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80" alt="Mountain" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/90 dark:border-slate-700/80 shadow-md hover:scale-105 transition-transform">
                    <img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=300&q=80" alt="Lake" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/90 dark:border-slate-700/80 shadow-md hover:scale-105 transition-transform">
                    <img src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80" alt="Pagoda" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/90 dark:border-slate-700/80 shadow-md hover:scale-105 transition-transform">
                    <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=80" alt="Temple" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Floating Card 1 (Top Center/Left): AI Suggestion */}
                <div className="absolute top-6 left-6 z-20 glass-pill px-4 py-3 rounded-2xl flex items-center gap-3 border border-white/70 dark:border-slate-700/80 shadow-xl animate-fade-in card-glow">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C3DF5] to-[#38BDF8] flex items-center justify-center text-white shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 block">
                      AI Suggestion
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Best time to visit: April – June
                    </span>
                  </div>
                </div>

                {/* Floating Story Card (Bottom Left): Not just trips, But better stories */}
                <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-xs z-20 glass-pill p-4 sm:p-5 rounded-3xl border border-white/80 dark:border-slate-700/80 shadow-2xl backdrop-blur-xl card-glow">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    Not just trips, <br />
                    <span className="text-[#6C3DF5] dark:text-purple-400">But better stories</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 mb-3 leading-relaxed">
                    Explore the world with AI-powered itineraries tailored precisely to you.
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/80">
                    <div className="flex -space-x-2">
                      <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User 1" />
                      <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="User 2" />
                      <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User 3" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                      2M+ Travelers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      {showDemoVideo && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C2E] rounded-3xl p-6 max-w-2xl w-full relative shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowDemoVideo(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-[#1A2740] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">TripMate in Action</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Watch how our intelligent AI generates custom day-wise itineraries, live interactive maps, and budget calculations in seconds.
            </p>
            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center relative">
              <img
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"
                alt="Demo preview"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div className="w-16 h-16 rounded-full bg-[#6C3DF5] flex items-center justify-center shadow-lg shadow-purple-500/50 mb-3 animate-float">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <p className="font-bold text-lg">Interactive Demo Tour</p>
                <p className="text-xs text-slate-300">Ready to test the planner directly below!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
