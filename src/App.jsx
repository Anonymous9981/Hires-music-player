import React, { useState, useEffect, useRef } from 'react';

// --- SVG ICONS (New Icons Added) ---
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
  BROWSE: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93L15.87 5c-1.03-.13-2-.45-2.87-.93zM14 19.07c-1.03-.13-2-.45-2.87-.93L10.13 19c1.03.13 2 .45 2.87.93z",
  DOTS_VERTICAL: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
  PLAYLIST: "M2 16h8v-2H2v2zm0-4h12v-2H2v2zm0-4h12V6H2v2zm14 4h4v-2h-4v2zm0-4h4V6h-4v2zm0 8h4v-2h-4v2z",
  SETTINGS: "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69-.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z",
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
        className="text-neutral-700 disabled:text-neutral-400 transition-transform active:scale-90"
    >
        <Icon path={iconPath} className={className} />
    </button>
);

function App() {
    const [activeView, setActiveView] = useState('browse'); // browse, playlists, settings
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
    
    // --- New State Variables ---
    const [playlists, setPlaylists] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuTrack, setMenuTrack] = useState(null);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [quality, setQuality] = useState('high'); // 'high' or 'low'

    const playerRef = useRef(null);
    const progressRef = useRef(null);
    const intervalRef = useRef(null);
    const silentAudioRef = useRef(null); // Ref for the silent audio element

    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; 
    const nowPlaying = queue[currentTrackIndex];

    // --- Load Playlists and Settings from localStorage on initial render ---
    useEffect(() => {
        try {
            const savedPlaylists = localStorage.getItem('musicPlayer-playlists');
            if (savedPlaylists) {
                setPlaylists(JSON.parse(savedPlaylists));
            }
            const savedQuality = localStorage.getItem('musicPlayer-quality');
            if (savedQuality) {
                setQuality(savedQuality);
            }
        } catch (e) {
            console.error("Failed to load data from localStorage", e);
        }
    }, []);

    // --- Save Playlists and Settings to localStorage whenever they change ---
    useEffect(() => {
        try {
            localStorage.setItem('musicPlayer-playlists', JSON.stringify(playlists));
        } catch (e) {
            console.error("Failed to save playlists to localStorage", e);
        }
    }, [playlists]);

    useEffect(() => {
        try {
            localStorage.setItem('musicPlayer-quality', quality);
        } catch (e) {
            console.error("Failed to save quality to localStorage", e);
        }
    }, [quality]);


    // --- Media Session API for Background Playback ---
    useEffect(() => {
        if ('mediaSession' in navigator) {
            if (nowPlaying) {
                navigator.mediaSession.metadata = new window.MediaMetadata({
                    title: nowPlaying.title,
                    artist: nowPlaying.artist,
                    artwork: [{ src: nowPlaying.thumbnail, sizes: '512x512', type: 'image/jpeg' }]
                });
                navigator.mediaSession.setActionHandler('play', () => { togglePlayPause(); });
                navigator.mediaSession.setActionHandler('pause', () => { togglePlayPause(); });
                navigator.mediaSession.setActionHandler('previoustrack', () => { playPrevious(); });
                navigator.mediaSession.setActionHandler('nexttrack', () => { playNext(); });
            }
            navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
        }
    }, [nowPlaying, isPlaying]);

    // --- Silent Audio for Seamless Background Play ---
    useEffect(() => {
        if (silentAudioRef.current) {
            if (isPlaying) {
                silentAudioRef.current.play().catch(e => console.error("Silent audio play failed. This is expected on some browsers until user interaction.", e));
            } else {
                silentAudioRef.current.pause();
            }
        }
    }, [isPlaying]);

    // --- YouTube IFrame API Loader ---
    useEffect(() => {
        if (window.YT) {
            setIsApiReady(true);
            return;
        }
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = () => { setIsApiReady(true); };
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }, []);

    // --- YouTube Player Initializer ---
    useEffect(() => {
        if (isApiReady && nowPlaying) {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
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

    // --- Progress Bar Updater ---
    useEffect(() => {
        if (isPlaying) {
            startProgressInterval();
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying, currentTrackIndex]);

    // --- Initial Search ---
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
        } catch (err) {
            setError(`Failed to fetch search results: ${err.message}`);
            setSearchResults([]);
        }
        setIsLoading(false);
    };
    
    // --- Autoplay Related Song ---
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
                // The next track will be played automatically by the onPlayerStateChange ENDED event
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
    };

    const playNext = () => {
        if (currentTrackIndex < queue.length - 1) {
            setCurrentTrackIndex(prevIndex => prevIndex + 1);
        } else {
            playRelatedSong(); // Autoplay when queue ends
        }
    };

    const playPrevious = () => {
        if (queue.length > 0) {
            setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + queue.length) % queue.length);
        }
    };

    const togglePlayPause = () => {
        if (!playerRef.current) return;
        if (isPlaying) playerRef.current.pauseVideo();
        else playerRef.current.playVideo();
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
        playNext();
    };

    // --- Menu and Playlist Functions ---
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
                // Fallback for desktop or browsers without share API
                navigator.clipboard.writeText(shareData.url);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Share failed:", err);
        }
        closeMenu();
    };

    const createPlaylist = () => {
        if (newPlaylistName.trim()) {
            const newPlaylist = { id: Date.now(), name: newPlaylistName, tracks: [menuTrack] };
            setPlaylists(prev => [...prev, newPlaylist]);
            setNewPlaylistName("");
            setIsPlaylistModalOpen(false);
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
        closeMenu();
    };

    const renderView = () => {
        switch (activeView) {
            case 'playlists':
                return (
                    <div className="p-4 sm:p-6 lg:p-8">
                        <h1 className="text-3xl font-bold mb-6">Playlists</h1>
                        {playlists.length > 0 ? (
                            <div className="space-y-4">
                                {playlists.map(p => (
                                    <div key={p.id} className="bg-neutral-100 p-4 rounded-lg">
                                        <h2 className="font-bold">{p.name}</h2>
                                        <p className="text-sm text-neutral-500">{p.tracks.length} songs</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-neutral-500">You haven't created any playlists yet.</p>
                        )}
                    </div>
                );
            case 'settings':
                return (
                    <div className="p-4 sm:p-6 lg:p-8">
                        <h1 className="text-3xl font-bold mb-6">Settings</h1>
                        <div className="space-y-4">
                           <div>
                               <label htmlFor="quality" className="font-semibold block mb-2">Streaming Quality</label>
                               <select 
                                 id="quality" 
                                 value={quality} 
                                 onChange={(e) => setQuality(e.target.value)}
                                 className="bg-neutral-200 rounded-md p-2 w-full"
                               >
                                   <option value="high">High Quality</option>
                                   <option value="low">Data Saver (Lower Quality)</option>
                               </select>
                               <p className="text-sm text-neutral-500 mt-1">"Data Saver" may reduce mobile data usage.</p>
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
                                    className="w-full bg-neutral-200 rounded-md py-2 pl-10 pr-3 text-sm placeholder-neutral-500"
                                    placeholder="Search"
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </form>
                        </div>
                        <h1 className="text-3xl font-bold mb-6 hidden md:block">Browse</h1>
                        {error && ( <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center border border-red-200">{error}</div> )}
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid
