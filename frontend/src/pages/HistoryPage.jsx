import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import StatsCard from '../components/history/StatsCard';
import HistoryFilters from '../components/history/HistoryFilters';
import HistoryTable from '../components/history/HistoryTable';
import Pagination from '../components/common/Pagination';
import { getDisasters, filterDisasters } from '../services/disasterService';

export default function HistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ total: 0, seismes: 0, inondations: 0, incendies: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      setLoading(true);
      const data = await getDisasters();

      // Mapper les champs API → composant
      const mapped = data.map(d => ({
        id: d._id || d.id,
        type: d.type,
        region: d.region,
        date: new Date(d.date).toLocaleDateString('fr-FR', {
          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }),
        riskLevel: d.severity,
        score: d.score,  // sera implémenté plus tard
        status: d.isActive ? 'active' : 'resolved',
      }));

      setEvents(mapped);

      // Calculer les stats
      setStats({
        total: mapped.length,
        seismes: mapped.filter(e => e.type === 'earthquake').length,
        inondations: mapped.filter(e => e.type === 'flood').length,
        incendies: mapped.filter(e => e.type === 'wildfire').length,
      });

    } catch (error) {
      console.error('Erreur chargement disasters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async ({ type, region }) => {
    try {
      setLoading(true);
      setCurrentPage(1); // Reset pagination on filter
  
      let data = type === 'all'
        ? await getDisasters()
        : await filterDisasters(type);
  
      // Filtre région côté frontend
      if (region !== 'all') {
        data = data.filter(d => d.region === region);
      }
  
      // Mapper les champs API → composant
      const mapped = data.map(d => ({
        id      : d._id || d.id,
        type    : d.type,
        region  : d.region,
        date    : new Date(d.date).toLocaleDateString('fr-FR', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        riskLevel : d.severity,
        score     : d.score,
        status    : d.isActive ? 'active' : 'resolved',
      }));
  
      setEvents(mapped);
  
      // Mettre à jour les stats
      setStats({
        total      : mapped.length,
        seismes    : mapped.filter(e => e.type === 'earthquake').length,
        inondations: mapped.filter(e => e.type === 'flood').length,
        incendies  : mapped.filter(e => e.type === 'wildfire').length,
      });
  
    } catch (error) {
      console.error('Erreur filtre:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[1250px] w-full mx-auto px-10 py-16 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <h1 className="text-[52px] font-gara text-text-dark font-medium leading-tight">
            Historique des Catastrophes
          </h1>
          <p className="text-[#888] font-rope max-w-2xl leading-relaxed">
            Consultez les archives détaillées des événements climatiques et géologiques au Maroc.
            Notre système IA analyse chaque occurrence pour affiner les modèles de prévention futurs.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard type="total"      count={stats.total} />
          <StatsCard type="seismes"    count={stats.seismes} />
          <StatsCard type="inondations" count={stats.inondations} />
          <StatsCard type="incendies"  count={stats.incendies} />
        </div>

        <HistoryFilters onFilter={handleFilter} />
        
        <div className="flex flex-col gap-8">
          {loading ? (
            <div className="text-center py-20 text-[#888] font-rope">
              Chargement...
            </div>
          ) : (
            <>
              <HistoryTable events={events.slice((currentPage - 1) * 8, currentPage * 8)} />
              <Pagination
                currentPage={currentPage}
                totalPages={Math.max(1, Math.ceil(events.length / 8))}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </div>

      </main>
    </div>
  );
}