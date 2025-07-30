import React, { useState, useEffect, useRef } from 'react';

// Toast System
let showToast;
const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    showToast = (message, type = 'info') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 3000);
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getToastStyles = (type) => {
    const baseStyles = "mb-2 p-4 rounded-lg shadow-md transition-all duration-300 transform";
    const typeStyles = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      warning: "bg-yellow-500 text-white",
      info: "bg-blue-500 text-white"
    };
    return `${baseStyles} ${typeStyles[type] || typeStyles.info}`;
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={getToastStyles(toast.type)}
          onClick={() => removeToast(toast.id)}
        >
          <div className="flex justify-between items-center">
            <span>{toast.message}</span>
            <button className="ml-4 text-white hover:text-gray-200">×</button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Theme Toggle Component
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
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

// Music Visualizer Component
const MusicVisualizer = ({ isPlaying = false, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const barCount = 5;
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className={`flex items-end justify-center space-x-1 ${sizeClasses[size]}`}>
      {bars.map((bar) => (
        <div
          key={bar}
          className={`w-1 bg-gradient-to-t from-pink-500 to-pink-600 rounded-sm ${
            isPlaying ? 'animate-bounce' : 'h-2'
          }`}
          style={{
            animationDelay: `${bar * 0.1}s`,
            height: isPlaying ? `${Math.random() * 100 + 20}%` : '20%',
            animationDuration: '0.5s',
            animationIterationCount: 'infinite',
            animationDirection: 'alternate'
          }}
        ></div>
      ))}
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-pink-600 ${sizeClasses[size]}`}></div>
      {text && <p className="mt-4 text-gray-600 dark:text-gray-300">{text}</p>}
    </div>
  );
};

// --- SVG ICONS ---
const ICONS = {
  PLAY_FILLED: "M8 5v14l11-7z",
  PAUSE_FILLED: "M6 19h4V5H6v14zm8-14v14h4V5h-4z",
  FORWARD: "M10 18v-12l8.5 6L10 18zM4 6v12h2V6H4z",
  REWIND: "M14 6v12l-8.5-6L14 6zM6 18V6H4v12h2z",
  SEARCH: "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
  VOLUME_HIGH: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
  VOLUME_OFF: "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z",
  CHEVRON_LEFT: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
  CHEVRON_RIGHT: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
  MUSIC_NOTE: "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
  BROWSE: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93L15.87 5c-1.03-.13-2-.45-2.87-.93zM14 19.07c-1.03-.13-2-.45-2.87-.93L10.13 19c1.03.13 2 .45 2.87.93z",
  DOTS_VERTICAL: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
  PLAYLIST: "M2 16h8v-2H2v2zm0-4h12v-2H2v2zm0-4h12V6H2v2zm14 4h4v-2h-4v2zm0-4h4V6h-4v2zm0 8h4v-2h-4v2z",
  SETTINGS: "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z",
  SHARE: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.18c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z",
  PLUS: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
  CLOSE: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
};

const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d={path} />
    </svg>
);

const PlayerButton = ({ onClick, disabled, iconPath, className = "w-9 h-9" }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="text-neutral-700 dark:text-neutral-300 disabled:text-neutral-400 transition-transform active:scale-90"
    >
        <Icon path={iconPath} className={className} />
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

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    togglePlayPause();
                    break;
                case 'ArrowRight':
                    playNext();
                    break;
                case 'ArrowLeft':
                    playPrevious();
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    // Load saved data
    useEffect(() => {
        try {
            const savedPlaylists = localStorage.getItem('musicPlayer-playlists');
            if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));
            const savedQuality = localStorage.getItem('musicPlayer-quality');
            if (savedQuality) setQuality(savedQuality);
        } catch (e) {
            console.error("Failed to load data from localStorage", e);
        }
    }, []);

    // Save data
    useEffect(() => {
        try {
            localStorage.setItem('musicPlayer-playlists', JSON.stringify(playlists));
        } catch (e) {
            console.error("Failed to save playlists", e);
        }
    }, [playlists]);

    useEffect(() => {
        try {
            localStorage.setItem('musicPlayer-quality', quality);
        } catch (e) {
            console.error("Failed to save quality", e);
        }
    }, [quality]);

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

    // Silent audio for background playback
    useEffect(() => {
        if (silentAudioRef.current) {
            if (isPlaying) {
                silentAudioRef.current.play().catch(e => console.error("Silent audio failed", e));
            } else {
                silentAudioRef.current.pause();
            }
        }
    }, [isPlaying]);

    // YouTube API loader
    useEffect(() => {
        if (window.YT) {
            setIsApiReady(true);
            return;
        }
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = () => setIsApiReady(true);
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }, []);

    // YouTube player
    useEffect(() => {
        if (isApiReady && nowPlaying) {
            if (playerRef.current) playerRef.current.destroy();
            const newPlayer = new window.YT.Player('youtube-player-container', {
                videoId: nowPlaying.id,
                height: '0', width: '0',
                playerVars: { autoplay: 1, controls: 0, fs: 0, iv_load_policy: 3, modestbranding: 1, playsinline: 1, disablekb: 1, rel: 0 },
                events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange, 'onError': onPlayerError }
            });
            playerRef.current = newPlayer;
        }
        return () => { if (playerRef.current) playerRef.current.destroy(); }
    }, [isApiReady, nowPlaying]);

    // Progress updater
    useEffect(() => {
        if (isPlaying) {
            startProgressInterval();
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying, currentTrackIndex]);

    // Initial search
    useEffect(() => {
        if(API_KEY) handleSearch();
    }, [API_KEY]);

    const startProgressInterval = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            const player = playerRef.current;
            if (player && typeof player.getCurrentTime === 'function') {
                const currentTime = player.getCurrentTime();
                const duration = player.getDuration();
                setProgress(duration > 0 ? (currentTime / duration) * 100 : 0);
            }
        }, 500);
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) return;
        if (!API_KEY) {
            setError("YouTube API Key is not configured.");
            showToast("YouTube API Key is missing", "error");
            return;
        }
        setIsLoading(true);
        setError(null);
        setSearchResults([]);
        try {
            const videoDefinition = quality === 'low' ? 'standard' : 'high';
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(searchTerm)}&type=video&videoDefinition=${videoDefinition}&key=${API_KEY}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const results = data.items.map(item => ({
                id: item.id.videoId,
                title: item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&"),
                artist: item.snippet.channelTitle,
                thumbnail: item.snippet.thumbnails.high.url
            }));
            setSearchResults(results);
            if (results.length > 0) {
                showToast(`Found ${results.length} tracks`, "success");
            }
        } catch (err) {
            setError(`Failed to fetch search results: ${err.message}`);
            setSearchResults([]);
            showToast("Search failed", "error");
        }
        setIsLoading(false);
    };

    const playRelatedSong = async () => {
        if (!nowPlaying) return;
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&relatedToVideoId=${nowPlaying.id}&type=video&key=${API_KEY}`);
            if (!response.ok) return;
            const data = await response.json();
            if (data.items.length > 0) {
                const nextTrack = {
                    id: data.items[0].id.videoId,
                    title: data.items[0].snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&"),
                    artist: data.items[0].snippet.channelTitle,
                    thumbnail: data.items[0].snippet.thumbnails.high.url
                };
                setQueue(prev => [...prev, nextTrack]);
            }
        } catch (err) {
            console.error("Failed to fetch related video", err);
        }
    };

    const handleSelectTrack = (track) => {
        const newQueue = [track, ...queue.slice(currentTrackIndex + 1)];
        setQueue(newQueue);
        setCurrentTrackIndex(0);
        setIsPlaying(true);
        showToast(`Now playing: ${track.title}`, "success");
    };

    const playNext = () => {
        if (currentTrackIndex < queue.length - 1) {
            setCurrentTrackIndex(prevIndex => prevIndex + 1);
        } else {
            playRelatedSong();
        }
    };

    const playPrevious = () => {
        if (queue.length > 0) {
            setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + queue.length) % queue.length);
        }
    };

    const togglePlayPause = () => {
        if (!playerRef.current) return;
        if (isPlaying) {
            playerRef.current.pauseVideo();
            showToast("Paused", "info");
        } else {
            playerRef.current.playVideo();
        }
    };

    const handleSeek = (e) => {
        const progressContainer = progressRef.current;
        if (!progressContainer || !playerRef.current) return;
        const clickPositionX = e.clientX - progressContainer.getBoundingClientRect().left;
        const containerWidth = progressContainer.offsetWidth;
        const seekRatio = clickPositionX / containerWidth;
        const duration = playerRef.current.getDuration() || 0;
        playerRef.current.seekTo(duration * seekRatio, true);
        setProgress(seekRatio * 100);
    };
    
    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        if (playerRef.current) playerRef.current.setVolume(newVolume);
    };

    const onPlayerReady = (event) => {
        event.target.setVolume(volume);
        event.target.playVideo();
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
        else setIsPlaying(false);
        if (event.data === window.YT.PlayerState.ENDED) playNext();
    };
    
    const onPlayerError = (event) => {
        setError(`YouTube Player Error. Code: ${event.data}. This video may be private or restricted.`);
        showToast("Video error, skipping...", "error");
        playNext();
    };

    const openMenu = (track) => {
        setMenuTrack(track);
        setIsMenuOpen(true);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        setMenuTrack(null);
    };

    const handleAddToQueue = () => {
        setQueue(prev => [...prev, menuTrack]);
        showToast("Added to queue", "success");
        closeMenu();
    };

    const handleShare = async () => {
        const shareData = {
            title: menuTrack.title,
            text: `Check out ${menuTrack.title} by ${menuTrack.artist}`,
            url: `https://www.youtube.com/watch?v=${menuTrack.id}`
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                navigator.clipboard.writeText(shareData.url);
                showToast("Link copied to clipboard!", "success");
            }
        } catch (err) {
            console.error("Share failed:", err);
            showToast("Share failed", "error");
        }
        closeMenu();
    };

    const createPlaylist = () => {
        if (newPlaylistName.trim()) {
            const newPlaylist = { id: Date.now(), name: newPlaylistName, tracks: [menuTrack] };
            setPlaylists(prev => [...prev, newPlaylist]);
            setNewPlaylistName("");
            setIsPlaylistModalOpen(false);
            showToast(`Created playlist: ${newPlaylistName}`, "success");
            closeMenu();
        }
    };
    
    const addToPlaylist = (playlistId) => {
        setPlaylists(prev => prev.map(p => {
            if (p.id === playlistId && !p.tracks.some(t => t.id === menuTrack.id)) {
                return { ...p, tracks: [...p.tracks, menuTrack] };
            }
            return p;
        }));
        setIsPlaylistModalOpen(false);
        showToast("Added to playlist", "success");
        closeMenu();
    };

    const renderView = () => {
        switch (activeView) {
            case 'playlists':
                return (
                    <div className="p-4 sm:p-6 lg:p-8">
                        <h1 className="text-3xl font-bold mb-6 dark:text-white">Playlists</h1>
                        {playlists.length > 0 ? (
                            <div className="space-y-4">
                                {playlists.map(p => (
                                    <div key={p.id} className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
                                        <h2 className="font-bold dark:text-white">{p.name}</h2>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{p.tracks.length} songs</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-neutral-500 dark:text-neutral-400">You haven't created any playlists yet.</p>
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
                           <div>
                               <label htmlFor="quality" className="font-semibold block mb-2 dark:text-white">Streaming Quality</label>
                               <select 
                                 id="quality" 
                                 value={quality} 
                                 onChange={(e) => setQuality(e.target.value)}
                                 className="bg-neutral-200 dark:bg-neutral-700 dark:text-white rounded-md p-2 w-full"
                               >
                                   <option value="high">High Quality</option>
                                   <option value="low">Data Saver (Lower Quality)</option>
                               </select>
                               <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">"Data Saver" may reduce mobile data usage.</p>
                           </div>
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
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </form>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold hidden md:block dark:text-white">Browse</h1>
                            <div className="flex items-center gap-4">
                                {isPlaying && <MusicVisualizer isPlaying={isPlaying} size="medium" />}
                            </div>
                        </div>
                        
                        {error && ( 
                            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-4 text-center border border-red-200 dark:border-red-700">
                                {error}
                            </div> 
                        )}
                        
                        {isLoading ? (
                            <LoadingSpinner size="large" text="Searching music..." />
                        ) : searchResults.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
                                {searchResults.map(track => (
                                    <div key={track.id} className="group">
                                        <div onClick={() => handleSelectTrack(track)} className="relative aspect-square rounded-lg overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl cursor-pointer">
                                            <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 transform transition-transform active:scale-90">
                                                    <Icon path={ICONS.PLAY_FILLED} className="w-8 h-8 text-black" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start justify-between mt-2">
                                            <div className="flex-grow truncate">
                                                <p className="font-semibold truncate text-sm dark:text-white">{track.title}</p>
                                                <p className="text-neutral-500 dark:text-neutral-400 truncate text-xs">{track.artist}</p>
                                            </div>
                                            <button onClick={() => openMenu(track)} className="p-1 -mr-1 flex-shrink-0">
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
        
            return (
                <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen font-['Inter'] flex flex-col antialiased transition-colors duration-300">
                    <Toast />

        {/* Silent audio element for background playback */}
        <audio ref={silentAudioRef} loop src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA" />
        <div id="youtube-player-container" className="hidden"></div>
        
        <div className="flex flex-grow overflow-hidden">
            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="w-64 bg-neutral-50 dark:bg-gray-800 border-r border-neutral-200 dark:border-gray-700 p-4 flex-shrink-0 hidden md:flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <button className="w-3 h-3 bg-red-500 rounded-full"></button>
                        <button className="w-3 h-3 bg-yellow-500 rounded-full"></button>
                        <button className="w-3 h-3 bg-green-500 rounded-full"></button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon path={ICONS.CHEVRON_LEFT} className="w-6 h-6 text-neutral-400" />
                        <Icon path={ICONS.CHEVRON_RIGHT} className="w-6 h-6 text-neutral-300" />
                    </div>
                </div>
                <form onSubmit={handleSearch} className="relative mb-8">
                    <Icon path={ICONS.SEARCH} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                        className="w-full bg-neutral-200 dark:bg-neutral-700 dark:text-white rounded-md py-2 pl-10 pr-3 text-sm placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Search"
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
                <nav className="space-y-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('browse'); }} className={`flex items-center gap-3 font-semibold p-2 rounded-md transition-colors ${activeView === 'browse' ? 'text-pink-600 bg-pink-100 dark:bg-pink-900' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>
                        <Icon path={ICONS.BROWSE} className="w-6 h-6" />
                        <span>Browse</span>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('playlists'); }} className={`flex items-center gap-3 font-semibold p-2 rounded-md transition-colors ${activeView === 'playlists' ? 'text-pink-600 bg-pink-100 dark:bg-pink-900' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>
                        <Icon path={ICONS.PLAYLIST} className="w-6 h-6" />
                        <span>Playlists</span>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('settings'); }} className={`flex items-center gap-3 font-semibold p-2 rounded-md transition-colors ${activeView === 'settings' ? 'text-pink-600 bg-pink-100 dark:bg-pink-900' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>
                        <Icon path={ICONS.SETTINGS} className="w-6 h-6" />
                        <span>Settings</span>
                    </a>
                </nav>
            </aside>

            <main className="flex-grow bg-white dark:bg-gray-900 overflow-y-auto pb-32 md:pb-0">
                {renderView()}
            </main>
        </div>

        {/* --- PLAYER FOOTER --- */}
        <footer className="bg-neutral-50/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-neutral-200 dark:border-gray-700 fixed bottom-0 left-0 right-0 z-10">
            <div className="w-full bg-neutral-300 dark:bg-neutral-600 h-1 group cursor-pointer" ref={progressRef} onClick={handleSeek}>
                <div className="bg-pink-500 h-1 relative pointer-events-none" style={{ width: `${progress}%` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-3 w-1/3">
                        {nowPlaying ? <>
                            <img src={nowPlaying.thumbnail} alt={nowPlaying.title} className="w-12 h-12 rounded-md object-cover shadow-sm"/>
                            <div className="truncate hidden sm:block">
                                <p className="font-semibold truncate text-sm dark:text-white">{nowPlaying.title}</p>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{nowPlaying.artist}</p>
                            </div>
                        </> : <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-md"></div>}
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 w-auto justify-center">
                        <PlayerButton onClick={playPrevious} disabled={queue.length < 2} iconPath={ICONS.REWIND} />
                        <button onClick={togglePlayPause} className="bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white rounded-full p-3 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-transform transform active:scale-90 shadow-sm">
                            <Icon path={isPlaying ? ICONS.PAUSE_FILLED : ICONS.PLAY_FILLED} className="w-8 h-8" />
                        </button>
                        <PlayerButton onClick={playNext} disabled={queue.length < 2} iconPath={ICONS.FORWARD} />
                    </div>

                    <div className="w-1/3 flex items-center justify-end gap-3">
                        <Icon path={volume > 0 ? ICONS.VOLUME_HIGH : ICONS.VOLUME_OFF} className="w-5 h-5 text-neutral-500 dark:text-neutral-400 hidden sm:block" />
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-24 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-pink-600 hidden sm:block"
                        />
                    </div>
                </div>
            </div>
            
            {/* --- MOBILE BOTTOM NAVIGATION --- */}
            <nav className="md:hidden flex items-center justify-around bg-neutral-50 dark:bg-gray-800 border-t border-neutral-200 dark:border-gray-700 h-16">
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('browse'); }} className={`flex flex-col items-center gap-1 ${activeView === 'browse' ? 'text-pink-600' : 'text-neutral-500 dark:text-neutral-400'}`}>
                    <Icon path={ICONS.BROWSE} />
                    <span className="text-xs">Browse</span>
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('playlists'); }} className={`flex flex-col items-center gap-1 ${activeView === 'playlists' ? 'text-pink-600' : 'text-neutral-500 dark:text-neutral-400'}`}>
                    <Icon path={ICONS.PLAYLIST} />
                    <span className="text-xs">Playlists</span>
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('settings'); }} className={`flex flex-col items-center gap-1 ${activeView === 'settings' ? 'text-pink-600' : 'text-neutral-500 dark:text-neutral-400'}`}>
                    <Icon path={ICONS.SETTINGS} />
                    <span className="text-xs">Settings</span>
                </a>
            </nav>
        </footer>

        {/* --- MODALS --- */}
        {isMenuOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 flex items-end" onClick={closeMenu}>
                <div className="bg-white dark:bg-gray-800 w-full rounded-t-2xl p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-3 mb-4 border-b dark:border-gray-700 pb-4">
                        <img src={menuTrack?.thumbnail} alt={menuTrack?.title} className="w-12 h-12 rounded-md object-cover"/>
                        <div className="truncate">
                            <p className="font-semibold truncate dark:text-white">{menuTrack?.title}</p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{menuTrack?.artist}</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-1">
                        <button onClick={handleAddToQueue} className="text-left p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 dark:text-white rounded-lg">Play Next</button>
                        <button onClick={() => { setIsPlaylistModalOpen(true); }} className="text-left p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 dark:text-white rounded-lg">Add to Playlist...</button>
                        <button onClick={handleShare} className="text-left p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 dark:text-white rounded-lg">Share</button>
                    </nav>
                </div>
            </div>
        )}

        {isPlaylistModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsPlaylistModalOpen(false)}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-lg font-bold mb-4 dark:text-white">Add to playlist</h2>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {playlists.map(p => (
                            <button key={p.id} onClick={() => addToPlaylist(p.id)} className="w-full text-left p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 dark:text-white rounded-lg">{p.name}</button>
                        ))}
                    </div>
                    <div className="border-t dark:border-gray-700 mt-4 pt-4">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                placeholder="New playlist name"
                                className="w-full bg-neutral-200 dark:bg-neutral-700 dark:text-white rounded-md py-2 px-3 text-sm placeholder-neutral-500 dark:placeholder-neutral-400"
                            />
                            <button onClick={createPlaylist} className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-md transition-colors">Create</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
);
}

export default App;

   
