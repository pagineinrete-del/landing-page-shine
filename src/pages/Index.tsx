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

type EnemyType = "basic" | "fast" | "zigzag" | "tank";
type PowerUpType = "speed" | "multishot" | "shield";

interface Enemy {
  id: number;
  x: number;
  y: number;
  type: EnemyType;
  hp: number;
  startX: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
}

interface PowerUp {
  id: number;
  x: number;
  y: number;
  type: PowerUpType;
}

const enemyConfig: Record<EnemyType, { color: string; speed: number; hp: number; points: number }> = {
  basic: { color: "bg-primary", speed: 2, hp: 1, points: 10 },
  fast: { color: "bg-yellow-500", speed: 4, hp: 1, points: 15 },
  zigzag: { color: "bg-purple-500", speed: 2.5, hp: 1, points: 20 },
  tank: { color: "bg-orange-600", speed: 1.5, hp: 3, points: 50 },
};

const powerUpConfig: Record<PowerUpType, { color: string; duration: number }> = {
  speed: { color: "bg-cyan-400", duration: 5000 },
  multishot: { color: "bg-green-400", duration: 8000 },
  shield: { color: "bg-blue-400", duration: 4000 },
};

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
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<Set<PowerUpType>>(new Set());
  const gameRef = useRef<HTMLDivElement>(null);
  const lastTouchX = useRef(50);

  // Auto-rotate welcome words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % welcomeWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Spawn enemies with variety
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const types: EnemyType[] = ["basic", "basic", "fast", "zigzag", "tank"];
      const type = types[Math.floor(Math.random() * types.length)];
      const x = Math.random() * 80 + 10;
      const newEnemy: Enemy = {
        id: Date.now() + Math.random(),
        x,
        y: 0,
        type,
        hp: enemyConfig[type].hp,
        startX: x,
      };
      setEnemies((prev) => [...prev, newEnemy]);
    }, 1200);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Spawn power-ups occasionally
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const types: PowerUpType[] = ["speed", "multishot", "shield"];
        const type = types[Math.floor(Math.random() * types.length)];
        const newPowerUp: PowerUp = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: 0,
          type,
        };
        setPowerUps((prev) => [...prev, newPowerUp]);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Move enemies down with different behaviors
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setEnemies((prev) => {
        const updated = prev.map((e) => {
          const config = enemyConfig[e.type];
          let newX = e.x;
          if (e.type === "zigzag") {
            newX = e.startX + Math.sin(e.y * 0.1) * 15;
          }
          return { ...e, x: newX, y: e.y + config.speed };
        });
        if (updated.some((e) => e.y > 85) && !activePowerUps.has("shield")) {
          setGameOver(true);
        }
        return updated.filter((e) => e.y <= 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [gameOver, activePowerUps]);

  // Move power-ups down
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setPowerUps((prev) => prev.map((p) => ({ ...p, y: p.y + 1.5 })).filter((p) => p.y < 100));
    }, 100);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Check power-up collection
  useEffect(() => {
    if (gameOver) return;
    setPowerUps((currentPowerUps) => {
      const collected: PowerUp[] = [];
      const remaining = currentPowerUps.filter((p) => {
        const dx = Math.abs(p.x - playerX);
        const dy = Math.abs(p.y - 85);
        if (dx < 8 && dy < 8) {
          collected.push(p);
          return false;
        }
        return true;
      });
      
      collected.forEach((p) => {
        setActivePowerUps((prev) => new Set([...prev, p.type]));
        setTimeout(() => {
          setActivePowerUps((prev) => {
            const next = new Set(prev);
            next.delete(p.type);
            return next;
          });
        }, powerUpConfig[p.type].duration);
      });
      
      return remaining;
    });
  }, [playerX, gameOver]);

  // Move bullets up (faster with speed power-up)
  useEffect(() => {
    if (gameOver) return;
    const bulletSpeed = activePowerUps.has("speed") ? 6 : 4;
    const interval = setInterval(() => {
      setBullets((prev) => prev.map((b) => ({ ...b, y: b.y - bulletSpeed })).filter((b) => b.y > 0));
    }, 50);
    return () => clearInterval(interval);
  }, [gameOver, activePowerUps]);

  // Collision detection with HP system
  useEffect(() => {
    if (gameOver) return;
    setBullets((currentBullets) => {
      let bulletsToRemove: number[] = [];
      
      setEnemies((currentEnemies) => {
        return currentEnemies.map((enemy) => {
          let hitEnemy = { ...enemy };
          currentBullets.forEach((bullet) => {
            const dx = Math.abs(bullet.x - enemy.x);
            const dy = Math.abs(bullet.y - enemy.y);
            const hitRadius = enemy.type === "tank" ? 7 : 5;
            if (dx < hitRadius && dy < hitRadius && !bulletsToRemove.includes(bullet.id)) {
              bulletsToRemove.push(bullet.id);
              hitEnemy.hp -= 1;
              if (hitEnemy.hp <= 0) {
                setScore((prev) => prev + enemyConfig[enemy.type].points);
              }
            }
          });
          return hitEnemy;
        }).filter((e) => e.hp > 0);
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

  // Handle shooting (with multishot power-up)
  const handleShoot = useCallback(() => {
    if (gameOver) return;
    const hasMultishot = activePowerUps.has("multishot");
    const newBullets: Bullet[] = hasMultishot
      ? [
          { id: Date.now(), x: playerX - 3, y: 85 },
          { id: Date.now() + 1, x: playerX, y: 85 },
          { id: Date.now() + 2, x: playerX + 3, y: 85 },
        ]
      : [{ id: Date.now(), x: playerX, y: 85 }];
    setBullets((prev) => [...prev, ...newBullets]);
  }, [playerX, gameOver, activePowerUps]);

  // Restart game
  const restartGame = () => {
    setScore(0);
    setEnemies([]);
    setBullets([]);
    setPowerUps([]);
    setActivePowerUps(new Set());
    setGameOver(false);
    setPlayerX(50);
    setColorIndex((prev) => (prev + 1) % gameOverColors.length);
  };

  const shieldActive = activePowerUps.has("shield");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Score & Active Power-ups */}
      <div className="absolute top-4 left-4 z-20">
        <div className="text-primary font-mono text-sm">Score: {score}</div>
        {activePowerUps.size > 0 && (
          <div className="flex gap-1 mt-2">
            {activePowerUps.has("speed") && (
              <span className="text-xs px-2 py-0.5 bg-cyan-400/20 text-cyan-400 rounded">SPEED</span>
            )}
            {activePowerUps.has("multishot") && (
              <span className="text-xs px-2 py-0.5 bg-green-400/20 text-green-400 rounded">MULTI</span>
            )}
            {activePowerUps.has("shield") && (
              <span className="text-xs px-2 py-0.5 bg-blue-400/20 text-blue-400 rounded">SHIELD</span>
            )}
          </div>
        )}
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

        {/* Enemies with different types */}
        {enemies.map((enemy) => (
          <motion.div
            key={enemy.id}
            className={`absolute ${enemyConfig[enemy.type].color} ${enemy.type === "tank" ? "w-8 h-8 rounded" : "w-6 h-6"}`}
            style={{
              left: `${enemy.x}%`,
              top: `${enemy.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: enemy.type === "zigzag" ? [0, 10, -10, 0] : 0 }}
            transition={enemy.type === "zigzag" ? { rotate: { repeat: Infinity, duration: 0.5 } } : undefined}
          >
            {enemy.type === "tank" && enemy.hp > 1 && (
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {enemy.hp}
              </span>
            )}
          </motion.div>
        ))}

        {/* Power-ups */}
        {powerUps.map((powerUp) => (
          <motion.div
            key={powerUp.id}
            className={`absolute w-5 h-5 ${powerUpConfig[powerUp.type].color} rounded-full`}
            style={{
              left: `${powerUp.x}%`,
              top: `${powerUp.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
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

        {/* Player ship with shield indicator */}
        <div
          className={`absolute bottom-[10%] w-0 h-0 ${shieldActive ? "drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" : ""}`}
          style={{
            left: `${playerX}%`,
            transform: "translateX(-50%)",
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderBottom: shieldActive ? "20px solid #3b82f6" : "20px solid white",
          }}
        />
        {shieldActive && (
          <div
            className="absolute bottom-[8%] w-10 h-10 border-2 border-blue-400 rounded-full opacity-50"
            style={{
              left: `${playerX}%`,
              transform: "translateX(-50%)",
            }}
          />
        )}

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
