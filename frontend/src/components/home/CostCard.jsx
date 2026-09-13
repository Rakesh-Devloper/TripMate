import React from 'react';
import { ArrowDown, DollarSign } from 'lucide-react';

export const CostCard = ({ total = 1200, breakdown }) => {
  const defaultBreakdown = breakdown || {
    flights: 400,
    hotel: 350,
    food: 180,
    activities: 170,
    transport: 100,
  };

  return (
    <div className="bg-white dark:bg-[#111C2E] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xl card-glow transition-colors duration-150">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Total Trip Cost
          </span>
          <span className="text-3xl font-extrabold text-[#14213D] dark:text-white">
            ${total.toLocaleString()}
          </span>
        </div>
        
        <div className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center gap-1 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-2xs">
          <ArrowDown className="w-3.5 h-3.5" />
          <span>20% less than avg</span>
        </div>
      </div>

      {/* Budget Breakdown Progress Bars */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>Stays & Hotels</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">${defaultBreakdown.hotel}</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#7C3AED] h-full rounded-full w-[30%]" />
        </div>

        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
          <span>Flights & Transit</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">${defaultBreakdown.flights + defaultBreakdown.transport}</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#2563EB] h-full rounded-full w-[40%]" />
        </div>

        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
          <span>Experiences & Food</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">${defaultBreakdown.activities + defaultBreakdown.food}</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#38BDF8] h-full rounded-full w-[30%]" />
        </div>
      </div>
    </div>
  );
};

export default CostCard;
