import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [wishlistedIds, setWishlistedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Electronics", "Books", "Clothing", "Furniture", "Stationery", "Sports", "Other"];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, wishlistRes] = await Promise.all([
        apiClient.get("/products/get-all"),
        apiClient.get("/wishlist/ids").catch(() => ({ data: { data: [] } })) // Handle non-logged in state
      ]);
      setProducts(productsRes.data.data || []);
      setWishlistedIds(wishlistRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleWishlist = async (productId) => {
    try {
      const response = await apiClient.post("/wishlist/toggle", { productId });
      if (response.data.isWishlisted) {
        setWishlistedIds([...wishlistedIds, productId]);
        toast.success("Added to wishlist");
      } else {
        setWishlistedIds(wishlistedIds.filter(id => id !== productId));
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.warning("Please sign in to save items");
      } else {
        toast.error("Wishlist action failed");
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Theme-aware styles
  const themedStyle = {
    color: "var(--mui-palette-text-primary)",
    backgroundColor: "var(--mui-palette-background-default)",
  };

  const cardStyle = {
    backgroundColor: "var(--mui-palette-background-paper)",
    borderColor: "var(--mui-palette-divider)",
  };

  const secondaryTextStyle = {
    color: "var(--mui-palette-text-secondary)",
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={themedStyle}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase">
            Campus <span className="text-blue-600">Marketplace</span>
          </h1>
          <p className="text-lg opacity-70 max-w-2xl mx-auto" style={secondaryTextStyle}>
            Discover pre-loved essentials from your fellow students. Quality gear, student prices.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-4 pl-12 pr-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              style={{ borderColor: "var(--mui-palette-divider)" }}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="font-bold uppercase tracking-widest text-blue-500">Curating the best deals...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed rounded-3xl opacity-50" style={{ borderColor: "var(--mui-palette-divider)" }}>
            <h3 className="text-2xl font-bold mb-2">No items found</h3>
            <p>Try adjusting your search or category filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="group flex flex-col sm:flex-row h-auto sm:h-48 rounded-2xl overflow-hidden border transition-all duration-300 hover:border-blue-500/50"
                style={{ 
                  backgroundColor: "var(--mui-palette-background-paper)",
                  borderColor: "var(--mui-palette-divider)",
                }}
              >
                {/* Fixed Dimension Image Section */}
                <div className="relative w-full sm:w-64 h-48 sm:h-full flex-shrink-0 overflow-hidden bg-gray-100">
                  <img
                    src={product.images?.[0]?.url || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[9px] font-bold text-white uppercase tracking-widest border border-white/10 shadow-lg">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Content Section with Fixed Layout */}
                <div className="flex-1 p-5 flex flex-col justify-between overflow-hidden">
                  <div className="flex justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold tracking-tight truncate" style={{ color: "var(--mui-palette-text-primary)" }}>
                          {product.title}
                        </h3>
                        {product.quantity > 0 && (
                          <span className="flex-shrink-0 text-[8px] px-1.5 py-0.5 bg-blue-500 text-white rounded font-black uppercase tracking-tighter">
                            Active
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-[10px] font-bold opacity-50 uppercase tracking-wider mb-2">
                        <span className="flex items-center gap-1 truncate max-w-[150px]">
                          <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {product.college?.collegeName || "Campus"}
                        </span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
                        <span className="flex-shrink-0">Stock: {product.quantity}</span>
                      </div>

                      <p className="text-xs opacity-60 line-clamp-2 leading-relaxed" style={secondaryTextStyle}>
                        {product.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-start flex-shrink-0">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold text-blue-500">₹</span>
                        <span className="text-2xl font-black text-blue-600 tracking-tighter">{product.price.toLocaleString()}</span>
                      </div>
                      <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Buy Now</span>
                    </div>
                  </div>

                  {/* Refined Actions Section */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t" style={{ borderColor: "var(--mui-palette-divider)" }}>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-500 uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Verified
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleWishlist(product._id)}
                        className={`group/heart p-2.5 rounded-xl transition-all duration-300 cursor-pointer border ${
                          wishlistedIds.includes(product._id)
                            ? "bg-red-50 text-red-500 border-red-100"
                            : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 border-transparent"
                        }`}
                        title={wishlistedIds.includes(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                        style={{ backgroundColor: wishlistedIds.includes(product._id) ? "" : "var(--mui-palette-background-default)" }}
                      >
                        <svg 
                          className={`w-5 h-5 transition-transform duration-300 group-hover/heart:scale-110 ${
                            wishlistedIds.includes(product._id) ? "fill-current" : ""
                          }`} 
                          fill={wishlistedIds.includes(product._id) ? "currentColor" : "none"}
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 006.364-6.364 4.5 4.5 0 00-6.364 0L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button 
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-500/10 active:scale-[0.98]"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Products;
