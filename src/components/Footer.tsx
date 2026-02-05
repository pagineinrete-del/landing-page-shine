const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 bg-card border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-display text-xl">
          <span className="text-foreground">Gennaro</span>
          <span className="text-gradient-gold ml-2">Paolillo</span>
        </div>

        <div className="text-sm text-muted-foreground font-body">
          © {currentYear} Gennaro Paolillo. Tutti i diritti riservati.
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com/paolillogennaroreal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-body"
          >
            Instagram
          </a>
          <a
            href="mailto:info@gennaropaolillo.it"
            className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-body"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
