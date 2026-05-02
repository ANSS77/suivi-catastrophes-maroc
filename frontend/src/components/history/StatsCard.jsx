import React from 'react';

const typeConfig = {
  total: {
    icon: 'fa-solid fa-layer-group',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    label: 'Total Événements'
  },
  seismes: {
    icon: 'fa-solid fa-mountain-sun',
    color: 'text-[#C05D2E]',
    bgColor: 'bg-[#F2EAE1]',
    label: 'Séismes'
  },
  inondations: {
    icon: 'fa-solid fa-water',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Inondations'
  },
  incendies: {
    icon: 'fa-solid fa-fire',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: 'Incendies'
  }
};

export default function StatsCard({ type, count }) {
  const config = typeConfig[type] || typeConfig.total;

  return (
    <div className="bg-[#FAF7F2] border border-[#E9E1D5]/50 rounded-2xl p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${config.bgColor}`}>
        <i className={`${config.icon} ${config.color} text-xl`}></i>
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-bold font-rope tracking-widest text-[#888] uppercase mb-1">
          {config.label}
        </span>
        <span className="text-3xl font-gara text-text-dark font-bold leading-none">
          {count}
        </span>
      </div>
    </div>
  );
}
