import React from "react";
import { Outlet, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PartsList from "./Parts/PartsList";
import BrandList from "./Brands/BrandList";
import HomePage from "./HomePage";

const MainLayout = () => {
  return (
    <div className="main-layout animated-gradient flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
