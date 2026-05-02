
import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import StatsCard from '../components/history/StatsCard';
import HistoryFilters from '../components/history/HistoryFilters';
import HistoryTable from '../components/history/HistoryTable';
import Pagination from '../components/common/Pagination';

const mockEvents = [
  {
    id: 1,
    type: "earthquake",
    region: "Souss-Massa",
    date: "14 Jan 2024, 10:30",
    riskLevel: "high",
    score: 78,
    status: "active"
  },
  {
    id: 2,
    type: "flood",
    region: "Béni Mellal-Khénifra",
    date: "13 Jan 2024, 18:15",
    riskLevel: "medium",
    score: 45,
    status: "resolved"
  },
  {
    id: 3,
    type: "wildfire",
    region: "Tanger-Tétouan-Al Hoceïma",
    date: "12 Jan 2024, 09:45",
    riskLevel: "low",
    score: 12,
    status: "resolved"
  },
  {
    id: 4,
    type: "earthquake",
    region: "Marrakech-Safi",
    date: "12 Jan 2024, 23:55",
    riskLevel: "high",
    score: 82,
    status: "active"
  },
  {
    id: 5,
    type: "flood",
    region: "Rabat-Salé-Kénitra",
    date: "10 Jan 2024, 14:20",
    riskLevel: "medium",
    score: 53,
    status: "resolved"
  },
];

export default function HistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-app-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1250px] w-full mx-auto px-10 py-16 flex flex-col gap-12">

        {/* Header Section */}
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
          <StatsCard type="total" count={154} />
          <StatsCard type="seismes" count={42} />
          <StatsCard type="inondations" count={86} />
          <StatsCard type="incendies" count={26} />
        </div>

        {/* Filters */}
        <HistoryFilters />

        {/* Table Section */}
        <div className="flex flex-col gap-8">
          <HistoryTable events={mockEvents} />

          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

      </main>
    </div>
  );
}


