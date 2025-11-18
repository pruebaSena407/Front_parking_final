
import Navbar from "@/components/Navbar";
import Reports from "@/components/Reports";
import Footer from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

const ReportsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Reports />
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default ReportsPage;
