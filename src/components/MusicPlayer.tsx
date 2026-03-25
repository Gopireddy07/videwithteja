import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'AI_GEN_01_NEURAL_DRIFT', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'AI_GEN_02_SYNTHETIC_SORROW', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'AI_GEN_03_VOID_RESONANCE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  return (
    <div className="border-glitch p-4 bg-black/80 flex flex-col gap-4 w-full max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-magenta animate-pulse"></div>
      
      <div className="flex justify-between items-center border-b border-cyan/30 pb-2">
        <h2 className="text-xl font-bold text-magenta glitch" data-text="AUDIO_SUBSYSTEM">AUDIO_SUBSYSTEM</h2>
        <div className="text-xs text-cyan animate-pulse">STATUS: {isPlaying ? 'ACTIVE' : 'IDLE'}</div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-xs text-cyan/70">CURRENT_TRACK:</div>
        <div className="text-lg text-cyan truncate font-bold">
          {'>'} {currentTrack.title}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-4">
          <button onClick={handlePrev} className="text-cyan hover:text-magenta transition-colors focus:outline-none">
            <SkipBack size={24} />
          </button>
          <button onClick={handlePlayPause} className="text-magenta hover:text-cyan transition-colors focus:outline-none">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={handleNext} className="text-cyan hover:text-magenta transition-colors focus:outline-none">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(!isMuted)} className="text-cyan hover:text-magenta focus:outline-none">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-20 h-1 bg-cyan/30 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-magenta"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleTrackEnded}
        className="hidden"
      />
    </div>
  );
}
