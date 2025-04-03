import axios from "axios";

const BASE_URL = "https://fakestoreapi.com/products";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cache for client-side state
let productsCache = [];

// Get all products
export const getAllProducts = async (useCache = true) => {
  try {
    if (useCache && productsCache.length > 0) {
      return productsCache;
    }
    const response = await axiosInstance.get("/");
    productsCache = response.data;
    return response.data;
  } catch (error) {
    console.error("Error fetching all products", error);
    throw error;
  }
};

// Get single product by id
export const getProductById = async (id) => {
  try {
    // Check cache first
    const cachedProduct = productsCache.find((p) => p.id === id);
    if (cachedProduct) return cachedProduct;

    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}`, error);
    throw error;
  }
};

// Create new product
export const createProduct = async (newProduct) => {
  try {
    // Generate a temporary ID for client-side use
    const tempId = Math.max(...productsCache.map((p) => p.id), 0) + 1;
    const tempProduct = { ...newProduct, id: tempId };

    // Add to cache immediately
    productsCache = [...productsCache, tempProduct];

    // Then try API call
    const response = await axiosInstance.post("/", newProduct);

    // Update cache with real ID if API succeeds
    productsCache = productsCache.map((p) =>
      p.id === tempId ? { ...p, id: response.data.id } : p
    );

    return response.data;
  } catch (error) {
    console.error("Error creating product", error);
    // Remove from cache if API fails
    productsCache = productsCache.filter((p) => p.id !== tempId);
    throw error;
  }
};

// Update product by id
export const updateProduct = async (id, updatedProduct) => {
  try {
    // Update cache first for immediate UI update
    productsCache = productsCache.map((p) =>
      p.id === id ? { ...p, ...updatedProduct } : p
    );

    // Then make API call
    const response = await axiosInstance.put(`/${id}`, updatedProduct);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${id}`, error);
    throw error;
  }
};

// Delete product by id
export const deleteProduct = async (id) => {
  try {
    // Remove from cache first
    productsCache = productsCache.filter((p) => p.id !== id);

    // Then make API call
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with id ${id}`, error);
    throw error;
  }
};

// Clear cache (for testing or resetting)
export const clearProductsCache = () => {
  productsCache = [];
};
