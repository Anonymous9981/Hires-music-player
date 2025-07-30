import React, { useState, useEffect, useRef } from 'react';

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
  RADIO: "M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H8.3l8.26-3.34L15.28 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h2v2zm-4 0h-2v-2h2v2z",
  BROWSE: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93L15.87 5c-1.03-.13-2-.45-2.87-.93zM14 19.07c-1.03-.13-2-.45-2.87-.93L10.13 19c1.03.13 2 .45 2.87.93z"
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
        className="text-neutral-700 disabled:text-neutral-400 transition-transform active:scale-90"
    >
        <Icon path={iconPath} className={className} />
    </button>
);

function App() {
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
    const playerRef = useRef(null);
    const progressRef = useRef(null);
    const intervalRef = useRef(null);

    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; 

    const nowPlaying = queue[currentTrackIndex];

    // --- START: Media Session API for Background Playback ---
    useEffect(() => {
        if ('mediaSession' in navigator) {
            if (nowPlaying) {
                navigator.mediaSession.metadata = new window.MediaMetadata({
                    title: nowPlaying.title,
                    artist: nowPlaying.artist,
                    artwork: [
                        { src: nowPlaying.thumbnail, sizes: '512x512', type: 'image/jpeg' },
                    ]
                });

                navigator.mediaSession.setActionHandler('play', () => { togglePlayPause(); });
                navigator.mediaSession.setActionHandler('pause', () => { togglePlayPause(); });
                navigator.mediaSession.setActionHandler('previoustrack', () => { playPrevious(); });
                navigator.mediaSession.setActionHandler('nexttrack', () => { playNext(); });
            }
            
            navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
        }
    }, [nowPlaying, isPlaying]);
    // --- END: Media Session API ---

    useEffect(() => {
        if (window.YT) {
            setIsApiReady(true);
            return;
        }
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        
        window.onYouTubeIframeAPIReady = () => {
            setIsApiReady(true);
        };

        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }, []);

    useEffect(() => {
        if (isApiReady && nowPlaying) {
            if (playerRef.current) {
                playerRef.current.destroy();
            }

            const newPlayer = new window.YT.Player('youtube-player-container', {
                videoId: nowPlaying.id,
                height: '0', width: '0',
                playerVars: {
                    autoplay: 1, controls: 0, fs: 0, 
                    iv_load_policy: 3,
                    modestbranding: 1,
                    playsinline: 1,
                    disablekb: 1,
                    rel: 0
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                    'onError': onPlayerError,
                }
            });
            playerRef.current = newPlayer;
        }
        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        }
    }, [isApiReady, nowPlaying]);

    useEffect(() => {
        if (isPlaying) {
            startProgressInterval();
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying, currentTrackIndex]);

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
            setError("YouTube API Key is not configured. Please set it up in your environment variables.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setSearchResults([]);
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(searchTerm)}&type=video&key=${API_KEY}`);
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
        } catch (err) {
            setError(`Failed to fetch search results: ${err.message}`);
            setSearchResults([]);
        }
        setIsLoading(false);
    };

    const handleSelectTrack = (track) => {
        const newQueue = [track, ...queue.filter(t => t.id !== track.id)];
        setQueue(newQueue);
        setCurrentTrackIndex(0);
        setIsPlaying(true);
    };

    const playNext = () => {
        if (queue.length > 0) {
            setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % queue.length);
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
        if (playerRef.current) {
            playerRef.current.setVolume(newVolume);
        }
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
        playNext();
    }

    return (
        <div className="bg-white text-black min-h-screen font-['Inter'] flex flex-col antialiased">
            <div id="youtube-player-container" className="hidden"></div>
            
            <div className="flex flex-grow overflow-hidden">
                <aside className="w-64 bg-neutral-50 border-r border-neutral-200 p-4 flex-shrink-0 hidden md:flex flex-col">
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
                            className="w-full bg-neutral-200 rounded-md py-2 pl-10 pr-3 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="Search"
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                    <nav className="space-y-2">
                        <a href="#" className="flex items-center gap-3 text-pink-600 font-semibold bg-pink-100 p-2 rounded-md">
                            <Icon path={ICONS.BROWSE} className="w-6 h-6" />
                            <span>Browse</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 text-neutral-700 hover:bg-neutral-100 font-semibold p-2 rounded-md transition-colors">
                            <Icon path={ICONS.RADIO} className="w-6 h-6" />
                            <span>Radio</span>
                        </a>
                         <a href="#" className="flex items-center gap-3 text-neutral-700 hover:bg-neutral-100 font-semibold p-2 rounded-md transition-colors">
                            <Icon path={ICONS.MUSIC_NOTE} className="w-6 h-6" />
                            <span>Library</span>
                        </a>
                    </nav>
                </aside>

                <main className="flex-grow bg-white overflow-y-auto">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <h1 className="text-3xl font-bold mb-6">Browse</h1>
                        {error && (
                            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center border border-red-200">{error}</div>
                        )}

                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {searchResults.map(track => (
                                    <div key={track.id} onClick={() => handleSelectTrack(track)} className="cursor-pointer group">
                                        <div className="relative aspect-square rounded-lg overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl">
                                            <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 transform transition-transform active:scale-90">
                                                    <Icon path={ICONS.PLAY_FILLED} className="w-8 h-8 text-black" />
                                                </div>
                                            </div>
                                        </div>
                                        <p className="font-semibold truncate mt-2 text-sm">{track.title}</p>
                                        <p className="text-neutral-500 truncate text-xs">{track.artist}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-16 text-neutral-500">
                                <h2 className="text-2xl font-bold mb-2">No Results Found</h2>
                                <p>Try searching for something else.</p>
                             </div>
                        )}
                    </div>
                </main>
            </div>

            <footer className="bg-neutral-50/80 backdrop-blur-md border-t border-neutral-200 mt-auto z-10 flex-shrink-0">
                <div className="w-full bg-neutral-300 h-1 group cursor-pointer" ref={progressRef} onClick={handleSeek}>
                    <div className="bg-neutral-500 h-1 relative pointer-events-none" style={{ width: `${progress}%` }}>
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-neutral-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-3 w-1/3">
                            {nowPlaying ? <>
                                <img src={nowPlaying.thumbnail} alt={nowPlaying.title} className="w-12 h-12 rounded-md object-cover shadow-sm"/>
                                <div className="truncate">
                                    <p className="font-semibold truncate text-sm">{nowPlaying.title}</p>
                                    <p className="text-xs text-neutral-600 truncate">{nowPlaying.artist}</p>
                                </div>
                            </> : <div className="w-12 h-12 bg-neutral-200 rounded-md"></div>}
                        </div>

                        <div className="flex items-center gap-6 w-1/3 justify-center">
                            <PlayerButton onClick={playPrevious} disabled={queue.length < 2} iconPath={ICONS.REWIND} />
                            <button onClick={togglePlayPause} className="bg-neutral-200 text-neutral-800 rounded-full p-3 hover:bg-neutral-300 transition-transform transform active:scale-90 shadow-sm">
                                <Icon path={isPlaying ? ICONS.PAUSE_FILLED : ICONS.PLAY_FILLED} className="w-8 h-8" />
                            </button>
                            <PlayerButton onClick={playNext} disabled={queue.length < 2} iconPath={ICONS.FORWARD} />
                        </div>

                        <div className="w-1/3 flex items-center justify-end gap-3">
                           <Icon path={volume > 0 ? ICONS.VOLUME_HIGH : ICONS.VOLUME_OFF} className="w-5 h-5 text-neutral-500" />
                           <input 
                             type="range" 
                             min="0" 
                             max="100" 
                             value={volume}
                             onChange={handleVolumeChange}
                             className="w-24 h-1 bg-neutral-300 rounded-lg appearance-none cursor-pointer accent-neutral-600"
                           />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;

