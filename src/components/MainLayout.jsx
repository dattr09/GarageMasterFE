import React from "react";
import { Outlet, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Accessories from "./Accessories";
import FeaturedProducts from "./FeaturedProducts";
import PartsList from "./Parts/PartsList";
import BrandList from "./Brands/BrandList";

const MainLayout = () => {
  return (
    <div className="main-layout animated-gradient flex flex-col min-h-screen">
      <Header />
      <div className="w-full mt-16 flex flex-col space-y-8">
        <Navbar />
        <Accessories />
        <FeaturedProducts />
      </div>
      <main className="flex-1 p-4">
        <Routes>
          <Route path="brands" element={<BrandList />} />
          <Route path="parts" element={<PartsList />} />
        </Routes>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
