import React, { useEffect, useState } from "react";
import {
  getAllParts,
  deletePart,
} from "../../services/PartsApi";
import { getAllBrands } from "../../services/BrandApi";
import AddPartForm from "./AddPartForm";
import EditPartForm from "./EditPartForm";
import PartDetails from "./PartDetails";
import Swal from "sweetalert2";
import {
  Trash2,
  Pencil,
  ShoppingCart,
  PlusCircle,
} from "lucide-react";
import { useLocation } from "react-router-dom";

export default function PartsList() {
  const location = useLocation();
  const [parts, setParts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPart, setSelectedPart] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sortPrice, setSortPrice] = useState("");
  const [brandFilter, setBrandFilter] = useState("");

  // Lấy brand từ query string khi mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const brandName = params.get("brand");
    if (brandName && brands.length > 0) {
      // Tìm id hãng theo tên
      const found = brands.find(b => b.name === brandName);
      if (found) setBrandFilter(String(found.id));
    }
  }, [location.search, brands]);

  // Tự động set search theo query param "name"
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get("name");
    if (name) setSearch(name);
  }, [location.search]);

  // Animation style
  const fadeInStyle = `
    @keyframes fadeIn {
      0% { opacity: 0; transform: scale(0.98);}
      100% { opacity: 1; transform: scale(1);}
    }
    .animate-fade-in {
      animation: fadeIn 0.6s ease-in-out;
    }
  `;

  useEffect(() => {
    getAllParts().then(setParts);
    getAllBrands().then(setBrands);
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn chắc chắn muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      await deletePart(id);
      setParts(parts.filter((p) => p.id !== id));
      Swal.fire("Đã xóa!", "Phụ tùng đã được xóa.", "success");
    }
  };

  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : brandId;
  };

  const handleAddToCart = (item) => {
    if (item.quantity <= 0) {
      alert("Phụ tùng này đã hết hàng!");
      return;
    }
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = cart.findIndex((i) => i.id === item.id);
    const maxQuantity = item.quantity;
    if (idx >= 0) {
      if (cart[idx].quantity >= maxQuantity) {
        alert("Bạn đã thêm tối đa số lượng tồn kho!");
        return;
      }
      cart[idx].quantity += 1;
    } else {
      if (maxQuantity <= 0) {
        alert("Phụ tùng này đã hết hàng!");
        return;
      }
      cart.push({ ...item, quantity: 1, maxQuantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartChanged"));
    alert(`Đã thêm ${item.name} vào giỏ hàng!`);
  };

  const handleBuy = (item) => {
    if (item.quantity <= 0) {
      alert("Phụ tùng này đã hết hàng!");
      return;
    }
  };

  // Lọc, tìm kiếm, sắp xếp
  let filteredParts = [...parts];

  // Search theo tên (tự động)
  if (search.trim()) {
    filteredParts = filteredParts.filter((p) =>
      p.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }

  // Lọc theo hãng
  if (brandFilter) {
    filteredParts = filteredParts.filter(
      (p) => String(p.brandId) === String(brandFilter)
    );
  }

  // Sắp xếp theo giá
  if (sortPrice === "asc") {
    filteredParts.sort((a, b) => a.price - b.price);
  } else if (sortPrice === "desc") {
    filteredParts.sort((a, b) => b.price - a.price);
  }

  return (
    <>
      <style>{fadeInStyle}</style>
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl p-6 mt-6 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-6 drop-shadow-md">
          🧰 Danh sách phụ tùng
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
          <input
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Tìm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => setShowForm({ type: "add" })}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-800 text-white font-bold px-4 py-2 rounded-xl transition shadow"
          >
            <PlusCircle size={20} /> Thêm mới
          </button>
          <select
            className="border rounded-xl px-3 py-2"
            value={sortPrice}
            onChange={(e) => setSortPrice(e.target.value)}
          >
            <option value="">Sắp xếp giá</option>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
          <select
            className="border rounded-xl px-3 py-2"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <option value="">Tất cả hãng</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredParts.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 italic py-8">
              Không có phụ tùng nào.
            </div>
          ) : (
            filteredParts.map((part) => (
              <div
                key={part.id}
                className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-5 flex flex-col items-center relative transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group border border-gray-200"
                style={{ minHeight: 340 }}
              >
                {part.image ? (
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-28 h-28 object-contain rounded-xl shadow mb-3 bg-white transition-transform duration-200 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center bg-gray-200 rounded-xl mb-3 text-gray-500 italic">
                    Không có ảnh
                  </div>
                )}

                <div
                  className="font-bold text-lg text-blue-900 mb-1 text-center cursor-pointer hover:underline hover:text-blue-600 transition"
                  onClick={() => setSelectedPart(part)}
                >
                  {part.name}
                </div>

                <div className="text-gray-700 text-sm mb-1">
                  Còn:{" "}
                  <span className="font-semibold text-black">
                    {part.quantity}
                  </span>
                </div>

                <div className="text-blue-800 font-bold text-xl mb-1">
                  {part.price
                    .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                    .replace("₫", "VNĐ")}
                </div>

                <div className="text-sm text-gray-500 mb-1">Đơn vị: {part.unit}</div>
                <div className="text-sm text-gray-500 mb-2">
                  Hãng:{" "}
                  <span className="text-blue-600 font-semibold">
                    {getBrandName(part.brandId)}
                  </span>
                </div>

                <div className="flex gap-2 mt-auto flex-wrap justify-center">
                  <button
                    onClick={() => setShowForm({ type: "edit", part })}
                    className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                    title="Sửa"
                  >
                    <Pencil size={16} /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(part.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                    title="Xóa"
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                  <button
                    onClick={() => handleAddToCart(part)}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-800 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                    title="Thêm giỏ hàng"
                    disabled={part.quantity <= 0}
                  >
                    <ShoppingCart size={16} /> Giỏ hàng
                  </button>
                </div>
                {part.quantity <= 0 && (
                  <div className="text-red-600 font-bold mt-2">Hết hàng</div>
                )}
              </div>
            ))
          )}
        </div>

        {showForm &&
          (showForm.type === "add" ? (
            <AddPartForm
              onClose={() => setShowForm(false)}
              onSaved={() => {
                getAllParts().then(setParts);
                setShowForm(false);
              }}
            />
          ) : (
            <EditPartForm
              part={showForm.part}
              onClose={() => setShowForm(false)}
              onSaved={() => {
                getAllParts().then(setParts);
                setShowForm(false);
              }}
            />
          ))}

        {selectedPart && (
          <PartDetails
            part={selectedPart}
            brands={brands}
            onClose={() => setSelectedPart(null)}
          />
        )}
      </div>
    </>
  );
}
