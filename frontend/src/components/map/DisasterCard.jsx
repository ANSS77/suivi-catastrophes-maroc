import React from 'react';
import { Link } from 'react-router-dom';

const typeConfig = {
  earthquake: {
    label  : 'Séisme',
    color  : 'text-red-500',
    bgColor: 'bg-red-50',
  },
  flood: {
    label  : 'Inondation',
    color  : 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  wildfire: {
    label  : 'Incendie',
    color  : 'text-orange-500',
    bgColor: 'bg-orange-50',
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
          <span className="text-text-dark text-sm font-bold">
            {disaster.date
              ? new Date(disaster.date).toLocaleDateString('fr-FR', {
                  day: '2-digit', month: 'short', year: 'numeric'
                })
              : 'N/A'
            }
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm font-medium">Niveau de risque</span>
          <span className={`${disaster.risk === 'high' ? 'text-red-500' : disaster.risk === 'medium' ? 'text-orange-500' : 'text-green-500'} text-sm font-bold`}>
            {disaster.risk === 'high' ? 'Haut' : disaster.risk === 'medium' ? 'Moyen' : 'Faible'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm font-medium">Score IA</span>
          <span className="text-text-dark text-sm font-bold">
            {disaster.score > 0 ? `${disaster.score}%` : 'N/A'}
          </span>
        </div>
      </div>

      <Link
        to="/alerts"
        className="block w-full bg-[#1A1A1A] hover:bg-black text-white font-bold py-4 rounded-2xl transition-all duration-300 tracking-widest text-[12px] uppercase text-center"
      >
        Voir les détails
      </Link>
    </div>
  );
}