
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PaymentView } from "@/components/Payments/PaymentView";
import { MobileBottomNav } from "@/components/MobileBottomNav";

const PaymentsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Pagos | ParkVista</title>
        <meta name="description" content="Realiza y consulta pagos de parqueaderos en ParkVista" />
      </Helmet>
      
      <Navbar />
      
      <div className="flex-grow py-12">
        <PaymentView />
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default PaymentsPage;
