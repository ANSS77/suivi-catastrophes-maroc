import React from 'react';

const sidebarItems = [
  { id: 'profile', label: 'Mon Profil', icon: 'fa-solid fa-user' },
  { id: 'regions', label: 'Mes Régions & Alertes', icon: 'fa-solid fa-earth-africa' },
  { id: 'security', label: 'Sécurité', icon: 'fa-solid fa-shield-halved' },
];

export default function ProfileSidebar({ activeSection, onSectionChange }) {
  return (
    <div className="w-80 h-full bg-[#FAF7F2] border-r border-[#E9E1D5]/50 py-10 flex flex-col gap-10">
      <div className="px-8">
        <h2 className="text-2xl font-gara text-[#C05D2E] font-bold">Paramètres</h2>
        <p className="text-[12px] font-rope text-[#888] font-medium tracking-wide">
          Gérez vos alertes et profil
        </p>
      </div>

      <div className="flex flex-col">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`flex items-center gap-4 px-8 py-4 transition-all duration-300 relative group ${
              activeSection === item.id
                ? 'bg-[#F2EDE4] text-[#C05D2E]'
                : 'bg-transparent text-text-dark hover:bg-[#F2EDE4]/50'
            }`}
          >
            {activeSection === item.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C05D2E]" />
            )}
            <i className={`${item.icon} text-lg ${activeSection === item.id ? 'text-[#C05D2E]' : 'text-gray-400 group-hover:text-text-dark'}`}></i>
            <span className={`text-sm font-bold font-rope tracking-wide ${activeSection === item.id ? 'text-[#C05D2E]' : 'text-text-dark'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
