import Hero from "@/components/Hero";
import About from "@/components/About";
import SocialLinks from "@/components/SocialLinks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <About />
      <SocialLinks />
      <Footer />
    </main>
  );
};

export default Index;
