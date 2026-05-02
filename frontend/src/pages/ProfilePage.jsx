import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileRegions from '../components/profile/ProfileRegions';
import ProfileSecurity from '../components/profile/ProfileSecurity';

const mockUser = {
  nom: "Ahmed El Mansouri",
  email: "ahmed.elmansouri@disastertrack.ma",
  regionIds: ["Marrakech-Safi", "Souss-Massa"]
};

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('profile');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileInfo user={mockUser} />;
      case 'regions':
        return <ProfileRegions user={mockUser} />;
      case 'security':
        return <ProfileSecurity />;
      default:
        return <ProfileInfo user={mockUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Fixed Sidebar Layout */}
        <ProfileSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-16 py-16">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}