import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Instagram, Mail, ExternalLink } from "lucide-react";

const socials = [
  {
    name: "Instagram",
    handle: "@paolillogennaroreal",
    url: "https://instagram.com/paolillogennaroreal",
    icon: Instagram,
    description: "Seguimi per contenuti esclusivi",
  },
  {
    name: "Email",
    handle: "info@gennaropaolillo.it",
    url: "mailto:info@gennaropaolillo.it",
    icon: Mail,
    description: "Scrivimi per collaborazioni",
  },
];

const SocialLinks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-32 px-6 bg-background relative" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.span
          className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-body"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Connettiti
        </motion.span>
        <motion.h2
          className="text-4xl md:text-5xl font-display font-medium mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Restiamo in <span className="text-gradient-gold">contatto</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {socials.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target={social.name !== "Email" ? "_blank" : undefined}
              rel={social.name !== "Email" ? "noopener noreferrer" : undefined}
              className="group relative p-8 bg-card border border-border hover:border-primary/50 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex items-start gap-4">
                <div className="p-3 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <social.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-display text-foreground">
                      {social.name}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-primary font-body text-sm mb-2">
                    {social.handle}
                  </p>
                  <p className="text-muted-foreground text-sm font-body">
                    {social.description}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialLinks;
