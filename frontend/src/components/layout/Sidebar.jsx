import React from 'react';

const categories = [
  { id: 'all', name: 'ALL', icon: 'fa-solid fa-table-cells-large' },
  { id: 'seismes', name: 'SÉISMES', icon: 'fa-solid fa-mountain-sun' },
  { id: 'inondations', name: 'INONDATIONS', icon: 'fa-solid fa-water' },
  { id: 'incendies', name: 'INCENDIES', icon: 'fa-solid fa-fire' },
];

const legendItems = [
  { name: 'Séismes', color: 'bg-red-500' },
  { name: 'Inondations', color: 'bg-blue-500' },
  { name: 'Incendies', color: 'bg-orange-500' },
];

export default function Sidebar({ activeCategory, setActiveCategory }) {

  return (
    <aside className="w-80 h-full flex flex-col justify-between py-8 px-6 bg-app-bg border-r border-gray-100/50 relative z-10">

      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-2xl font-gara text-primary-orange mb-1 font-medium">Filtres</h2>
          <span className="text-[10px] tracking-[0.2em] font-bold text-gray-400 font-rope">TYPES DE CATASTROPHES</span>
        </div>

        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group ${
                activeCategory === cat.id
                  ? 'bg-primary-orange text-white shadow-lg shadow-primary-orange/20'
                  : 'bg-transparent text-text-dark hover:bg-gray-50'
              }`}
            >
              <i className={`${cat.icon} text-lg ${activeCategory === cat.id ? 'text-white' : 'text-primary-orange/70 group-hover:text-primary-orange'}`}></i>
              <span className={`text-sm font-bold tracking-widest font-rope`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Legend Card */}
      <div className="bg-sidebar-bg p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-[10px] tracking-[0.2em] font-bold text-gray-400 mb-4 font-rope">LÉGENDE</h3>
        <div className="flex flex-col gap-3">
          {legendItems.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
              <span className="text-sm font-medium text-text-dark font-rope">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
