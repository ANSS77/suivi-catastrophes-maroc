import React from 'react';

// Map IDs to names if they're just IDs, or use them as strings if they're names.
// For now, I'll assume they might be names or I'll provide dynamic names.
const regionsData = [
  { id: 1, name: "Marrakech-Safi" },
  { id: 2, name: "Souss-Massa" },
  { id: 3, name: "Tanger-Tétouan-Al Hoceïma" },
];

export default function ProfileRegions({ user }) {
  const regions = user.regionIds || [];

  return (
    <div className="flex flex-col gap-10 max-w-4xl">
      <div>
        <h1 className="text-[42px] font-gara text-text-dark font-medium leading-tight">Mes Régions & Alertes</h1>
        <p className="text-[#888] font-rope mt-2">Gérez vos zones de surveillance et les types d'alertes par région</p>
      </div>

      <div className="bg-[#FAF7F2] border border-[#E9E1D5]/50 rounded-2xl p-10 shadow-sm flex flex-col gap-8">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-xl font-gara text-text-dark font-bold">Régions sélectionnées</h3>
          <span className="text-[10px] font-bold font-rope tracking-widest text-[#888] uppercase">Config. Alertes</span>
        </div>

        <div className="flex flex-col gap-4">
          {regions.length > 0 ? (
            regions.map((region, index) => (
              <div key={index} className="bg-white border border-[#E9E1D5]/50 rounded-xl px-6 py-5 flex items-center justify-between group hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <i className="fa-solid fa-location-dot text-[#C05D2E]"></i>
                  <span className="text-[15px] font-rope font-bold text-text-dark">{region}</span>
                </div>
                <div className="flex items-center gap-6">
                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#BA612D]"></div>
                  </label>
                  <button className="text-gray-300 hover:text-red-500 transition-colors">
                    <i className="fa-solid fa-xmark text-lg"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center bg-white/50 border border-dashed border-[#E9E1D5] rounded-xl">
               <p className="text-[#888] font-rope italic">Aucune région sélectionnée</p>
            </div>
          )}

          <button className="mt-2 py-4 border border-dashed border-[#E9E1D5] rounded-xl flex items-center justify-center gap-3 text-[#888] font-rope font-medium text-[14px] hover:bg-white hover:border-[#C05D2E] hover:text-[#C05D2E] transition-all group">
            <i className="fa-solid fa-plus text-[12px] group-hover:scale-110"></i>
            Ajouter une région
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <button className="bg-[#C05D2E] hover:bg-[#A64F26] text-white font-bold font-rope text-[15px] py-4 rounded-xl transition-all duration-300 shadow-lg shadow-[#C05D2E]/20 active:scale-[0.98]">
            Sauvegarder mes paramètres
          </button>
          
          <p className="text-[12px] font-rope text-[#888] text-center leading-relaxed italic">
            * Si vous désactivez une région ou un type de catastrophe spécifique, 
            aucune alerte ne vous sera envoyée pour ces paramètres.
          </p>
        </div>
      </div>
    </div>
  );
}
