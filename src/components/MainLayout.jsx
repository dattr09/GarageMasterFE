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
import Cart from "./Cart";
import Checkout from "./Checkout";
import OrderSuccess from "./OrderSuccess";
import InvoiceList from "./Invoices/InvoiceList";
import RevenueStats from "./Invoices/RevenueStats";

const HEADER_HEIGHT = 64;

// Layout chính cho toàn bộ trang, chứa Header, Footer và định tuyến các trang con
const MainLayout = () => {
  return (
    <div className="main-layout bg-gradient-to-tr from-blue-200 via-white to-blue-100 flex flex-col min-h-screen">
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
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/revenue-stats" element={<RevenueStats />} />
        </Routes>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
