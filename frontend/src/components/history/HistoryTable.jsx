import React from 'react';
import HistoryRow from './HistoryRow';

export default function HistoryTable({ events }) {
  return (
    <div className="bg-white border border-[#E9E1D5]/50 rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#FAF7F2] border-b border-[#E9E1D5]/50">
            <th className="py-5 px-6 text-[10px] font-bold font-rope tracking-[0.2em] text-[#888] uppercase">Type</th>
            <th className="py-5 px-6 text-[10px] font-bold font-rope tracking-[0.2em] text-[#888] uppercase">Région</th>
            <th className="py-5 px-6 text-[10px] font-bold font-rope tracking-[0.2em] text-[#888] uppercase">Date</th>
            <th className="py-5 px-6 text-[10px] font-bold font-rope tracking-[0.2em] text-[#888] uppercase">Niveau de Risque</th>
            <th className="py-5 px-6 text-[10px] font-bold font-rope tracking-[0.2em] text-[#888] uppercase">Score IA</th>
            <th className="py-5 px-6 text-[10px] font-bold font-rope tracking-[0.2em] text-[#888] uppercase">Statut</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <HistoryRow key={event.id || index} event={event} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
