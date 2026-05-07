import React from 'react';
import Navbar from '../components/layout/Navbar';
import UserTable from '../components/admin/UserTable';
import ThresholdCards from '../components/admin/ThresholdCards';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-app-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1250px] w-full mx-auto px-10 py-16 flex flex-col gap-20">
        
        {/* User Management Section */}
        <section>
          <UserTable />
        </section>

        {/* Divider */}
        <hr className="border-[#E9E1D5]/30" />

        {/* Threshold Configuration Section */}
        <section>
          <ThresholdCards />
        </section>

      </main>
    </div>
  );
}
