
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FrequentUserForm } from "@/components/FrequentUser/FrequentUserForm";
import { MobileBottomNav } from "@/components/MobileBottomNav";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Registro de Usuario Frecuente | ParkVista</title>
        <meta name="description" content="Regístrate como usuario frecuente para obtener beneficios exclusivos" />
      </Helmet>
      
      <Navbar />
      
      <div className="flex-grow py-12">
        <FrequentUserForm />
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default RegisterPage;
