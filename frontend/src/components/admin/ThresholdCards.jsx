import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const phenomenonConfig = {
  earthquake: { label: 'Séismes', subtitle: 'Magnitude relative', icon: 'fa-solid fa-mountain-sun' },
  flood: { label: 'Inondations', subtitle: 'Niveau des crues', icon: 'fa-solid fa-water' },
  wildfire: { label: 'Incendies', subtitle: 'Risque de propagation', icon: 'fa-solid fa-fire' }
};

const ThresholdCard = ({ phenomenon, threshold, onChange }) => {
  const config = phenomenonConfig[phenomenon] || { label: phenomenon, subtitle: '', icon: 'fa-solid fa-triangle-exclamation' };
  
  return (
    <div className="bg-white border border-[#E9E1D5]/50 rounded-[32px] p-10 flex flex-col items-center gap-8 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="w-20 h-20 rounded-full bg-[#F2EAE1] flex items-center justify-center">
        <i className={`${config.icon} text-text-dark text-3xl`}></i>
      </div>
      
      <div className="text-center">
        <h3 className="text-2xl font-gara text-text-dark font-bold">{config.label}</h3>
        <p className="text-[14px] font-rope text-[#888]">{config.subtitle}</p>
      </div>

      <div className="w-full flex flex-col gap-6 mt-2">
        <div className="flex justify-between text-[12px] font-bold font-rope tracking-[0.2em] text-[#888] uppercase px-1">
          <span>Sensible</span>
          <span>Critique</span>
        </div>
        
        <div className="relative pt-1">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={threshold || 0}
            onChange={(e) => onChange(phenomenon, parseFloat(e.target.value))}
            className="w-full h-2 bg-[#F2EDE4] rounded-lg appearance-none cursor-pointer accent-[#C05D2E]"
          />
        </div>
        
        <div className="flex justify-end">
          <span className="text-2xl font-bold font-rope text-primary-orange">{threshold}%</span>
        </div>
      </div>
    </div>
  );
};

export default function ThresholdCards() {
  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchThresholds = async () => {
      try {
        const response = await api.get('/admin/thresholds/');
        setThresholds(response.data);
      } catch (error) {
        console.error("Error fetching thresholds:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchThresholds();
  }, []);

  const handleValueChange = (phenomenon, newValue) => {
    setThresholds(prev => prev.map(t => 
      t.phenomenon === phenomenon ? { ...t, threshold: newValue } : t
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(thresholds.map(t => 
        api.put(`/admin/thresholds/`, { phenomenon: t.phenomenon, threshold: t.threshold })
      ));
      alert("Seuils sauvegardés avec succès !");
    } catch (error) {
      console.error("Error saving thresholds:", error);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-10 text-center font-rope italic text-gray-400 text-xl">Chargement des seuils...</div>;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-[52px] font-gara text-text-dark font-medium leading-tight">Seuils d'Alerte</h1>
        <p className="text-[#888] font-rope max-w-2xl text-[16px] leading-relaxed">
          Configurer la sensibilité des déclencheurs d'alerte régionaux. 
          Les modifications seront appliquées immédiatement au moteur de détection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {thresholds.map((t) => (
          <ThresholdCard 
            key={t.phenomenon}
            phenomenon={t.phenomenon} 
            threshold={t.threshold}
            onChange={handleValueChange}
          />
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary-orange hover:bg-primary-hover text-white font-bold font-rope text-[16px] px-14 py-5 rounded-[20px] transition-all duration-300 shadow-xl shadow-primary-orange/20 disabled:opacity-50 uppercase tracking-[0.2em]"
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder les seuils'}
        </button>
      </div>
    </div>
  );
}
