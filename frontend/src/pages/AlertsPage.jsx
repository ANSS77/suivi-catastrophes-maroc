import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import AlertCard from '../components/alerts/AlertCard';
import Pagination from '../components/common/Pagination';
import { getAlerts } from '../services/alertService';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'earthquake', label: 'Séismes' },
  { id: 'flood', label: 'Inondations' },
  { id: 'wildfire', label: 'Incendies' },
];

export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await getAlerts();

      // Mapper les champs API → composant
      const mapped = data.map(a => ({
        id: a._id || a.id,
        type: a.type,
        title: a.message,
        score: a.score || 0,  // sera implémenté plus tard
        date: new Date(a.date).toLocaleDateString('fr-FR', {
          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }),
        location: a.regionId,
      }));

      // Inverser pour avoir les plus récentes en premier
      setAlerts(mapped.reverse());
    } catch (error) {
      console.error('Erreur chargement alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = activeFilter === 'all'
    ? alerts
    : alerts.filter(a => a.type === activeFilter);

  const ITEMS_PER_PAGE = 11;
  const totalPages = Math.ceil(filteredAlerts.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentAlerts = filteredAlerts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-app-bg flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-10 py-16 flex flex-col gap-12">

        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-5">
            <h1 className="text-[52px] font-gara text-text-dark font-medium leading-none">
              Mes Alertes
            </h1>
            <span className="bg-[#C05D2E] text-white w-9 h-9 rounded-full flex items-center justify-center font-rope font-bold text-sm mt-3 shadow-lg shadow-[#C05D2E]/20">
              {filteredAlerts.length}
            </span>
          </div>

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

        <div className="flex flex-col gap-5">
          {loading ? (
            <div className="text-center py-20 text-[#888] font-rope">
              Chargement...
            </div>
          ) : currentAlerts.length > 0 ? (
            currentAlerts.map((alert, i) => (
              <AlertCard key={alert.id || i} alert={alert} />
            ))
          ) : (
            <div className="py-20 text-center text-gray-400 font-rope italic">
              Aucune alerte trouvée.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </main>
    </div>
  );
}