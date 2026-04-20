import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Calendar, Tag, Zap } from 'lucide-react';
import { NewsItem } from '../types';

export function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        const data = await res.json();
        setNews(data.articles || []);
        setCached(data.cached || false);
        setLoading(false);
      } catch (err) {
        console.error("News sync failed", err);
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-brand-safe border-t-transparent animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Accessing Global Intelligence Hub...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 px-4 py-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-end gap-6"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-safe text-[10px] font-black uppercase tracking-[0.3em]">
             <Zap size={12} fill="currentColor" />
             {cached ? 'Retrieved from Edge-Node-Mumbai' : 'Syncing Global News Shards'}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Species <span className="text-brand-safe">Insights</span></h2>
          <p className="text-white/60 max-w-xl">The latest intelligence from the global herpetological community, covering research, conservation, and safety technology.</p>
        </div>
        <button className="px-6 py-3 glass rounded-full text-sm font-bold border-white/5 hover:bg-white/5 transition-all flex items-center gap-2 group">
          View All Logs
          <ExternalLink size={16} className="text-white/20 group-hover:text-brand-safe transition-all" />
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {news.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group glass rounded-[2.5rem] overflow-hidden border border-white/5 flex flex-col md:flex-row h-full md:h-64 cursor-pointer"
            onClick={() => (item as any).url && window.open((item as any).url, '_blank')}
          >
            <div className="md:w-1/3 relative overflow-hidden">
               <img 
                src={item.imageUrl} 
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <div className="px-3 py-1 bg-brand-safe text-[#0a0a0a] text-[10px] font-bold rounded-full uppercase tracking-widest">
                  {item.category}
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {item.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag size={12} />
                    {item.category}
                  </div>
                </div>
                <h3 className="text-xl font-bold leading-tight group-hover:text-brand-safe transition-colors line-clamp-2">{item.title}</h3>
                <p className="text-white/40 text-sm line-clamp-2 italic">{item.excerpt}</p>
              </div>
              
              <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                Read Full Entry
                <ExternalLink size={14} className="text-brand-safe" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
