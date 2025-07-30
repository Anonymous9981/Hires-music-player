import React, { useState, useEffect } from 'react';
import ThemeToggle from './components/ThemeToggle';
import Toast, { showToast } from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';
import MusicVisualizer from './components/MusicVisualizer';
import './styles/animations.css';

// Dummy track list for demonstration
const tracks = [
  { id: 1, title: 'Track One', artist: 'Artist A' },
  { id: 2, title: 'Track Two', artist: 'Artist B' },
  { id: 3, title: 'Track Three', artist: 'Artist C' },
];

function App() {
  const [loading, setLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Simulate loading when selecting a new track
  const playTrack = (track) => {
    setLoading(true);
    setTimeout(() => {
      setCurrentTrack(track);
      setIsPlaying(true);
      setLoading(false);
      showToast(`Now playing: ${track.title}`, 'success');
    }, 900); // Simulate load delay
  };

  // Stop playback
  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
    showToast('Playback stopped', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Toast notifications */}
      <Toast />

      {/* Navigation/Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold">Hi-Res Music Player</h1>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="p-4">
        {loading && (
          <LoadingSpinner size="large" text="Loading music..." />
        )}

        {!loading && (
          <>
            {/* Music visualizer, shows only if playing */}
            <div className="flex flex-col items-center mb-8">
              {isPlaying && (
                <MusicVisualizer isPlaying={isPlaying} size="large" />
              )}
              {currentTrack && (
                <div className="mt-3 text-center">
                  <div className="text-lg font-semibold">
                    {currentTrack.title}
                  </div>
                  <div className="text-sm">
                    {currentTrack.artist}
                  </div>
                  <button
                    className="mt-2 px-4 py-1 text-sm rounded bg-red-500 hover:bg-red-600 text-white transition"
                    onClick={stopPlayback}
                  >
                    Stop
                  </button>
                </div>
              )}
            </div>

            {/* Track List */}
            <ul className="max-w-md mx-auto grid gap-4">
              {tracks.map((track) => (
                <li
                  key={track.id}
                  className="bg-white dark:bg-dark-800 rounded-lg shadow p-4 flex justify-between items-center hover:shadow-lg transition"
                >
                  <div>
                    <div className="font-medium">{track.title}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {track.artist}
                    </div>
                  </div>
                  <button
                    className="ml-4 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => playTrack(track)}
                    disabled={loading}
                  >
                    Play
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
