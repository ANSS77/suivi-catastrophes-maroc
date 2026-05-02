import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import MoroccoMap from '../components/map/MoroccoMap';

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen bg-app-bg overflow-hidden">
      {/* Top Navigation */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content Area - Map */}
        <main className="flex-1 p-8 relative">
          <div className="w-full h-full">
            <MoroccoMap />
          </div>
          
          {/* Optional: Add a floating search bar or info overlay here if needed later */}
        </main>
      </div>
    </div>
  );
}
