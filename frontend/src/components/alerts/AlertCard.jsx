import React from 'react';

const typeConfig = {
  earthquake: {
    icon: 'fa-solid fa-mountain-sun',
    color: 'text-[#C05D2E]',
    bgColor: 'bg-[#F2EAE1]',
  },
  flood: {
    icon: 'fa-solid fa-water',
    color: 'text-[#D08B62]',
    bgColor: 'bg-[#F9E8DE]',
  },
  wildfire: {
    icon: 'fa-solid fa-fire',
    color: 'text-[#A05C5C]',
    bgColor: 'bg-[#F2DFDF]',
  },
};

const scoreStyles = {
  high:   { text: 'text-red-600',    bg: 'bg-red-100'    },
  medium: { text: 'text-yellow-600', bg: 'bg-yellow-100' },
  low:    { text: 'text-green-600',  bg: 'bg-green-100'  },
};

export default function AlertCard({ alert }) {
  const config = typeConfig[alert.type] || typeConfig.earthquake;
  const style = scoreStyles[alert.riskLevel] || scoreStyles.low;

  return (
    <div className="bg-[#FAF7F2] border border-[#E9E1D5]/50 rounded-xl p-5 flex items-center justify-between hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
      <div className="flex items-center gap-6">
        {/* Icon Circle */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${config.bgColor}`}>
          <i className={`${config.icon} ${config.color} text-2xl`}></i>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-gara text-text-dark font-medium leading-tight capitalize">
              {alert.title}
            </h3>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-rope tracking-widest uppercase ${style.text} ${style.bg}`}>
              {alert.score}%
            </span>
          </div>

          <div className="flex items-center gap-5 text-sm text-[#888] font-rope">
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-calendar text-[12px]"></i>
              <span>{alert.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-[12px]"></i>
              <span>{alert.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}