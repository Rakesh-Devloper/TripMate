import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Check,
  ArrowRight,
  Plane,
  Compass,
  DollarSign,
  Info,
  Calendar,
} from 'lucide-react';
import InteractiveMap from './InteractiveMap.jsx';
import CostCard from './CostCard.jsx';

export const AiPlannerPreview = () => {
  const [activeTab, setActiveTab] = useState('itinerary');

  const daysTimeline = [
    {
      day: 'Day 1',
      title: 'Arrival in Bali',
      subtitle: 'Check-in • Relax • Beach Walk',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=200&q=80',
    },
    {
      day: 'Day 2',
      title: 'Ubud Exploration',
      subtitle: 'Monkey Forest • Rice Terraces',
      image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=200&q=80',
    },
    {
      day: 'Day 3',
      title: 'Nature & Adventure',
      subtitle: 'Waterfalls • Swing • Jungle Trek',
      image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=200&q=80',
    },
    {
      day: 'Day 4',
      title: 'Nusa Penida',
      subtitle: 'Island Tour • Snorkeling',
      image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=200&q=80',
    },
    {
      day: 'Day 5',
      title: 'Cultural Experience',
      subtitle: 'Temples • Local Markets',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=200&q=80',
    },
    {
      day: 'Day 6',
      title: 'Beach & Sunset',
      subtitle: 'Seminyak • Beach Clubs',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80',
    },
    {
      day: 'Day 7',
      title: 'Departure',
      subtitle: 'Last-minute Shopping',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Heading & Features */}
        <div className="lg:col-span-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#6C3DF5] dark:text-purple-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Trip Planner
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#14213D] dark:text-white tracking-tight leading-tight mb-4">
            Your Perfect Itinerary <br />
            in Seconds
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Tell us your preferences and let our AI create a personalized day-by-day plan with places, stays, food and experiences.
          </p>

          <div className="space-y-3.5 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-[#6C3DF5] dark:text-purple-300 shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Custom day-wise itinerary
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-[#6C3DF5] dark:text-purple-300 shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Top attractions & hidden gems
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-[#6C3DF5] dark:text-purple-300 shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Estimated budget
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-[#6C3DF5] dark:text-purple-300 shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Travel tips & best time to visit
              </span>
            </div>
          </div>

          <Link
            to="/ai-planner"
            className="btn-glow-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#6C3DF5] to-[#2563EB] hover:from-[#7C3AED] hover:to-[#1D4ED8] text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
          >
            <span>Try AI Planner Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right Area: Interactive Timeline Card & Map matching reference */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Timeline Card */}
          <div className="md:col-span-6 bg-white dark:bg-[#111C2E] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-5 flex flex-col card-glow">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#6C3DF5] -rotate-45" />
                <h3 className="font-extrabold text-base text-[#14213D] dark:text-white">
                  7 Days in Bali
                </h3>
              </div>

              {/* Sub-tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#162238] p-1 rounded-full text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === 'itinerary'
                      ? 'bg-[#6C3DF5] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Itinerary
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === 'map'
                      ? 'bg-[#6C3DF5] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Map
                </button>
                <button
                  onClick={() => setActiveTab('budget')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === 'budget'
                      ? 'bg-[#6C3DF5] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Budget
                </button>
                <button
                  onClick={() => setActiveTab('tips')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === 'tips'
                      ? 'bg-[#6C3DF5] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Tips
                </button>
              </div>
            </div>

            {/* Itinerary Tab Content */}
            {activeTab === 'itinerary' && (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
                {daysTimeline.map((item, idx) => (
                  <div
                    key={item.day}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                  >
                    {/* Circle Indicator & Thumbnail */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xs border border-slate-200 dark:border-slate-700">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-[#6C3DF5] text-[9px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-slate-900">
                        {idx + 1}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#6C3DF5] dark:text-purple-400">
                          {item.day}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Map Tab Content */}
            {activeTab === 'map' && (
              <div className="p-2 text-center my-auto">
                <Compass className="w-10 h-10 text-[#6C3DF5] mx-auto mb-2 animate-bounce-short" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Interactive Route active on the adjacent map viewer.
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Click any marker on the map to explore activities and photos.
                </p>
              </div>
            )}

            {/* Budget Tab Content */}
            {activeTab === 'budget' && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm font-bold text-slate-800 dark:text-slate-200">
                  <span>Flights & Airport</span>
                  <span>$400</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-800 dark:text-slate-200">
                  <span>Boutique Villas</span>
                  <span>$350</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-800 dark:text-slate-200">
                  <span>Food & Dining</span>
                  <span>$180</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-800 dark:text-slate-200">
                  <span>Adventures & Tours</span>
                  <span>$170</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-800 dark:text-slate-200">
                  <span>Private Transport</span>
                  <span>$100</span>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center font-extrabold text-base text-[#6C3DF5] dark:text-purple-400">
                  <span>Total Estimated</span>
                  <span>$1,200</span>
                </div>
              </div>
            )}

            {/* Tips Tab Content */}
            {activeTab === 'tips' && (
              <div className="space-y-2.5 pt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <p className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 font-medium">
                  💡 <strong>Best Season:</strong> April – June brings ideal weather with calm seas and sunny skies.
                </p>
                <p className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80">
                  🚗 <strong>Getting around:</strong> Download Grab or Gojek apps, or hire a private driver for full-day excursions.
                </p>
                <p className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80">
                  🙏 <strong>Etiquette:</strong> Cover shoulders and knees with a sarong when entering holy Hindu temples.
                </p>
              </div>
            )}
          </div>

          {/* Leaflet Map & Cost Card Column */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <CostCard total={1200} />
            <InteractiveMap />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiPlannerPreview;
