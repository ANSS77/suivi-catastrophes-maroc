import React, { useState, useRef, useEffect } from 'react';
import api from '../../api/axios';

const REGIONS = [
  'Tanger-Tetouan-Al Hoceima', 'Oriental', 'Fes-Meknes',
  'Rabat-Sale-Kenitra', 'Beni-Mellal-Khenifra', 'Casablanca-Settat',
  'Marrakech-Safi', 'Draa-Tafilalet', 'Souss-Massa',
  'Guelmim-Oued Noun', 'Laayoune-Sakia El Hamra', 'Dakhla-Oued Ed-Dahab',
];

export default function ProfileRegions({ user }) {
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const dropdownRef = useRef(null);

  // Initialisation et fetch des régions
  useEffect(() => {
    const loadRegions = async () => {
      // 1. D'abord essayer le localStorage
      const localRegions = user.regionIds || user.regions || [];
      if (localRegions.length > 0) {
        setSelectedRegions(localRegions);
      }

      // 2. Toujours vérifier avec le backend pour être à jour
      try {
        const response = await api.get('/notifications/');
        // Les régions sont stockées dans l'objet Notification de l'utilisateur
        // Si plusieurs notifications, on prend la première qui contient les régions
        const userSettings = response.data.find(n => n.regionIds);
        if (userSettings && userSettings.regionIds.length > 0) {
          setSelectedRegions(userSettings.regionIds);

          // Sync localStorage
          const updatedUser = { ...user, regionIds: userSettings.regionIds };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Error fetching regions from backend:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadRegions();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveRegions = async (newRegions) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('/auth/choose-regions/', { regionIds: newRegions });

      // Mettre à jour localStorage
      const updatedUser = { ...user, regionIds: newRegions };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSelectedRegions(newRegions);

      setMessage({ type: 'success', text: 'Régions mises à jour avec succès.' });
    } catch (error) {
      console.error("Error saving regions:", error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde des régions.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleRegion = (region) => {
    const newRegions = selectedRegions.includes(region)
      ? selectedRegions.filter(r => r !== region)
      : [...selectedRegions, region];
    setSelectedRegions(newRegions);
  };

  const removeRegion = async (region) => {
    const newRegions = selectedRegions.filter(r => r !== region);
    await saveRegions(newRegions);
  };

  const handleSaveAll = async () => {
    await saveRegions(selectedRegions);
  };

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
          {initialLoading ? (
            <div className="py-10 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#C05D2E]/30 border-t-[#C05D2E] rounded-full animate-spin"></div>
              <p className="text-[#888] font-rope mt-2 italic">Chargement de vos régions...</p>
            </div>
          ) : selectedRegions.length > 0 ? (
            selectedRegions.map((region, index) => (
              <div key={index} className="bg-white border border-[#E9E1D5]/50 rounded-xl px-6 py-5 flex items-center justify-between group hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="flex items-center gap-4">
                  <i className="fa-solid fa-location-dot text-[#C05D2E]"></i>
                  <span className="text-[15px] font-rope font-bold text-text-dark">{region}</span>
                </div>
                <div className="flex items-center gap-6">

                  <button
                    onClick={() => removeRegion(region)}
                    className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                  >
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

          {/* Add Region Trigger and Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full py-4 border border-dashed border-[#E9E1D5] rounded-xl flex items-center justify-center gap-3 text-[#888] font-rope font-medium text-[14px] hover:bg-white hover:border-[#C05D2E] hover:text-[#C05D2E] transition-all group cursor-pointer"
            >
              <i className="fa-solid fa-plus text-[12px] group-hover:scale-110"></i>
              Ajouter une région
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-full bg-white border border-[#E9E1D5] rounded-xl shadow-xl max-h-[250px] overflow-y-auto z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {REGIONS.map(region => {
                  const isSelected = selectedRegions.includes(region);
                  return (
                    <div
                      key={region}
                      onClick={() => toggleRegion(region)}
                      className="flex items-center gap-3 px-6 py-3.5 hover:bg-[#FAF7F2] cursor-pointer font-rope text-sm text-text-dark transition-colors border-b border-[#E9E1D5]/20 last:border-0"
                    >
                      <div className={`flex items-center justify-center w-5 h-5 rounded border ${isSelected ? 'bg-[#C05D2E] border-[#C05D2E]' : 'border-[#d0c8c0] bg-transparent'}`}>
                        {isSelected && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                      </div>
                      <span className={isSelected ? 'font-bold' : ''}>{region}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {message.text && (
          <p className={`text-center text-sm font-rope ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {message.text}
          </p>
        )}

        <div className="flex flex-col gap-6">
          <button
            onClick={handleSaveAll}
            disabled={loading}
            className="bg-[#C05D2E] hover:bg-[#A64F26] text-white font-bold font-rope text-[15px] py-4 rounded-xl transition-all duration-300 shadow-lg shadow-[#C05D2E]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder mes paramètres'}
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
