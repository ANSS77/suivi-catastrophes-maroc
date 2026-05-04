import React from 'react';

const typeConfig = {
  earthquake: {
    label: 'Séisme',
    icon: 'fa-solid fa-mountain-sun',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    unit: 'Mw'
  },
  flood: {
    label: 'Inondation',
    icon: 'fa-solid fa-water',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    unit: 'm'
  },
  wildfire: {
    label: 'Incendie',
    icon: 'fa-solid fa-fire',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    unit: 'ha'
  }
};

export default function DisasterCard({ disaster, onClose }) {
  const config = typeConfig[disaster.type];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 min-w-[300px] relative font-rope">
      {/* Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-300 hover:text-gray-500 transition-colors"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      )}

      {/* Badge */}
      <div className="mb-6">
        <span className={`${config.bgColor} ${config.color} text-[10px] font-bold tracking-[0.2em] px-4 py-2 rounded-full uppercase`}>
          Alerte Critique
        </span>
      </div>

      <h2 className="text-2xl font-gara text-text-dark font-medium mb-8">
        {config.label} : {disaster.region}
      </h2>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm font-medium">Date</span>
          <span className="text-text-dark text-sm font-bold">12 Jan 2024</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm font-medium">Niveau de risque</span>
          <span className={`${disaster.risk === 'high' ? 'text-red-500' : 'text-orange-500'} text-sm font-bold capitalize`}>
            {disaster.risk === 'high' ? 'Haut' : 'Moyen'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm font-medium">
            {disaster.type === 'earthquake' ? 'Magnitude' : disaster.type === 'flood' ? 'Niveau d\'eau' : 'Surface'}
          </span>
          <span className="text-text-dark text-sm font-bold">
            {disaster.score / 10} {config.unit}
          </span>
        </div>
      </div>

      <button className="w-full bg-[#1A1A1A] hover:bg-black text-white font-bold py-4 rounded-2xl transition-all duration-300 tracking-widest text-[12px] uppercase">
        Voir les détails
      </button>
    </div>
  );
}
