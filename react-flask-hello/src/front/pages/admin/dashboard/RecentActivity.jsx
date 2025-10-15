import React from 'react';

const RecentActivity = ({ activities, formatTimeAgo }) => {
  if (!activities.length) {
    return (
      <section className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Actividad Reciente</h2>
        <div className="text-center py-8 text-[#779385]">
          <div className="text-4xl mb-2">📝</div>
          <p>No hay actividad reciente</p>
          <p className="text-sm mt-1">Los pedidos y actualizaciones aparecerán aquí</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
      <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Actividad Reciente</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <article key={index} className="flex items-center space-x-3 p-3 bg-[#f7f2e7] rounded-lg hover:bg-[#e8dfd1] transition-colors">
            <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center text-lg`}>
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-[#2f4823]">{activity.message}</p>
              <p className="text-sm text-[#779385]">{activity.details}</p>
              <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RecentActivity;