import React from 'react';

const typeConfig = {
  earthquake: {
    icon: 'fa-solid fa-mountain-sun',
    label: 'Séisme',
    color: 'text-[#C05D2E]'
  },
  flood: {
    icon: 'fa-solid fa-water',
    label: 'Inondation',
    color: 'text-blue-600'
  },
  wildfire: {
    icon: 'fa-solid fa-fire',
    label: 'Incendie',
    color: 'text-red-600'
  }
};

const riskConfig = {
  high: { label: 'ÉLEVÉ', color: 'bg-[#FEE2E2] text-[#B91C1C]' },
  medium: { label: 'MOYEN', color: 'bg-[#FFEDD5] text-[#D97706]' },
  low: { label: 'FAIBLE', color: 'bg-[#DCFCE7] text-[#15803D]' }
};

const statusConfig = {
  active: { label: 'Actif', color: 'bg-[#C05D2E]', textColor: 'text-[#C05D2E]' },
  resolved: { label: 'Résolu', color: 'bg-[#9CA3AF]', textColor: 'text-[#9CA3AF]' }
};

export default function HistoryRow({ event }) {
  const type = typeConfig[event.type];
  const risk = riskConfig[event.riskLevel];
  const status = statusConfig[event.status];

  return (
    <tr className="border-b border-[#E9E1D5]/30 hover:bg-[#FAF7F2]/50 transition-colors">
      <td className="py-6 px-6">
        <div className="flex items-center gap-4">
          <i className={`${type.icon} ${type.color} text-xl`}></i>
          <span className="font-rope font-bold text-[14px] text-text-dark">{type.label}</span>
        </div>
      </td>
      <td className="py-6 px-6 font-rope text-[14px] text-text-dark">
        {event.region}
      </td>
      <td className="py-6 px-6 font-rope text-[14px] text-[#888]">
        {event.date}
      </td>
      <td className="py-6 px-6">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest ${risk.color}`}>
          {risk.label}
        </span>
      </td>
      <td className="py-6 px-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 bg-[#F2EDE4] rounded-full overflow-hidden min-w-[120px]">
             <div 
               className="h-full bg-[#C05D2E] rounded-full" 
               style={{ width: `${event.score}%` }}
             ></div>
          </div>
          <span className="font-rope font-bold text-[14px] text-text-dark min-w-[40px]">{event.score}%</span>
        </div>
      </td>
      <td className="py-6 px-6">
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
          <span className={`font-rope font-bold text-[13px] ${status.textColor}`}>
            {status.label}
          </span>
        </div>
      </td>
    </tr>
  );
}

