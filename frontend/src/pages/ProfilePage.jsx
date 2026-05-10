import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileRegions from '../components/profile/ProfileRegions';
import ProfileSecurity from '../components/profile/ProfileSecurity';

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('profile');

  // ✅ Remplacer mockUser par localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileInfo user={user} />;
      case 'regions':
        return <ProfileRegions user={user} />;
      case 'security':
        return <ProfileSecurity />;
      default:
        return <ProfileInfo user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <ProfileSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main className="flex-1 overflow-y-auto px-16 py-16">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}