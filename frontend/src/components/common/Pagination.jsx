import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-12 mt-10">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-3 font-bold font-rope text-[13px] transition-colors group ${
          currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-primary-orange'
        }`}
      >
        <i className="fa-solid fa-arrow-left text-[11px] group-not-disabled:group-hover:-translate-x-1 transition-transform"></i>
        Précédent
      </button>

      <div className="flex items-center gap-8">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-11 h-11 rounded-full font-bold font-rope text-sm transition-all duration-300 ${
              currentPage === page
                ? 'bg-[#BA612D] text-white shadow-lg shadow-[#BA612D]/30 border-none'
                : 'bg-transparent border border-transparent text-gray-400 hover:text-primary-orange'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-3 font-bold font-rope text-[13px] transition-all duration-300 group ${
          currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-[#C05D2E] hover:opacity-80'
        }`}
      >
        Suivant
        <i className="fa-solid fa-arrow-right text-[11px] group-not-disabled:group-hover:translate-x-1 transition-transform"></i>
      </button>
    </div>
  );
}
