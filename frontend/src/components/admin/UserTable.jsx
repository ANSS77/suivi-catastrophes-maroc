import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Pagination from '../common/Pagination';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users/?page=${page}`);
      setUsers(response.data.results || response.data); // Adjust based on your API structure (pagination vs simple list)
      // Assuming API returns total_pages if paginated
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleToggleStatus = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle/`);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      ));
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
    try {
      await api.delete(`/admin/users/${userId}/delete/`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-[52px] font-gara text-text-dark font-medium leading-tight">Gestion des Utilisateurs</h1>
        <p className="text-[#888] font-rope max-w-2xl leading-relaxed">
          Gérer les accès, les rôles et le statut des collaborateurs.
        </p>
      </div>

      <div className="bg-white border border-[#E9E1D5]/50 rounded-[32px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF7F2] border-b border-[#E9E1D5]/50">
              <th className="py-6 px-10 text-[11px] font-bold font-rope tracking-[0.2em] text-[#888] uppercase">Nom</th>
              <th className="py-6 px-10 text-[11px] font-bold font-rope tracking-[0.2em] text-[#888] uppercase">Email</th>
              <th className="py-6 px-10 text-[11px] font-bold font-rope tracking-[0.2em] text-[#888] uppercase">Rôle</th>
              <th className="py-6 px-10 text-[11px] font-bold font-rope tracking-[0.2em] text-[#888] uppercase">Statut</th>
              <th className="py-6 px-10 text-[11px] font-bold font-rope tracking-[0.2em] text-[#888] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-20 text-center text-gray-400 font-rope italic">Chargement des utilisateurs...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center text-gray-400 font-rope italic">Aucun utilisateur trouvé.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-[#E9E1D5]/30 hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-7 px-10 font-rope font-bold text-[15px] text-text-dark">{user.nom || user.name || "N/A"}</td>
                  <td className="py-7 px-10 font-rope text-[15px] text-[#888]">{user.email}</td>
                  <td className="py-7 px-10 text-[15px]">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest ${
                      user.role === 'admin' ? 'bg-[#FFEDD5] text-primary-orange' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {user.role === 'admin' ? 'ADMIN' : 'USER'}
                    </span>
                  </td>
                  <td className="py-7 px-10">
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={user.isActive} 
                          onChange={() => handleToggleStatus(user.id)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C05D2E]"></div>
                      </label>
                  </td>
                  <td className="py-7 px-10 text-right">
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <div className="p-6 border-t border-[#E9E1D5]/50">
           <Pagination 
             currentPage={currentPage}
             totalPages={totalPages}
             onPageChange={setCurrentPage}
           />
        </div>
      </div>
    </div>
  );
}
