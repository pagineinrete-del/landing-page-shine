import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-32 px-6 bg-card relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-body">
              Chi sono
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-medium mb-8 leading-tight">
              Passione per l'
              <span className="text-gradient-gold">eccellenza</span>
            </h2>
            <div className="space-y-6 text-muted-foreground font-body leading-relaxed">
              <p>
                Sono un professionista dedicato alla creazione di esperienze uniche 
                e memorabili. La mia missione è trasformare ogni idea in qualcosa 
                di straordinario.
              </p>
              <p>
                Con un approccio innovativo e un'attenzione meticolosa ai dettagli, 
                lavoro per superare le aspettative e raggiungere risultati eccezionali.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              {[
                { number: "10+", label: "Anni esperienza" },
                { number: "100+", label: "Progetti completati" },
                { number: "50+", label: "Clienti soddisfatti" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-display text-gradient-gold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground font-body">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual element */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="aspect-square relative">
              {/* Abstract decorative frame */}
              <div className="absolute inset-0 border border-primary/20" />
              <div className="absolute inset-4 border border-primary/30" />
              <div className="absolute inset-8 bg-gradient-to-br from-primary/10 to-transparent" />
              
              {/* Decorative text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[150px] md:text-[200px] font-display text-primary/10 font-bold">
                  G
                </span>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
