"use client";

import { useRouter } from "next/navigation";
import { FiHome, FiShoppingBag, FiUser, FiSearch } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 w-full z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <FiShoppingBag className="text-2xl" />
            <Link
              href="/"
              className="text-xl font-bold tracking-tight hover:text-blue-100 transition-colors"
            >
              Clothes Store
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 relative rounded-full hover:bg-blue-500 transition-colors">
              <HiOutlineShoppingCart className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-1 bg-white text-blue-600 font-semibold py-1 px-3 rounded-lg shadow hover:bg-gray-100 transition-colors"
            >
              <FiHome />
              <span>Home</span>
            </button>
            <div className="hidden sm:flex items-center space-x-2 bg-blue-500 hover:bg-blue-400 transition-colors rounded-full px-3 py-1 cursor-pointer">
              <FiUser className="text-lg" />
              <span className="font-medium">Guest</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
