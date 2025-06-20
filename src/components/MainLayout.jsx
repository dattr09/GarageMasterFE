import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import HomePage from "./HomePage";
import BrandList from "./Brands/BrandList";
import PartsList from "./Parts/PartsList";
import CustomerList from "./Customers/CustomerList";
import MotoList from "./Motos/MotoList";
import Header from "./Header";
import Footer from "./Footer";
import RepairOrderList from "./RepairOrders/RepairOrderList";
import EmployeeList from "./Employees/EmployeeList";

const HEADER_HEIGHT = 64;

const MainLayout = () => {
  return (
    <div className="main-layout animated-gradient flex flex-col min-h-screen">
      <div
        className="fixed top-0 left-0 w-full z-50 bg-white/80 shadow"
        style={{ height: HEADER_HEIGHT }}
      >
        <Header />
      </div>
      <main className="flex-1 p-4" style={{ paddingTop: HEADER_HEIGHT }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="brands" element={<BrandList />} />
          <Route path="parts" element={<PartsList />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="motos" element={<MotoList />} />
          <Route path="repair-orders" element={<RepairOrderList />} />
          <Route path="employees" element={<EmployeeList />} />
          {/* Add more routes as needed */}
        </Routes>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
