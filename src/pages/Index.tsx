
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import LocationMap from "@/components/LocationMap";
import Login from "@/components/Login";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <LocationMap />
      <Login />
      <Footer />
    </div>
  );
};

export default Index;
