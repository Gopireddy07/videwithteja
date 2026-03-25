import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative font-mono">
      <div className="crt"></div>
      <div className="static-noise"></div>
      
      <div className="absolute top-4 left-4 text-xs text-magenta/50 hidden md:block">
        <p>SYS.VER: 9.4.2</p>
        <p>MEM: 0x4F2A</p>
        <p>STATUS: ONLINE</p>
      </div>

      <div className="absolute bottom-4 right-4 text-xs text-cyan/50 hidden md:block text-right">
        <p>CONNECTION: SECURE</p>
        <p>LATENCY: 12ms</p>
      </div>

      <div className="z-20 w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
        <div className="w-full lg:w-2/3 flex justify-center">
          <SnakeGame />
        </div>
        
        <div className="w-full lg:w-1/3 flex flex-col gap-8 mt-8 lg:mt-0">
          <div className="hidden lg:block border border-magenta/30 p-4 text-xs text-cyan/70 bg-black/50">
            <p className="mb-2 text-magenta font-bold">&gt;&gt; TERMINAL_OUTPUT</p>
            <p className="animate-pulse">_INITIALIZING PROTOCOLS...</p>
            <p>_LOADING AUDIO SUBSYSTEM...</p>
            <p>_ESTABLISHING NEURAL LINK...</p>
            <p className="text-green-400">_ALL SYSTEMS NOMINAL</p>
          </div>
          
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}
