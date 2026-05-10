import React, { useState } from 'react';
import api from '../../api/axios';

const PasswordInput = ({ label, placeholder, value, onChange }) => {
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
          value={value}
          onChange={onChange}
          className="bg-white border border-[#E9E1D5] rounded-xl px-4 py-3.5 text-[14px] font-rope text-text-dark focus:ring-2 focus:ring-[#C05D2E]/20 outline-hidden w-full transition-all pr-12"
        />
        <button
          onClick={() => setShow(!show)}
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C05D2E] transition-colors bg-transparent border-none cursor-pointer"
        >
          <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </button>
      </div>
    </div>
  );
};

export default function ProfileSecurity() {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSave = async () => {
    setMessage({ type: '', text: '' });

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs.' });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }

    if (passwords.new.length < 6) {
      setMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/password/change/', {
        current_password: passwords.current,
        new_password: passwords.new
      });
      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès.' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMsg = error.response?.data?.error || 'Erreur lors de la mise à jour du mot de passe.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-3xl">
      <div>
        <h1 className="text-[42px] font-gara text-text-dark font-medium leading-tight">Sécurité</h1>
        <p className="text-[#888] font-rope mt-2">Gérez la sécurité de votre compte</p>
      </div>

      <div className="bg-white border border-[#E9E1D5]/50 rounded-2xl p-10 shadow-sm flex flex-col gap-8">
        <PasswordInput 
          label="Mot de passe actuel" 
          placeholder="••••••••••••" 
          value={passwords.current}
          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
        />
        
        <div className="grid grid-cols-2 gap-8">
          <PasswordInput 
            label="Nouveau mot de passe" 
            placeholder="••••••••" 
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
          />
          <PasswordInput 
            label="Confirmer le nouveau mot de passe" 
            placeholder="••••••••" 
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
          />
        </div>

        {message.text && (
          <p className={`text-center text-sm font-rope ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {message.text}
          </p>
        )}

        <div className="flex mt-4">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-[#C05D2E] hover:bg-[#A64F26] text-white font-bold font-rope text-[14px] px-10 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#C05D2E]/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Mise à jour...' : 'Changer mot de passe'}
          </button>
        </div>
      </div>
    </div>
  );
}
