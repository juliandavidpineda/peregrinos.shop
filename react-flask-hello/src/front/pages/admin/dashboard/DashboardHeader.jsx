import React from 'react';

const DashboardHeader = ({ user, currentTime, onRefresh, error }) => {
  return (
    <header className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-serif font-bold text-3xl text-[#2f4823]">Dashboard</h1>
          <p className="text-[#779385] mt-2">
            Bienvenido de vuelta, <span className="font-semibold">{user?.first_name} {user?.last_name}</span>
          </p>
          <div className="flex items-center gap-4 mt-4 text-sm text-[#779385]">
            <span>📅 {currentTime}</span>
            <span>•</span>
            <span>🔄 
              <button onClick={onRefresh} className="hover:text-[#2f4823] transition-colors underline ml-1">
                Actualizar datos
              </button>
            </span>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;