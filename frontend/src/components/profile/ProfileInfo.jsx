import React, { useState } from 'react';
import api from '../../api/axios';

export default function ProfileInfo({ user }) {
  const [formData, setFormData] = useState({
    nom: user.nom || '',
    email: user.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await api.post('/profile/update/', formData);
      
      // Mettre à jour le localStorage avec le nouvel utilisateur renvoyé par le backend
      const updatedUser = { 
        ...user, 
        nom: response.data.user.nom, 
        email: response.data.user.email 
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMsg = error.response?.data?.error || 'Erreur lors de la mise à jour du profil.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

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
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="bg-[#FAF7F2] border border-[#E9E1D5] rounded-xl px-4 py-3.5 text-[14px] font-rope text-text-dark focus:ring-2 focus:ring-[#C05D2E]/20 outline-hidden w-full transition-all"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-bold font-rope tracking-widest text-[#888] uppercase">
              Adresse Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-[#FAF7F2] border border-[#E9E1D5] rounded-xl px-4 py-3.5 text-[14px] font-rope text-text-dark focus:ring-2 focus:ring-[#C05D2E]/20 outline-hidden w-full transition-all"
            />
          </div>
        </div>

        {message.text && (
          <p className={`text-center text-sm font-rope ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {message.text}
          </p>
        )}

        <div className="flex justify-end mt-4">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-[#C05D2E] hover:bg-[#A64F26] text-white font-bold font-rope text-[14px] px-10 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#C05D2E]/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}
