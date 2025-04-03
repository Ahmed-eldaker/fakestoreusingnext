"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, deleteProduct } from "../../../utils/api";
import Link from "next/link";
import { FiEdit, FiTrash2, FiArrowLeft, FiStar } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import toast from "react-hot-toast";
import Image from "next/image";

const ProductDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const data = await getProductById(id);
          if (!data) {
            setError("Product not found");
            toast.error("Product not found");
          } else {
            setProduct(data);
          }
        } catch (error) {
          setError("Failed to fetch product details");
          toast.error("Failed to load product");
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      router.push("/");
    } catch (error) {
      setError("Failed to delete product");
      toast.error("Failed to delete product");
      console.error("Error deleting product:", error);
    }
  };

  const handleAddToCart = () => {
    toast.success(`${quantity} ${product.title} added to cart`);
  };

  if (loading)
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );

  if (error) return <p className="text-red-600 text-center py-8">{error}</p>;
  if (!product) return <p className="text-center py-8">Product not found</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <button
        onClick={() => router.back()}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        Back to products
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              onError={(e) => {
                e.target.src = "/placeholder-product.jpg";
              }}
            />
          </div>

          <div className="space-y-4">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-2">
                {product.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {product.title}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                <FiStar className="text-yellow-500 mr-1" />
                <span className="font-medium">
                  {product.rating.rate} ({product.rating.count} reviews)
                </span>
              </div>
            </div>

            <p className="text-gray-700 text-lg">{product.description}</p>

            <div className="text-3xl font-bold text-green-600">
              ${product.price}
            </div>

            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center border rounded-md overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1 w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                <HiOutlineShoppingCart className="text-lg" />
                <span>Add to Cart</span>
              </button>
            </div>

            <div className="flex space-x-3 pt-6 border-t border-gray-200 mt-6">
              <Link
                href={`/product/edit/${product.id}`}
                className="flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
              >
                <FiEdit />
                <span>Edit Product</span>
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center justify-center space-x-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-md transition-colors"
              >
                <FiTrash2 />
                <span>Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
