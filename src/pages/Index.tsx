import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram } from "lucide-react";

const welcomeWords = [
  { word: "Welcome", lang: "English" },
  { word: "Benvenuto", lang: "Italiano" },
  { word: "Bienvenue", lang: "Français" },
  { word: "Willkommen", lang: "Deutsch" },
  { word: "Bienvenido", lang: "Español" },
  { word: "Bem-vindo", lang: "Português" },
  { word: "Welkom", lang: "Nederlands" },
  { word: "Välkommen", lang: "Svenska" },
  { word: "ようこそ", lang: "日本語" },
  { word: "환영합니다", lang: "한국어" },
  { word: "欢迎", lang: "中文" },
  { word: "أهلاً", lang: "العربية" },
  { word: "Добро пожаловать", lang: "Русский" },
  { word: "Καλώς ήρθατε", lang: "Ελληνικά" },
  { word: "Hoş geldiniz", lang: "Türkçe" },
  { word: "Witaj", lang: "Polski" },
  { word: "Vítejte", lang: "Čeština" },
  { word: "Velkommen", lang: "Norsk" },
  { word: "Tervetuloa", lang: "Suomi" },
  { word: "स्वागत है", lang: "हिन्दी" },
];

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Auto-rotate words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % welcomeWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle tap/click interaction
  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let x: number, y: number;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    setScore((prev) => prev + 1);
    setCurrentIndex((prev) => (prev + 1) % welcomeWords.length);
    
    // Create particle
    const newParticle = { id: Date.now(), x, y };
    setParticles((prev) => [...prev, newParticle]);
    
    // Remove particle after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1000);
  }, []);

  return (
    <div 
      className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden select-none cursor-pointer"
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* Score */}
      <div className="absolute top-4 left-4 text-muted-foreground font-mono text-sm">
        Score: {score}
      </div>

      {/* Floating particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-primary"
            initial={{ 
              x: particle.x, 
              y: particle.y, 
              scale: 1, 
              opacity: 1 
            }}
            animate={{ 
              y: particle.y - 100, 
              scale: 0, 
              opacity: 0 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Main welcome text */}
      <div className="text-center px-6">
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentIndex}
            className="text-4xl sm:text-5xl md:text-6xl font-mono font-light tracking-wide text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {welcomeWords[currentIndex].word}
          </motion.h1>
        </AnimatePresence>

        <motion.p
          className="mt-4 text-xs text-muted-foreground font-mono tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.3 }}
        >
          {welcomeWords[currentIndex].lang}
        </motion.p>
      </div>

      {/* Tap hint */}
      <motion.p
        className="absolute bottom-24 text-xs text-muted-foreground/50 font-mono"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        tap anywhere
      </motion.p>

      {/* Instagram link */}
      <a
        href="https://instagram.com/paolillogennaroreal"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <Instagram className="w-4 h-4" />
        <span className="text-xs font-mono">@paolillogennaroreal</span>
      </a>
    </div>
  );
};

export default Index;
