import React from 'react';
import {
  Bot,
  Heart,
  Map,
  Wallet,
  Sun,
  Star,
  Share2,
} from 'lucide-react';

export const Features = () => {
  const features = [
    {
      id: 'ai-itinerary',
      title: 'AI Itinerary Generation',
      icon: Bot,
      iconColor: 'text-[#6C3DF5]',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'personalized',
      title: 'Personalized Recommendations',
      icon: Heart,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-50',
    },
    {
      id: 'maps',
      title: 'Interactive Travel Maps',
      icon: Map,
      iconColor: 'text-[#2563EB]',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'budget',
      title: 'Budget Estimation',
      icon: Wallet,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
    {
      id: 'weather',
      title: 'Real-time Weather Updates',
      icon: Sun,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      id: 'experiences',
      title: 'Local Experiences',
      icon: Star,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      id: 'share',
      title: 'Save & Share Your Trips',
      icon: Share2,
      iconColor: 'text-sky-500',
      bgColor: 'bg-sky-50',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-[#111C2E] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 flex flex-col items-center text-center shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer card-glow"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${item.bgColor} dark:bg-[#162238] ${item.iconColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                {item.title}
              </h3>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
