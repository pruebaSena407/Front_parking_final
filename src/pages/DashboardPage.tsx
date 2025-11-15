import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClientDashboard } from "@/components/Dashboard/ClientDashboard";
import { EmployeeDashboard } from "@/components/Dashboard/EmployeeDashboard";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardPage = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto py-8 px-4">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Dashboard | ParkVista</title>
        <meta name="description" content="Panel de control de ParkVista" />
      </Helmet>

      <Navbar />

      <div className="flex-grow">
        {userRole === "cliente" && <ClientDashboard />}
        {(userRole === "empleado" || userRole === "admin") && <EmployeeDashboard />}
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;
