import { useState, useEffect } from 'react';
import { Target, TrendingUp, Users, Award } from 'lucide-react';

export default function GuildLeaderboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/users/guilds/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Guild stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-64 border-4 border-black animate-pulse bg-gray-50 flex items-center justify-center">
       <span className="font-black uppercase tracking-widest text-gray-300">Syncing_Tribal_Data...</span>
    </div>
  );

  return (
    <div className="border-4 border-black bg-white da-shadow-black overflow-hidden sticky top-8">
      <div className="bg-black text-white p-4 flex items-center justify-between border-b-4 border-black px-6">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-yellow-400" />
          <h3 className="font-black uppercase tracking-[0.2em] text-sm">Top_Guilds_Global</h3>
        </div>
        <TrendingUp className="w-4 h-4 text-green-400" />
      </div>

      <div className="divide-y-4 divide-black">
        {stats.length > 0 ? stats.map((guild, idx) => (
          <div key={guild._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
               <div className={`w-8 h-8 ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-300' : idx === 2 ? 'bg-orange-400' : 'bg-white border-2 border-black'} flex items-center justify-center font-black text-xs`}>
                 {idx + 1}
               </div>
               <div>
                  <h4 className="font-black text-xs uppercase tracking-tight text-black truncate max-w-[140px]">{guild._id}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                     <Users className="w-3 h-3 text-gray-400" />
                     <span className="text-[9px] font-bold text-gray-500 uppercase">{guild.memberCount} MEMBERS</span>
                  </div>
               </div>
            </div>
            <div className="text-right">
               <p className="text-sm font-black text-black">${guild.totalEarnings.toLocaleString()}</p>
               <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">AGGREGATED_FUNDS</p>
            </div>
          </div>
        )) : (
          <div className="p-8 text-center bg-gray-50">
             <Award className="w-8 h-8 text-gray-200 mx-auto mb-2" />
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed px-4">
               No tribes detected. Join a guild in settings to start the competition.
             </p>
          </div>
        )}
      </div>

      {stats.length > 0 && (
        <div className="p-4 bg-gray-50 border-t-4 border-black text-center">
           <p className="text-[9px] font-black uppercase tracking-widest text-black">
             Live data sync: Every deployment affects ranking.
           </p>
        </div>
      )}
    </div>
  );
}
