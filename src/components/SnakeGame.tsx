import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setHasStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted) {
        if (gameOver) {
          resetGame();
        } else {
          setIsPaused(p => !p);
        }
        return;
      }

      if (!hasStarted) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          setHasStarted(true);
        } else {
          return;
        }
      }

      if (gameOver || isPaused) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused, hasStarted, generateFood]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);
    gameLoopRef.current = window.setInterval(moveSnake, speed);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [direction, food, gameOver, isPaused, hasStarted, score, generateFood]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="w-full flex justify-between items-end mb-4 border-b-2 border-magenta pb-2">
        <div className="text-6xl md:text-7xl font-bold text-cyan glitch tracking-widest drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" data-text="SNAKE.EXE">SNAKE.EXE</div>
        <div className="text-2xl text-magenta font-bold mb-2">
          SCORE: <span className="text-cyan">{score.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative border-glitch bg-black/90 p-1">
        <div 
          className="grid gap-[1px] bg-cyan/20"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((s, idx) => idx !== 0 && s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`w-full h-full ${
                  isSnakeHead ? 'bg-magenta shadow-[0_0_8px_#ff00ff]' :
                  isSnakeBody ? 'bg-magenta/70' :
                  isFood ? 'bg-cyan shadow-[0_0_8px_#00ffff] animate-pulse' :
                  'bg-black/50'
                }`}
              />
            );
          })}
        </div>

        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col z-10">
            {!hasStarted ? (
              <div className="text-center">
                <h3 className="text-2xl text-cyan mb-4 animate-pulse">SYSTEM_READY</h3>
                <p className="text-magenta">PRESS ARROW KEYS TO INITIATE</p>
              </div>
            ) : gameOver ? (
              <div className="text-center">
                <h3 className="text-4xl text-red-500 font-bold mb-2 glitch" data-text="FATAL_ERROR">FATAL_ERROR</h3>
                <p className="text-cyan mb-4">FINAL SCORE: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-4 py-2 border border-magenta text-magenta hover:bg-magenta hover:text-black transition-colors uppercase font-bold"
                >
                  REBOOT_SYSTEM
                </button>
              </div>
            ) : isPaused ? (
              <div className="text-center">
                <h3 className="text-3xl text-cyan mb-4 animate-pulse">SYSTEM_PAUSED</h3>
                <p className="text-magenta">PRESS SPACE TO RESUME</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-cyan/60 text-center flex gap-4">
        <span>[ARROWS/WASD]: MOVE</span>
        <span>[SPACE]: PAUSE/RESTART</span>
      </div>
    </div>
  );
}
