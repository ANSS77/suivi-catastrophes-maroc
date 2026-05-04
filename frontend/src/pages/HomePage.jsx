import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import MoroccoMap from '../components/map/MoroccoMap';

const mockDisasters = [
  { id: 1, type: "earthquake", lat: 31.0, lng: -4.0, region: "Drâa-Tafilalet", score: 78, risk: "high" },
  { id: 2, type: "flood", lat: 34.0, lng: -6.8, region: "Rabat-Salé-Kénitra", score: 45, risk: "medium" },
  { id: 3, type: "wildfire", lat: 35.5, lng: -5.3, region: "Tanger-Tétouan", score: 82, risk: "high" },
  { id: 4, type: "earthquake", lat: 30.4, lng: -9.6, region: "Souss-Massa", score: 65, risk: "medium" },
  { id: 5, type: "flood", lat: 32.3, lng: -6.3, region: "Béni Mellal-Khénifra", score: 30, risk: "low" },
  { id: 6, type: "wildfire", lat: 33.9, lng: -5.0, region: "Fès-Meknès", score: 90, risk: "high" },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="flex flex-col h-screen bg-app-bg overflow-hidden">
      {/* Top Navigation */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        {/* Main Content Area - Map */}
        <main className="flex-1 p-8 relative">
          <div className="w-full h-full">
            <MoroccoMap disasters={mockDisasters} activeCategory={activeCategory} />
          </div>
        </main>
      </div>
    </div>
  );
}

