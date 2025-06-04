import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Accessories from "./Accessories";
import FeaturedProducts from "./FeaturedProducts";

const MainLayout = () => {
  return (
    <div className="main-layout flex flex-col min-h-screen bg-red-600">
      <Header />
      <div className="w-full mt-16 flex flex-col space-y-8">
        <Navbar />
        <Accessories />
        <FeaturedProducts />
      </div>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default MainLayout;
