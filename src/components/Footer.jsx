import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
      <div className="container mx-auto">
        <p className="text-sm font-medium">
          &copy; {new Date().getFullYear()} GarageMaster. All rights reserved.
        </p>
        <div className="mt-2 flex justify-center gap-6 text-gray-400 text-lg">
          <a href="mailto:support@garagemaster.com" className="hover:text-white">Liên hệ</a>
          <a href="/about" className="hover:text-white">Giới thiệu</a>
          <a href="/policy" className="hover:text-white">Chính sách</a>
        </div>
      </div>
    </footer>
  );
}