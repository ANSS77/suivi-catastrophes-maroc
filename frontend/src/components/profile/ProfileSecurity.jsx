import React, { useState } from 'react';

const PasswordInput = ({ label, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <label className="text-[11px] font-bold font-rope tracking-widest text-[#888] uppercase">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className="bg-white border border-[#E9E1D5] rounded-xl px-4 py-3.5 text-[14px] font-rope text-text-dark focus:ring-2 focus:ring-[#C05D2E]/20 outline-hidden w-full transition-all pr-12"
        />
        <button
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C05D2E] transition-colors"
        >
          <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </button>
      </div>
    </div>
  );
};

export default function ProfileSecurity() {
  return (
    <div className="flex flex-col gap-10 max-w-3xl">
      <div>
        <h1 className="text-[42px] font-gara text-text-dark font-medium leading-tight">Sécurité</h1>
        <p className="text-[#888] font-rope mt-2">Gérez la sécurité de votre compte</p>
      </div>

      <div className="bg-white border border-[#E9E1D5]/50 rounded-2xl p-10 shadow-sm flex flex-col gap-8">
        <PasswordInput label="Mot de passe actuel" placeholder="••••••••••••" />
        
        <div className="grid grid-cols-2 gap-8">
          <PasswordInput label="Nouveau mot de passe" placeholder="••••••••" />
          <PasswordInput label="Confirmer le nouveau mot de passe" placeholder="••••••••" />
        </div>

        <div className="flex mt-4">
          <button className="bg-[#C05D2E] hover:bg-[#A64F26] text-white font-bold font-rope text-[14px] px-10 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#C05D2E]/20 active:scale-[0.98]">
            Changer mot de passe
          </button>
        </div>
      </div>
    </div>
  );
}
