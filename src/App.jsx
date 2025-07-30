import React, { useState, useEffect, useRef } from 'react';

// Toast Notification System
let showToast;
const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    showToast = (message, type = 'info') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };
  }, []);

  const removeToast = id => setToasts(prev => prev.filter(t => t.id !== id));

  const getToastStyles = type => {
    const base = "mb-2 p-4 rounded-lg shadow-md transition-all duration-300 transform";
    const map = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      warning: "bg-yellow-500 text-white",
      info: "bg-blue-500 text-white"
    };
    return `${base} ${map[type] || map.info}`;
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={getToastStyles(t.type)} onClick={() => removeToast(t.id)}>
          <div className="flex justify-between items-center">
            <span>{t.message}</span>
            <button className="ml-4 text-white hover:text-gray-200">×</button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Theme Toggle Component
const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);
  return (
    <button
      onClick={() => setDark(d => !d)}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
      aria-label="Toggle dark mode"
    >
      {dark ? (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};
// Loading Spinner Component
const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizes = { small: 'w-4 h-4', medium: 'w-8 h-8', large: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-pink-600 ${sizes[size]}`}></div>
      {text && <p className="mt-4 text-gray-600 dark:text-gray-300">{text}</p>}
    </div>
  );
};

// Music Visualizer Component
const MusicVisualizer = ({ isPlaying = false, size = 'medium' }) => {
  const sz = { small: 'w-6 h-6', medium: 'w-8 h-8', large: 'w-12 h-12' }[size];
  return (
    <div className={`flex items-end justify-center space-x-1 ${sz}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-pink-600 rounded ${isPlaying ? 'animate-pulse' : 'h-2'}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

// SVG Icons
const ICONS = {
  PLAY_FILLED: "M8 5v14l11-7z",
  PAUSE_FILLED: "M6 19h4V5H6v14zm8-14v14h4V5h-4z",
  FORWARD: "M10 18v-12l8.5 6L10 18zM4 6v12h2V6H4z",
  REWIND: "M14 6v12l-8.5-6L14 6zM6 18V6H4v12h2z",
  SEARCH: "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
  VOLUME_HIGH: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z",
  VOLUME_OFF: "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z",
  DOTS_VERTICAL: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
  PLAYLIST: "M2 16h8v-2H2v2zm0-4h12v-2H2v2zm0-4h12V6H2v2zm14 4h4v-2h-4v2zm0-4h4V6h-4v2zm0 8h4v-2h-4v2z",
  SETTINGS: "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98z",
};

// Icon Wrapper
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}>
    <path d={path} />
  </svg>
);

// Player Control Button
const PlayerButton = ({ onClick, disabled, iconPath }) => (
  <button onClick={onClick} disabled={disabled} className="text-neutral-700 dark:text-neutral-300 disabled:text-neutral-400 transition-transform active:scale-90">
    <Icon path={iconPath} />
  </button>
);

function App() {
  const [activeView, setActiveView] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('lofi hip hop radio');
  const [searchResults, setSearchResults] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isApiReady, setIsApiReady] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTrack, setMenuTrack] = useState(null);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [quality, setQuality] = useState('high');

  const playerRef = useRef(null);
  const progressRef = useRef(null);
  const intervalRef = useRef(null);
  const silentAudioRef = useRef(null);
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  const nowPlaying = queue[currentTrackIndex];

  // Keyboard Shortcuts
  useEffect(() => {
    const handler = e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); togglePlayPause(); }
      if (e.code === 'ArrowRight') playNext();
      if (e.code === 'ArrowLeft') playPrevious();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Load/Save Playlists & Quality
  useEffect(() => {
    const load = () => {
      const pls = localStorage.getItem('musicPlayer-playlists');
      if (pls) setPlaylists(JSON.parse(pls));
      const q = localStorage.getItem('musicPlayer-quality');
      if (q) setQuality(q);
    };
    load();
  }, []);
  useEffect(() => localStorage.setItem('musicPlayer-playlists', JSON.stringify(playlists)), [playlists]);
  useEffect(() => localStorage.setItem('musicPlayer-quality', quality), [quality]);
  // Media Session API
  useEffect(() => {
    if ('mediaSession' in navigator && nowPlaying) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: nowPlaying.title,
        artist: nowPlaying.artist,
        artwork: [{ src: nowPlaying.thumbnail, sizes: '512x512', type: 'image/jpeg' }]
      });
      navigator.mediaSession.setActionHandler('play', togglePlayPause);
      navigator.mediaSession.setActionHandler('pause', togglePlayPause);
      navigator.mediaSession.setActionHandler('previoustrack', playPrevious);
      navigator.mediaSession.setActionHandler('nexttrack', playNext);
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [nowPlaying, isPlaying]);

  // Silent Audio for iOS
  useEffect(() => {
    if (silentAudioRef.current) {
      if (isPlaying) silentAudioRef.current.play().catch(() => {});
      else silentAudioRef.current.pause();
    }
  }, [isPlaying]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT) { setIsApiReady(true); return; }
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    window.onYouTubeIframeAPIReady = () => setIsApiReady(true);
    document.head.appendChild(tag);
  }, []);
  // Initialize YouTube Player
  useEffect(() => {
    if (isApiReady && nowPlaying) {
      if (playerRef.current) playerRef.current.destroy();
      playerRef.current = new window.YT.Player('youtube-player-container', {
        videoId: nowPlaying.id,
        height: '0', width: '0',
        playerVars: { autoplay: 1, controls: 0, modestbranding: 1, disablekb: 1, rel: 0 },
        events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange, onError: onPlayerError }
      });
    }
    return () => playerRef.current && playerRef.current.destroy();
  }, [isApiReady, nowPlaying]);

  // Progress Updater
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const p = playerRef.current;
        if (p && p.getCurrentTime) {
          const ct = p.getCurrentTime(), d = p.getDuration();
          setProgress(d > 0 ? (ct / d) * 100 : 0);
        }
      }, 500);
    } else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentTrackIndex]);
   // Initial Search
  useEffect(() => {
    if (API_KEY) handleSearch();
  }, [API_KEY]);

  // Search Handler
  const handleSearch = async e => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;
    if (!API_KEY) { setError("YouTube API Key missing."); showToast("Missing API Key", "error"); return; }
    setIsLoading(true); setError(null); setSearchResults([]);
    try {
      const def = quality === 'low' ? 'standard' : 'high';
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&videoDefinition=${def}&q=${encodeURIComponent(searchTerm)}&key=${API_KEY}`);
      if (!res.ok) throw new Error((await res.json()).error?.message || res.status);
      const { items } = await res.json();
      const results = items.map(i => ({
        id: i.id.videoId,
        title: i.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&"),
        artist: i.snippet.channelTitle,
        thumbnail: i.snippet.thumbnails.high.url
      }));
      setSearchResults(results);
      results.length && showToast(`Found ${results.length} tracks`, "success");
    } catch (err) {
      setError(`Search error: ${err.message}`); showToast("Search failed", "error");
    }
    setIsLoading(false);
  };
  // Playback Controls & Helpers
  const playRelatedSong = async () => {
    if (!nowPlaying) return;
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${nowPlaying.id}&type=video&maxResults=1&key=${API_KEY}`);
      if (!res.ok) return;
      const itm = (await res.json()).items[0];
      if (itm) setQueue(q => [...q, { id: itm.id.videoId, title: itm.snippet.title, artist: itm.snippet.channelTitle, thumbnail: itm.snippet.thumbnails.high.url }]);
    } catch {}
  };

  const handleSelectTrack = track => {
    setQueue(q => [track, ...q.slice(currentTrackIndex + 1)]);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
    showToast(`Now playing: ${track.title}`, "success");
  };

  const playNext = () => currentTrackIndex < queue.length - 1 ? setCurrentTrackIndex(i => i + 1) : playRelatedSong();
  const playPrevious = () => queue.length && setCurrentTrackIndex(i => (i - 1 + queue.length) % queue.length);

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      showToast("Paused", "info");
    } else playerRef.current.playVideo();
  };

  const handleSeek = e => {
    const el = progressRef.current;
    if (!el || !playerRef.current) return;
    const rect = el.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    playerRef.current.seekTo(playerRef.current.getDuration() * ratio, true);
    setProgress(ratio * 100);
  };

  const handleVolumeChange = e => {
    const v = Number(e.target.value);
    setVolume(v);
    playerRef.current?.setVolume(v);
  };
  // YouTube Player Callbacks
  const onPlayerReady = e => { e.target.setVolume(volume); e.target.playVideo(); };
  const onPlayerStateChange = e => {
    setIsPlaying(e.data === window.YT.PlayerState.PLAYING);
    if (e.data === window.YT.PlayerState.ENDED) playNext();
  };
  const onPlayerError = e => {
    setError(`Player error code ${e.data}`); showToast("Playback error", "error"); playNext();
  };

  // Menu & Playlist Modals
  const openMenu = track => { setMenuTrack(track); setIsMenuOpen(true); };
  const closeMenu = () => { setIsMenuOpen(false); setMenuTrack(null); };
  const handleAddToQueue = () => { setQueue(q => [...q, menuTrack]); showToast("Added to queue", "success"); closeMenu(); };

  const handleShare = async () => {
    const data = { title: menuTrack.title, text: `Listen to ${menuTrack.title}`, url: `https://www.youtube.com/watch?v=${menuTrack.id}` };
    try { navigator.share ? await navigator.share(data) : (navigator.clipboard.writeText(data.url), showToast("Link copied", "success")); }
    catch { showToast("Share failed", "error"); }
    closeMenu();
  };

  const createPlaylist = () => {
    if (newPlaylistName.trim()) {
      const p = { id: Date.now(), name: newPlaylistName, tracks: [menuTrack] };
      setPlaylists(pls => [...pls, p]);
      setNewPlaylistName("");
      setIsPlaylistModalOpen(false);
      showToast(`Playlist "${p.name}" created`, "success");
      closeMenu();
    }
  };

  const addToPlaylist = id => {
    setPlaylists(pls => pls.map(p => p.id === id && !p.tracks.some(t => t.id === menuTrack.id) ? { ...p, tracks: [...p.tracks, menuTrack] } : p));
    setIsPlaylistModalOpen(false);
    showToast("Added to playlist", "success");
    closeMenu();
  };
  // Render Views
  const renderView = () => {
    switch (activeView) {
      case 'playlists':
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6 dark:text-white">Playlists</h1>
            {playlists.length ? (
              <div className="space-y-4">
                {playlists.map(p => (
                  <div key={p.id} className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
                    <h2 className="font-bold dark:text-white">{p.name}</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{p.tracks.length} songs</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 dark:text-neutral-400">No playlists yet.</p>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold dark:text-white">Settings</h1>
              <ThemeToggle />
            </div>
            <div className="space-y-4">
              <label htmlFor="quality" className="font-semibold block mb-2 dark:text-white">Streaming Quality</label>
              <select
                id="quality"
                value={quality}
                onChange={e => setQuality(e.target.value)}
                className="bg-neutral-200 dark:bg-neutral-700 dark:text-white rounded-md p-2 w-full"
              >
                <option value="high">High Quality</option>
                <option value="low">Data Saver</option>
              </select>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Data Saver reduces bandwidth usage.</p>
            </div>
          </div>
        );

      case 'browse':
      default:
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="md:hidden mb-4">
              <form onSubmit={handleSearch} className="relative">
                <Icon path={ICONS.SEARCH} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  className="w-full bg-neutral-200 dark:bg-neutral-700 dark:text-white rounded-md py-2 pl-10 pr-3 text-sm placeholder-neutral-500 dark:placeholder-neutral-400"
                  placeholder="Search"
                  type="search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </form>
            </div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold hidden md:block dark:text-white">Browse</h1>
              {isPlaying && <MusicVisualizer isPlaying={isPlaying} size="medium" />}
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-4 border border-red-200 dark:border-red-700">
                {error}
              </div>
            )}

            {isLoading ? (
              <LoadingSpinner size="large" text="Searching music..." />
            ) : searchResults.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {searchResults.map(track => (
                  <div key={track.id} className="group">
                    <div
                      onClick={() => handleSelectTrack(track)}
                      className="relative aspect-square rounded-lg overflow-hidden shadow-md transition group-hover:shadow-xl cursor-pointer"
                    >
                      <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover transition group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icon path={ICONS.PLAY_FILLED} className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex-grow truncate">
                        <p className="font-semibold truncate text-sm dark:text-white">{track.title}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{track.artist}</p>
                      </div>
                      <button onClick={() => openMenu(track)} className="p-1">
                        <Icon path={ICONS.DOTS_VERTICAL} className="w-5 h-5 text-neutral-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-neutral-500 dark:text-neutral-400">
                <h2 className="text-2xl font-bold mb-2">No Results Found</h2>
                <p>Try searching for something else.</p>
              </div>
            )}
          </div>
        );
    }
  };
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen font-['Inter'] flex flex-col antialiased transition-colors duration-300">
      <Toast />
      <audio ref={silentAudioRef} loop src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA" />
      <div id="youtube-player-container" className="hidden"></div>

      <div className="flex flex-grow overflow-hidden">
        <aside className="w-64 bg-neutral-50 dark:bg-gray-800 border-r border-neutral-200 dark:border-gray-700 p-4 hidden md:flex flex-col">
          <form onSubmit={handleSearch} className="relative mb-8">
            <Icon path={ICONS.SEARCH} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              className="w-full bg-neutral-200 dark:bg-neutral-700 dark:text-white rounded-md py-2 pl-10 pr-3 text-sm placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Search"
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </form>
          <nav className="space-y-2">
            <button onClick={() => setActiveView('browse')} className={`w-full text-left p-2 rounded-md ${activeView==='browse'?'bg-pink-100 text-pink-600':'hover:bg-neutral-100 dark:hover:bg-neutral-700 dark:text-neutral-300'}`}>
              <Icon path={ICONS.BROWSE} className="inline-block w-5 h-5 mr-2" /> Browse
            </button>
            <button onClick={() => setActiveView('playlists')} className={`w-full text-left p-2 rounded-md ${activeView==='playlists'?'bg-pink-100 text-pink-600':'hover:bg-neutral-100 dark:hover:bg-neutral-700 dark:text-neutral-300'}`}>
              <Icon path={ICONS.PLAYLIST} className="inline-block w-5 h-5 mr-2" /> Playlists
            </button>
            <button onClick={() => setActiveView('settings')} className={`w-full text-left p-2 rounded-md ${activeView==='settings'?'bg-pink-100 text-pink-600':'hover:bg-neutral-100 dark:hover:bg-neutral-700 dark:text-neutral-300'}`}>
              <Icon path={ICONS.SETTINGS} className="inline-block w-5 h-5 mr-2" /> Settings
            </button>
          </nav>
        </aside>

        <main className="flex-grow overflow-y-auto pb-32 md:pb-0">
          {renderView()}
        </main>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 bg-neutral-50 dark:bg-gray-800/80 backdrop-blur-md border-t border-neutral-200 dark:border-gray-700 z-10">
        <div className="w-full h-1 bg-neutral-300 dark:bg-neutral-600 cursor-pointer" ref={progressRef} onClick={handleSeek}>
          <div className="h-1 bg-pink-500" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex items-center justify-between h-20 px-4">
          <div className="flex items-center gap-3">
            {nowPlaying ? (
              <>
                <img src={nowPlaying.thumbnail} alt={nowPlaying.title} className="w-12 h-12 rounded-md object-cover" />
                <div className="hidden sm:block">
                  <p className="font-semibold dark:text-white truncate">{nowPlaying.title}</p>
                  <p className="text-xs dark:text-neutral-400 truncate">{nowPlaying.artist}</p>
                </div>
              </>
            ) : (
              <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
            )}
          </div>
          <div className="flex items-center gap-4">
            <PlayerButton onClick={playPrevious} disabled={queue.length < 2} iconPath={ICONS.REWIND} />
            <button onClick={togglePlayPause} className="p-3 bg-neutral-200 dark:bg-neutral-700 rounded-full">
              <Icon path={isPlaying ? ICONS.PAUSE_FILLED : ICONS.PLAY_FILLED} className="w-6 h-6 text-neutral-800 dark:text-white" />
            </button>
            <PlayerButton onClick={playNext} disabled={queue.length < 2} iconPath={ICONS.FORWARD} />
          </div>
          <div className="flex items-center gap-3">
            <Icon path={volume > 0 ? ICONS.VOLUME_HIGH : ICONS.VOLUME_OFF} className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-pink-600 hidden sm:block"
            />
          </div>
        </div>
      </footer>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-40" onClick={closeMenu}>
          <div className="bg-white dark:bg-gray-800 w-full p-4 rounded-t-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 pb-4 border-b dark:border-gray-700 mb-4">
              <img src={menuTrack.thumbnail} alt={menuTrack.title} className="w-12 h-12 rounded-md object-cover" />
              <div>
                <p className="font-semibold dark:text白truncate">{menuTrack.title}</p>
                <p className="text-sm dark:text-gray-400">{menuTrack.artist}</p>
              </div>
            </div>
            <button onClick={handleAddToQueue} className="w-full text-left p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700">Play Next</button>
            <button onClick={() => setIsPlaylistModalOpen(true)} className="w-full text-left p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700">Add to Playlist...</button>
            <button onClick={handleShare} className="w-full text-left p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700">Share</button>
          </div>
        </div>
      )}
      {isPlaylistModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsPlaylistModalOpen(false)}>
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm p-4 rounded-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold dark:text-white mb-4">Add to playlist</h2>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {playlists.map(p => (
                <button key={p.id} onClick={() => addToPlaylist(p.id)} className="w-full text-left p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700">{p.name}</button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t dark:border-gray-700 flex gap-2">
              <input
                type="text"
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                placeholder="New playlist name"
                className="w-full bg-neutral-200 dark:bg-neutral-700 dark:text-white rounded-md py-2 px-3"
              />
              <button onClick={createPlaylist} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
  
