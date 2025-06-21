import React, { useEffect, useState } from "react";
import { getAllParts } from "../services/PartsApi";
import { getAllBrands } from "../services/BrandApi";
import NavbarCarousel from "./HomePage/NavbarCarousel";
import Accessories from "./HomePage/Accessories";
import FeaturedProducts from "./HomePage/FeaturedProducts";
import ServiceCards from "./HomePage/ServiceCards";
import CustomerReviews from "./HomePage/CustomerReviews";

export default function HomePage() {
  const [parts, setParts] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    getAllParts().then(setParts);
    getAllBrands().then(setBrands);
  }, []);

  return (
    <div className="w-full max-w-9xl mx-auto px-4 flex flex-col gap-8">
      <NavbarCarousel />
      <ServiceCards />
      <Accessories parts={parts} />
      <FeaturedProducts parts={parts} brands={brands} />
      <CustomerReviews />
    </div>
  );
}