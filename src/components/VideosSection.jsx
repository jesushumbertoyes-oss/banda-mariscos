import React, { useState } from 'react';
import { Play } from 'lucide-react';

const VideosSection = () => {
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const videos = [
    {
      id: 1,
      title: "Banda Mariscos - El Toro Tumbado",
      description: "Puro metal pesado, güiro tradicional y tololoche raspado. Corrido Moderno Regional Urbano.",
      youtubeId: "_vTf1VfUMd4",
      watchUrl: "https://youtu.be/_vTf1VfUMd4"
    }
  ];

  return (
    <section id="videos" className="py-16 bg-mariscos-850 text-mariscos-100 border-t border-mariscos-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brass font-body text-xs uppercase tracking-widest font-bold">🎬 NUESTROS VIDEOS</span>
          <h2 className="text-4xl font-display text-brass-light mt-2 tracking-wider">LO MÁS RECIENTE DEL CANAL</h2>
          <div className="w-16 h-0.5 bg-brass mx-auto mt-4 rounded-full" />
        </div>

        <div className="max-w-3xl mx-auto">
          {videos.map((video) => (
            <div key={video.id} className="bg-mariscos-900 rounded-xl overflow-hidden border border-mariscos-700 shadow-2xl hover:border-brass/30 transition-all duration-300">
              
              <div className="relative aspect-video bg-mariscos-950 flex items-center justify-center group overflow-hidden">
                {playingVideoId === video.id ? (
                  <iframe
                    className="w-full h-full absolute inset-0 z-20"
                    src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&modestbranding=1&rel=0`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ) : (
                  /* Miniatura real traída directamente desde los servidores de YouTube */
                  <button 
                    onClick={() => setPlayingVideoId(video.id)}
                    className="w-full h-full absolute inset-0 block p-0 m-0 border-0 cursor-pointer group focus:outline-none"
                    style={{
                      backgroundImage: `url(https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Capa oscura encima de la imagen para que resalte el botón de play */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 z-10" />
                    
                    {/* Botón de Play Flotante */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 flex items-center justify-center rounded-full bg-brass text-mariscos-900 shadow-xl group-hover:bg-brass-light group-hover:scale-110 transition-all duration-300">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </button>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-display text-brass tracking-wide mb-2">
                  {video.title}
                </h3>
                <p className="text-sm font-body text-mariscos-300 leading-relaxed">
                  {video.description}
                </p>
                <div className="mt-4 pt-4 border-t border-mariscos-800 flex justify-end">
                  <a 
                    href={video.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-body text-brass hover:text-brass-light uppercase tracking-wider font-semibold transition-colors"
                  >
                    Ver directamente en YouTube →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideosSection;
