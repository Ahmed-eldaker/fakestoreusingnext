"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiLoader } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { getAllProducts, deleteProduct } from "../utils/api";
import Link from "next/link";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Delete error:", error);
      fetchProducts();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
          Discover Our Amazing Products
        </h1>

        <div className="flex justify-between items-center mb-8">
          <Link
            href="/product/new"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
          >
            <FiPlus className="text-lg" />
            <span>Add New Product</span>
          </Link>

          {loading && (
            <div className="flex items-center text-gray-500">
              <FiLoader className="animate-spin mr-2" />
              Loading products...
            </div>
          )}
        </div>

        {!loading && products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products found</p>
            <Link
              href="/product/new"
              className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image || "/placeholder-product.jpg"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/placeholder-product.jpg";
                    }}
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                    {product.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-lg font-bold text-green-600 mb-4">
                    ${product.price}
                  </p>

                  <div className="flex flex-col space-y-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    >
                      <FiEye />
                      <span>View Details</span>
                    </Link>

                    <div className="flex gap-2">
                      <Link
                        href={`/product/edit/${product.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                      >
                        <FiEdit />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors"
                      >
                        <FiTrash2 />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
