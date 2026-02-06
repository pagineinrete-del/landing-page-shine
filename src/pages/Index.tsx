import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";


const welcomeWords = [
  { word: "Welcome", lang: "English" },
  { word: "Benvenuto", lang: "Italiano" },
  { word: "Bienvenue", lang: "Français" },
  { word: "Willkommen", lang: "Deutsch" },
  { word: "Bienvenido", lang: "Español" },
  { word: "ようこそ", lang: "日本語" },
  { word: "환영합니다", lang: "한국어" },
  { word: "欢迎", lang: "中文" },
  { word: "Добро пожаловать", lang: "Русский" },
  { word: "أهلاً", lang: "العربية" },
];

interface Enemy {
  id: number;
  x: number;
  y: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
}

const gameOverColors = [
  "text-red-500 border-red-500",
  "text-blue-500 border-blue-500",
  "text-green-500 border-green-500",
  "text-yellow-500 border-yellow-500",
  "text-purple-500 border-purple-500",
  "text-pink-500 border-pink-500",
  "text-cyan-500 border-cyan-500",
  "text-orange-500 border-orange-500",
];

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(50);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const lastTouchX = useRef(50);

  // Auto-rotate welcome words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % welcomeWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Spawn enemies
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const newEnemy: Enemy = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: 0,
      };
      setEnemies((prev) => [...prev, newEnemy]);
    }, 1500);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Move enemies down
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setEnemies((prev) => {
        const updated = prev.map((e) => ({ ...e, y: e.y + 2 }));
        // Check if any enemy reached bottom
        if (updated.some((e) => e.y > 85)) {
          setGameOver(true);
        }
        return updated.filter((e) => e.y <= 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Move bullets up
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setBullets((prev) => prev.map((b) => ({ ...b, y: b.y - 4 })).filter((b) => b.y > 0));
    }, 50);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Collision detection
  useEffect(() => {
    if (gameOver) return;
    setBullets((currentBullets) => {
      let bulletsToRemove: number[] = [];
      
      setEnemies((currentEnemies) => {
        let enemiesToRemove: number[] = [];
        
        currentBullets.forEach((bullet) => {
          currentEnemies.forEach((enemy) => {
            const dx = Math.abs(bullet.x - enemy.x);
            const dy = Math.abs(bullet.y - enemy.y);
            if (dx < 5 && dy < 5) {
              bulletsToRemove.push(bullet.id);
              enemiesToRemove.push(enemy.id);
              setScore((prev) => prev + 10);
            }
          });
        });
        
        return currentEnemies.filter((e) => !enemiesToRemove.includes(e.id));
      });
      
      return currentBullets.filter((b) => !bulletsToRemove.includes(b.id));
    });
  }, [bullets, enemies, gameOver]);

  // Handle touch/mouse movement
  const handleMove = useCallback((clientX: number) => {
    if (!gameRef.current || gameOver) return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(5, Math.min(95, x)));
    lastTouchX.current = x;
  }, [gameOver]);

  // Handle shooting
  const handleShoot = useCallback(() => {
    if (gameOver) return;
    const newBullet: Bullet = {
      id: Date.now(),
      x: playerX,
      y: 85,
    };
    setBullets((prev) => [...prev, newBullet]);
  }, [playerX, gameOver]);

  // Restart game
  const restartGame = () => {
    setScore(0);
    setEnemies([]);
    setBullets([]);
    setGameOver(false);
    setPlayerX(50);
    setColorIndex((prev) => (prev + 1) % gameOverColors.length);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Score */}
      <div className="absolute top-4 left-4 text-primary font-mono text-sm z-20">
        Score: {score}
      </div>

      {/* Welcome text */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-20">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            className="text-3xl md:text-4xl font-mono font-light tracking-wide text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {welcomeWords[currentIndex].word}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Game area */}
      <div
        ref={gameRef}
        className="w-full h-[70vh] relative touch-none"
        onMouseMove={(e) => handleMove(e.clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onClick={handleShoot}
        onTouchStart={(e) => {
          handleMove(e.touches[0].clientX);
          handleShoot();
        }}
      >
        {/* Stars background */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-foreground/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Enemies */}
        {enemies.map((enemy) => (
          <motion.div
            key={enemy.id}
            className="absolute w-6 h-6 bg-primary"
            style={{
              left: `${enemy.x}%`,
              top: `${enemy.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        ))}

        {/* Bullets */}
        {bullets.map((bullet) => (
          <div
            key={bullet.id}
            className="absolute w-1 h-3 bg-foreground"
            style={{
              left: `${bullet.x}%`,
              top: `${bullet.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Player ship */}
        <div
          className="absolute bottom-[10%] w-0 h-0"
          style={{
            left: `${playerX}%`,
            transform: "translateX(-50%)",
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderBottom: "20px solid white",
          }}
        />

        {/* Game Over overlay */}
        {gameOver && (
          <motion.div
            className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className={`text-2xl font-mono mb-4 ${gameOverColors[colorIndex]}`}>GAME OVER</h2>
            <p className={`font-mono mb-6 ${gameOverColors[colorIndex]}`}>Score: {score}</p>
            <button
              onClick={restartGame}
              className={`px-6 py-2 border font-mono transition-colors ${gameOverColors[colorIndex]} hover:bg-current hover:text-background`}
            >
              RESTART
            </button>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      <p className="absolute bottom-20 text-xs text-muted-foreground/50 font-mono text-center px-4">
        move & tap to shoot
      </p>

      {/* Contact link */}
      <a
        href="https://instagram.com/paolillogennaroreal"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-6 text-muted-foreground hover:text-primary transition-colors duration-300 z-20"
      >
        <span className="text-xs font-mono uppercase tracking-widest">contact</span>
      </a>
    </div>
  );
};

export default Index;
