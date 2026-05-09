import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/wishlist/get-all");
      setWishlist(response.data.data || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await apiClient.post("/wishlist/toggle", { productId });
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Theme-aware styles
  const themedStyle = {
    color: "var(--mui-palette-text-primary)",
    backgroundColor: "var(--mui-palette-background-default)",
  };

  const cardStyle = {
    backgroundColor: "var(--mui-palette-background-paper)",
    borderColor: "var(--mui-palette-divider)",
  };

  return (
    <div className="min-h-screen p-4 md:p-10 transition-all duration-300" style={themedStyle}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">
              My <span className="text-pink-500">Wishlist</span>
            </h1>
            <p className="text-lg opacity-60 font-medium">
              Your curated collection of campus favorites.
            </p>
          </div>
          <div className="px-6 py-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-500 font-black uppercase text-xs tracking-widest">
            {wishlist.length} Items Saved
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <p className="font-black uppercase tracking-widest text-pink-500 animate-pulse">Syncing your favorites...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed rounded-[3rem] opacity-40 transition-all hover:opacity-60" style={{ borderColor: "var(--mui-palette-divider)" }}>
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 006.364-6.364 4.5 4.5 0 00-6.364 0L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black mb-3">Wishlist is empty</h3>
            <p className="max-w-md mx-auto mb-8">You haven't saved any items yet. Browse the marketplace and "heart" the things you love!</p>
            <a href="/products" className="inline-block px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-1">
              Browse Marketplace
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="group flex flex-col sm:flex-row h-auto sm:h-48 rounded-3xl overflow-hidden border transition-all duration-500 hover:shadow-2xl hover:border-pink-500/30"
                style={cardStyle}
              >
                {/* Image Section */}
                <div className="relative w-full sm:w-64 h-48 sm:h-full flex-shrink-0 overflow-hidden bg-gray-100">
                  <img
                    src={product.images?.[0]?.url || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <h3 className="text-2xl font-black tracking-tight mb-2 truncate" style={{ color: "var(--mui-palette-text-primary)" }}>
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs font-bold opacity-50 uppercase tracking-widest mb-4">
                        <span className="flex items-center gap-1.5 text-blue-500">
                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {product.college?.collegeName}
                        </span>
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                        <span>Qty: {product.quantity}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-3xl font-black text-blue-600">₹{product.price.toLocaleString()}</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">In Stock</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: "var(--mui-palette-divider)" }}>
                    <p className="text-sm opacity-60 line-clamp-1 max-w-md italic">
                      "{product.description}"
                    </p>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleRemove(product._id)}
                        className="group/remove p-3 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-red-100 hover:bg-red-500 text-red-400 hover:text-white"
                        title="Remove from Wishlist"
                        style={{ backgroundColor: "rgba(239, 68, 68, 0.05)" }}
                      >
                        <svg 
                          className="w-6 h-6 fill-current transition-transform duration-300 group-hover/remove:scale-110" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button 
                        className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 cursor-pointer"
                      >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Message Seller
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

export default Wishlist;
