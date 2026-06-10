import React, { useEffect, useState } from 'react';
import { Play, ListMusic } from 'lucide-react';
import { fetchVideos } from '../services/api';

const VideosSection = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Guardamos cuál es el video que se está mostrando/reproduciendo actualmente arriba
  const [activeVideo, setActiveVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const { data } = await fetchVideos();
        const videoList = data.results || data;
        setVideos(videoList);
        
        // El primer video (el más nuevo) se queda como el activo por defecto
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

  // Función para cuando el usuario le pica a un título de la lista de abajo
  const handleSelectVideo = (video) => {
    setActiveVideo(video);
    setIsPlaying(true); // Se activa el reproductor de YouTube de inmediato
    
    // Un scroll ligerito hacia arriba para que el usuario vea el video que seleccionó
    document.getElementById('video-player-container')?.scrollIntoView({ behavior: 'smooth' });
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
        
        {/* Encabezado */}
        <div className="text-center mb-12">
          <span className="text-brass font-body text-xs uppercase tracking-widest font-bold">🎬 MULTIMEDIA</span>
          <h2 className="text-4xl font-display text-brass-light mt-2 tracking-wider">EL CANAL DE LA BANDA</h2>
          <div className="w-16 h-0.5 bg-brass mx-auto mt-4 rounded-full" />
        </div>

        {videos.length > 0 && activeVideo ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* COLUMNA IZQUIERDA Y CENTRO: El Video Principal (Ocupa 2 columnas en pantallas grandes) */}
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
                    className="w-full h-full absolute inset-0 block p-0 m-0 border-0 cursor-pointer group focus:outline-none"
                    style={{
                      backgroundImage: `url(https://i.ytimg.com/vi/${activeVideo.youtube_id}/maxresdefault.jpg)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300 z-10" />
                    
                    {/* Etiqueta flotante de "Lo Último" si es el video más nuevo */}
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

              {/* Detalles del video que se está viendo */}
              <div className="p-6">
                <h3 className="text-2xl font-display text-brass tracking-wide mb-2">
                  {activeVideo.title}
                </h3>
                {activeVideo.description && (
                  <p className="text-sm font-body text-mariscos-300 leading-relaxed line-clamp-2">
                    {activeVideo.description}
                  </p>
                )}
              </div>
            </div>

            {/* COLUMNA DERECHA: La lista de los otros videos para cliquear */}
            <div className="bg-mariscos-900 rounded-xl p-5 border border-mariscos-700 shadow-xl h-[420px] flex flex-col">
              <div className="flex items-center gap-2 border-b border-mariscos-800 pb-3 mb-4">
                <ListMusic className="text-brass w-5 h-5" />
                <h3 className="font-display text-lg text-brass-light tracking-wide uppercase">Otros Éxitos</h3>
              </div>
              
              {/* Contenedor con scroll por si tienes muchos videos en la base de datos */}
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
