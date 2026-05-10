import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import MoroccoMap from '../components/map/MoroccoMap';
import { getDisasters } from '../services/disasterService';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      setLoading(true);
      const data = await getDisasters();

      // Mapper API → MoroccoMap
      const mapped = data.map(d => ({
        id    : d._id || d.id,
        type  : d.type,
        lat   : d.latitude,
        lng   : d.longitude,
        region: d.region,
        risk  : d.severity,
        date  : d.date,
        score : d.score,  // sera implémenté plus tard
      }));

      setDisasters(mapped);
    } catch (error) {
      console.error('Erreur chargement disasters:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-app-bg overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <main className="flex-1 p-8 relative">
          <div className="w-full h-full">
            {loading ? (
              <div className="flex items-center justify-center h-full text-[#888] font-rope">
                Chargement de la carte...
              </div>
            ) : (
              <MoroccoMap disasters={disasters} activeCategory={activeCategory} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}