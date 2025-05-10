
import Hero from "@/sections/Hero";
import Mission from "@/sections/Mission";
import Showcase from "@/sections/Showcase";
import ProjectSpotlight from "@/sections/ProjectSpotlight";
import EmailSignup from "@/sections/EmailSignup";
import Footer from "@/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen theme-transition">
      <Hero />
      <Mission />
      <Showcase />
      <ProjectSpotlight />
      <EmailSignup />
      <Footer />
    </div>
  );
};

export default Index;
