import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import AlertCard from '../components/alerts/AlertCard';
import Pagination from '../components/common/Pagination';

const mockAlerts = [
  {
    id: 1,
    type: "earthquake",
    title: "Risque séisme — Région Souss-Massa",
    score: 78,
    date: "14 Jan 2024, 10:30",
    location: "Souss-Massa, Agadir",
  },
  {
    id: 2,
    type: "flood",
    title: "Alerte Inondation — Province d'Azilal",
    score: 45,
    date: "13 Jan 2024, 18:15",
    location: "Béni Mellal-Khénifra",
  },
  {
    id: 3,
    type: "wildfire",
    title: "Vigilance Incendie — Forêt de Chefchaouen",
    score: 12,
    date: "12 Jan 2024, 09:45",
    location: "Tanger-Tétouan-Al Hoceïma",
  },
  {
    id: 4,
    type: "earthquake",
    title: "Activité sismique détectée — Province d'Al Haouz",
    score: 82,
    date: "12 Jan 2024, 23:55",
    location: "Marrakech-Safi",
  },
];

const filters = [
  { id: 'all', label: 'All' },
  { id: 'earthquake', label: 'Séismes' },
  { id: 'flood', label: 'Inondations' },
  { id: 'wildfire', label: 'Incendies' },
];

export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredAlerts = activeFilter === 'all' 
    ? mockAlerts 
    : mockAlerts.filter(alert => alert.type === activeFilter);

  return (
    <div className="min-h-screen bg-app-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-10 py-16 flex flex-col gap-12">
        {/* Header Section */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-5">
            <h1 className="text-[52px] font-gara text-text-dark font-medium leading-none">Mes Alertes</h1>
            <span className="bg-[#C05D2E] text-white w-9 h-9 rounded-full flex items-center justify-center font-rope font-bold text-sm mt-3 shadow-lg shadow-[#C05D2E]/20">
              {mockAlerts.length}
            </span>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-8 py-2.5 rounded-full font-rope text-[13px] font-bold transition-all duration-300 border uppercase tracking-wider ${
                  activeFilter === f.id
                    ? 'bg-[#BA612D] border-[#BA612D] text-white shadow-lg shadow-[#BA612D]/30'
                    : 'bg-transparent border-[#E9E1D5] text-[#888] hover:border-[#BA612D] hover:text-[#BA612D]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* List Section */}
        <div className="flex flex-col gap-5">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          ) : (
            <div className="py-20 text-center text-gray-400 font-rope italic">
              Aucune alerte trouvée pour cette catégorie.
            </div>
          )}
        </div>

        <Pagination 
          currentPage={1} 
          totalPages={3} 
          onPageChange={(page) => console.log('Page switched to:', page)} 
        />
      </main>
    </div>
  );
}

