import React from 'react';

const regions = [
  "Tanger-Tétouan-Al Hoceïma",
  "L'Oriental",
  "Fès-Meknès",
  "Rabat-Salé-Kénitra",
  "Béni Mellal-Khénifra",
  "Casablanca-Settat",
  "Marrakech-Safi",
  "Drâa-Tafilalet",
  "Souss-Massa",
  "Guelmim-Oued Noun",
  "Laâyoune-Sakia El Hamra",
  "Dakhla-Oued Ed-Dahab"
];

export default function HistoryFilters() {
  return (
    <div className="bg-[#FAF7F2] border border-[#E9E1D5]/50 rounded-2xl p-8 flex flex-col gap-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">

        {/* Période */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold font-rope tracking-widest text-[#888] uppercase">
            Période
          </label>
          <div className="flex items-center gap-2 bg-[#F2EDE4] border border-[#E9E1D5] rounded-xl px-4 py-3">
            <i className="fa-regular fa-calendar text-[#888] text-sm"></i>
            <input
              type="text"
              placeholder="01/01/2023 - 31/12/2023"
              className="bg-transparent border-none focus:ring-0 text-[13px] font-rope text-text-dark w-full outline-hidden"
            />
          </div>
        </div>

        {/* Type */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold font-rope tracking-widest text-[#888] uppercase">
            Type de catastrophe
          </label>
          <select className="bg-[#F2EDE4] border border-[#E9E1D5] rounded-xl px-4 py-3 text-[13px] font-rope text-text-dark focus:ring-2 focus:ring-primary-orange/20 outline-hidden appearance-none cursor-pointer">
            <option>Tous</option>
            <option>Séismes</option>
            <option>Inondations</option>
            <option>Incendies</option>
          </select>
        </div>

        {/* Région */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold font-rope tracking-widest text-[#888] uppercase">
            Région
          </label>
          <select className="bg-[#F2EDE4] border border-[#E9E1D5] rounded-xl px-4 py-3 text-[13px] font-rope text-text-dark focus:ring-2 focus:ring-primary-orange/20 outline-hidden appearance-none cursor-pointer">
            <option>Toutes les régions</option>
            {regions.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        {/* Bouton Filtrer */}
        <button className="bg-[#C05D2E] hover:bg-[#A64F26] text-white font-bold font-rope text-[13px] py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-[#C05D2E]/20">
          <i className="fa-solid fa-sliders text-xs"></i>
          Filtrer
        </button>

      </div>
    </div>
  );
}
