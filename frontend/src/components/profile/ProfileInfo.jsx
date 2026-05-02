import React from 'react';

export default function ProfileInfo({ user }) {

  return (
    <div className="flex flex-col gap-10 max-w-3xl">
      <div>
        <h1 className="text-[42px] font-gara text-text-dark font-medium leading-tight">Mon Profil</h1>
        <p className="text-[#888] font-rope mt-2">Gérez vos informations personnelles</p>
      </div>

      <div className="bg-white border border-[#E9E1D5]/50 rounded-2xl p-10 shadow-sm flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-bold font-rope tracking-widest text-[#888] uppercase">
              Nom Complet
            </label>
            <input
              type="text"
              defaultValue={user.nom}
              className="bg-[#FAF7F2] border border-[#E9E1D5] rounded-xl px-4 py-3.5 text-[14px] font-rope text-text-dark focus:ring-2 focus:ring-[#C05D2E]/20 outline-hidden w-full transition-all"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-bold font-rope tracking-widest text-[#888] uppercase">
              Adresse Email
            </label>
            <input
              type="email"
              defaultValue={user.email}
              className="bg-[#FAF7F2] border border-[#E9E1D5] rounded-xl px-4 py-3.5 text-[14px] font-rope text-text-dark focus:ring-2 focus:ring-[#C05D2E]/20 outline-hidden w-full transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button className="bg-[#C05D2E] hover:bg-[#A64F26] text-white font-bold font-rope text-[14px] px-10 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#C05D2E]/20 active:scale-[0.98]">
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}
