import React, { useEffect, useState } from 'react';
import { Play, ListMusic, Share2, Copy, Check } from 'lucide-react';
import { fetchVideos } from '../services/api';

const VideosSection = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const { data } = await fetchVideos();
        const videoList = data.results || data;
        setVideos(videoList);
        
        if (videoList.length > 0) {
          setActiveVideo(videoList[0]);
        }
      } catch (err) {
        console.error('Error cargando videos desde Django:', err);
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  const handleSelectVideo = (video) => {
    setActiveVideo(video);
    setIsPlaying(false); // Reseteamos el play para que muestre la miniatura del nuevo video seleccionado
    setCopied(false);
    document.getElementById('video-player-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const shareOnWhatsApp = () => {
    if (!activeVideo) return;
    const url = `https://youtu.be/${activeVideo.youtube_id}`;
    const text = encodeURIComponent(`¡Escucha este corrido alterado de la Banda Mariscos, pariente! 🔥: ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    if (!activeVideo) return;
    const url = encodeURIComponent(`https://youtu.be/${activeVideo.youtube_id}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const copyToClipboard = () => {
    if (!activeVideo) return;
    const url = `https://youtu.be/${activeVideo.youtube_id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <section id="videos" className="py-16 bg-mariscos-850 text-center text-brass animate-pulse">
        ⏳ Cargando el arsenal de videos de la banda...
      </section>
    );
  }

  return (
    <section id="videos" className="py-16 bg-mariscos-850 text-mariscos-100 border-t border-mariscos-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <span className="text-brass font-body text-xs uppercase tracking-widest font-bold">🎬 MULTIMEDIA</span>
          <h2 className="text-4xl font-display text-brass-light mt-2 tracking-wider">EL CANAL DE LA BANDA</h2>
          <div className="w-16 h-0.5 bg-brass mx-auto mt-4 rounded-full" />
        </div>

        {videos.length > 0 && activeVideo ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* El Video Principal */}
            <div id="video-player-container" className="lg:col-span-2 bg-mariscos-900 rounded-xl overflow-hidden border border-mariscos-700 shadow-2xl">
              <div className="relative aspect-video bg-mariscos-950 flex items-center justify-center group overflow-hidden">
                {isPlaying ? (
                  <iframe
                    className="w-full h-full absolute inset-0 z-20"
                    src={`https://www.youtube.com/embed/${activeVideo.youtube_id}?autoplay=1&modestbranding=1&rel=0`}
                    title={activeVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className="w-full h-full absolute inset-0 block p-0 m-0 border-0 cursor-pointer group focus:outline-none overflow-hidden"
                  >
                    {/* Imagen de fondo real en HTML para evitar fallos de comillas de CSS */}
                    <img 
                      src={`https://i.ytimg.com/vi/${activeVideo.youtube_id}/hqdefault.jpg`} 
                      alt={activeVideo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 absolute inset-0"
                    />

                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 z-10" />
                    
                    {videos[0].id === activeVideo.id && (
                      <span className="absolute top-4 left-4 z-20 bg-brass text-mariscos-900 text-xs font-bold px-3 py-1 rounded-full tracking-wider animate-bounce">
                        LO MÁS NUEVO 🔥
                      </span>
                    )}

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 flex items-center justify-center rounded-full bg-brass text-mariscos-900 shadow-xl group-hover:bg-brass-light group-hover:scale-110 transition-all duration-300">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </button>
                )}
              </div>

              {/* Información y botones interactivos */}
              <div className="p-6">
                <h3 className="text-2xl font-display text-brass tracking-wide mb-2">
                  {activeVideo.title}
                </h3>
                {activeVideo.description && (
                  <p className="text-sm font-body text-mariscos-300 leading-relaxed line-clamp-2 mb-4">
                    {activeVideo.description}
                  </p>
                )}
                
                <div className="mt-4 pt-4 border-t border-mariscos-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <span className="text-[11px] font-body text-mariscos-400 uppercase tracking-wider font-bold block mr-1">Compartir:</span>
                    
                    <button 
                      onClick={shareOnWhatsApp}
                      className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-body font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      WhatsApp
                    </button>

                    <button 
                      onClick={shareOnFacebook}
                      className="px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-600 text-white text-xs font-body font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Facebook
                    </button>

                    <button 
                      onClick={copyToClipboard}
                      className={`px-3 py-1.5 rounded text-xs font-body font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        copied ? 'bg-brass text-mariscos-900' : 'bg-mariscos-800 text-mariscos-200 hover:bg-mariscos-700'
                      }`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? '¡Copiado!' : 'Copiar Link'}
                    </button>
                  </div>

                  <a 
                    href={`https://www.youtube.com/watch?v=${activeVideo.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-body text-brass hover:text-brass-light uppercase tracking-wider font-bold transition-colors shrink-0"
                  >
                    Ver en YouTube →
                  </a>
                </div>
              </div>
            </div>

            {/* Lista de éxitos de un lado */}
            <div className="bg-mariscos-900 rounded-xl p-5 border border-mariscos-700 shadow-xl h-[420px] flex flex-col">
              <div className="flex items-center gap-2 border-b border-mariscos-800 pb-3 mb-4">
                <ListMusic className="text-brass w-5 h-5" />
                <h3 className="font-display text-lg text-brass-light tracking-wide uppercase">Otros Éxitos</h3>
              </div>
              
              <div className="space-y-2 overflow-y-auto flex-grow pr-1 custom-scrollbar">
                {videos.map((video, idx) => {
                  const isCurrent = video.id === activeVideo.id;
                  return (
                    <button
                      key={video.id}
                      onClick={() => handleSelectVideo(video)}
                      className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-all ${
                        isCurrent 
                          ? 'bg-mariscos-800 border border-brass/40 text-brass' 
                          : 'bg-mariscos-950/40 hover:bg-mariscos-800 border border-transparent text-mariscos-200 hover:text-brass-light'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold text-mariscos-500 mt-1">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-body font-medium truncate leading-snug">
                          {video.title}
                        </h4>
                        <span className="text-[11px] text-mariscos-400 block mt-0.5">
                          {isCurrent ? '▶️ Sonando ahora' : 'Ver video'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center text-mariscos-400 py-8">
            Próximamente más material pesado disponible en el catálogo.
          </div>
        )}
      </div>
    </section>
  );
};

export default VideosSection;
