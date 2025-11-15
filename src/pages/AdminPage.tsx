
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AdminDashboard } from "@/components/Admin/AdminDashboard";

const AdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Admin Dashboard | ParkVista</title>
        <meta name="description" content="Administra tarifas y ubicaciones de ParkVista" />
      </Helmet>
      
      <Navbar />
      
      <div className="flex-grow">
        <AdminDashboard />
      </div>

      <Footer />
    </div>
  );
};

export default AdminPage;
