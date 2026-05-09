import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";

const CATEGORIES = [
  "Electronics",
  "Books",
  "Clothing",
  "Furniture",
  "Stationery",
  "Sports",
  "Other",
];

const MyListing = () => {
  const [activeTab, setActiveTab] = useState("myListing");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    category: "Other",
    inStock: true,
  });

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/products/get-myListing");
      setMyListings(response.data.data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to fetch your listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "myListing") {
      fetchMyListings();
      setEditingId(null); // Reset editing when switching to list
    }
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      inStock: product.inStock,
    });
    // Set existing images as previews (optional, but good for UX)
    setPreviews(product.images.map(img => img.url));
    setActiveTab("addListing");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    
    try {
      await apiClient.delete(`/products/delete/${id}`);
      toast.success("Listing deleted successfully");
      fetchMyListings();
    } catch (error) {
      toast.error("Failed to delete listing");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.warning("You can only upload up to 5 images");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.quantity ||
      !formData.category ||
      (editingId ? false : images.length === 0) // Images required for new listing only
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    data.append("category", formData.category);
    data.append("inStock", formData.inStock);

    images.forEach((image) => {
      data.append("image", image);
    });

    try {
      let response;
      if (editingId) {
        response = await apiClient.put(`/products/update/${editingId}`, data);
      } else {
        response = await apiClient.post("/products/create", data);
      }

      if (response.data) {
        toast.success(editingId ? "Product updated successfully!" : "Product listed successfully!");
        setFormData({
          title: "",
          description: "",
          price: "",
          quantity: "",
          category: "Other",
          inStock: true,
        });
        setImages([]);
        setPreviews([]);
        setEditingId(null);
        setActiveTab("myListing");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  // Using MUI CSS Variables for 100% theme synchronization
  const themedStyle = {
    color: "var(--mui-palette-text-primary)",
    backgroundColor: "var(--mui-palette-background-paper)",
    borderColor: "var(--mui-palette-divider)",
  };

  const inputStyle = {
    backgroundColor: "var(--mui-palette-background-default)",
    color: "var(--mui-palette-text-primary)",
    borderColor: "var(--mui-palette-divider)",
  };

  const secondaryTextStyle = {
    color: "var(--mui-palette-text-secondary)",
  };

  return (
    <div className="w-full flex justify-center items-start p-4 md:p-8 transition-colors duration-300">
      <div 
        className="w-full max-w-6xl transition-all duration-300"
      >
        {/* Tabs Switcher */}
        <div className="flex justify-center mb-10">
          <div 
            className="flex p-1.5 rounded-2xl shadow-xl backdrop-blur-md border transition-all duration-500"
            style={{ 
              backgroundColor: "rgba(var(--mui-palette-background-paperChannel), 0.7)",
              borderColor: "var(--mui-palette-divider)" 
            }}
          >
            {[
              { id: "myListing", label: "My Listings", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
              { id: "addListing", label: editingId ? "Edit Product" : "Add Product", icon: editingId ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-500 transform cursor-pointer ${
                  activeTab === tab.id 
                    ? "bg-blue-600 text-white shadow-2xl scale-105" 
                    : "text-gray-500 hover:bg-gray-500/10"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "myListing" ? (
          <div 
            className="w-full rounded-3xl p-6 md:p-10 border shadow-2xl transition-all duration-300"
            style={themedStyle}
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase" style={{ color: themedStyle.color }}>
                  YOUR LISTINGS
                </h1>
                <p className="text-lg opacity-70" style={secondaryTextStyle}>
                  Manage and track your active campus marketplace items.
                </p>
              </div>
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                <span className="font-bold text-blue-500 uppercase text-sm tracking-widest">
                  {myListings.length} Active Items
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="font-bold uppercase tracking-widest text-blue-500">Loading your gear...</p>
              </div>
            ) : myListings.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed rounded-3xl opacity-50" style={{ borderColor: themedStyle.borderColor }}>
                <svg className="w-20 h-20 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-2xl font-bold mb-2">No listings found</h3>
                <p>Start selling items to see them here.</p>
                <button 
                  onClick={() => setActiveTab("addListing")}
                  className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all cursor-pointer"
                >
                  Create First Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {myListings.map((product) => (
                  <div 
                    key={product._id} 
                    className="group relative rounded-3xl overflow-hidden border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                    style={{ backgroundColor: inputStyle.backgroundColor, borderColor: themedStyle.borderColor }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {/* Image Carousel / Multiple Images Indicator */}
                      <div className="relative w-full h-full">
                        <img 
                          src={product.images?.[0]?.url || "https://via.placeholder.com/400x300?text=No+Image"} 
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {product.images?.length > 1 && (
                          <div className="absolute bottom-4 right-4 flex gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                            {product.images.map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === 0 ? 'bg-white w-4' : 'bg-white/40'}`} 
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
                        <span className="text-xs font-black text-white uppercase tracking-widest">
                          {product.category}
                        </span>
                      </div>
                      {product.inStock ? (
                        <div className="absolute bottom-4 left-4 px-3 py-1 bg-green-500/90 backdrop-blur-md rounded-full shadow-lg">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">In Stock</span>
                        </div>
                      ) : (
                        <div className="absolute bottom-4 left-4 px-3 py-1 bg-red-500/90 backdrop-blur-md rounded-full shadow-lg">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">Sold Out</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-black text-xl line-clamp-1 uppercase tracking-tight" style={{ color: themedStyle.color }}>
                          {product.title}
                        </h3>
                        <span className="font-black text-blue-500 text-xl">₹{product.price}</span>
                      </div>
                      <p className="text-sm opacity-60 line-clamp-2 mb-6" style={secondaryTextStyle}>
                        {product.description}
                      </p>
                      
                      <div className="flex flex-col gap-4 pt-4 border-t" style={{ borderColor: themedStyle.borderColor }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-blue-500">{product.quantity}</span>
                            </div>
                            <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Units Left</span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEdit(product)}
                              className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer"
                              title="Edit Listing"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDelete(product._id)}
                              className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
                              title="Delete Listing"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {product.inStock && (
                          <button
                            onClick={async () => {
                              try {
                                await apiClient.patch(`/products/mark-as-sold/${product._id}`);
                                toast.success("Marked as sold!");
                                fetchMyListings();
                              } catch (err) {
                                toast.error("Failed to mark as sold");
                              }
                            }}
                            className="w-full py-3 rounded-2xl bg-orange-500/10 text-orange-600 font-black text-xs uppercase tracking-widest border border-orange-500/20 hover:bg-orange-600 hover:text-white transition-all duration-300 cursor-pointer"
                          >
                            Mark as Sold
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div 
            className="w-full max-w-5xl mx-auto rounded-3xl p-6 md:p-10 border shadow-2xl transition-all duration-300"
            style={themedStyle}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase" style={{ color: themedStyle.color }}>
                {editingId ? "EDIT PRODUCT" : "LIST NEW PRODUCT"}
              </h1>
              <p className="text-lg opacity-70" style={secondaryTextStyle}>
                {editingId ? "Modify your product details and keep your listing updated." : "Fill in the details below to showcase your item on the campus marketplace."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-bold uppercase tracking-widest opacity-80" style={{ color: themedStyle.color }}>
                    Product Title <span className="text-blue-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Engineering Physics Vol 1"
                      className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold uppercase tracking-widest opacity-80" style={{ color: themedStyle.color }}>
                    Description <span className="text-blue-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-4 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </span>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="1"
                      placeholder="Tell us more about the item..."
                      className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none font-medium"
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-bold uppercase tracking-widest opacity-80" style={{ color: themedStyle.color }}>
                    Price <span className="text-blue-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl text-blue-500">₹</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-bold text-lg"
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold uppercase tracking-widest opacity-80" style={{ color: themedStyle.color }}>
                    Available Quantity <span className="text-blue-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </span>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-10" style={{ borderColor: themedStyle.borderColor }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="block text-sm font-bold uppercase tracking-widest opacity-80" style={{ color: themedStyle.color }}>Category Selection</label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </span>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full border rounded-xl py-4 pl-12 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none font-medium cursor-pointer"
                          style={inputStyle}
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat} style={{ backgroundColor: themedStyle.backgroundColor, color: themedStyle.color }}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold uppercase tracking-widest opacity-80" style={{ color: themedStyle.color }}>Media Upload</label>
                      <label 
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl hover:bg-blue-500/5 transition-all cursor-pointer group"
                        style={{ backgroundColor: inputStyle.backgroundColor, borderColor: inputStyle.borderColor }}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                          <svg className="w-8 h-8 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm font-bold" style={{ color: themedStyle.color }}>Browse Images</p>
                        </div>
                        <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold uppercase tracking-widest opacity-80" style={{ color: themedStyle.color }}>Previews ({previews.length}/5)</label>
                    <div 
                      className="h-[224px] border rounded-2xl p-4 overflow-y-auto custom-scrollbar"
                      style={{ backgroundColor: "var(--mui-palette-background-default)", borderColor: themedStyle.borderColor }}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                        {previews.map((src, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border group" style={{ borderColor: themedStyle.borderColor }}>
                            <img src={src} alt="preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        {previews.length < 5 && (
                          <label className="aspect-square border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer" style={{ borderColor: themedStyle.borderColor }}>
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6">
                <div 
                  className="flex items-center justify-between p-6 border rounded-3xl shadow-sm transition-all duration-300 hover:shadow-md"
                  style={{ backgroundColor: inputStyle.backgroundColor, borderColor: inputStyle.borderColor }}
                >
                  <div className="flex flex-col">
                    <span className="font-black tracking-tight text-lg uppercase" style={{ color: themedStyle.color }}>STOCK STATUS</span>
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{formData.inStock ? 'Available Now' : 'Out of Stock'}</span>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-16 h-9 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all after:shadow-lg peer-checked:after:translate-x-7 peer-hover:after:scale-95 group-active:after:w-10">
                      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none opacity-50">
                        <span className="text-[10px] font-black text-white ml-0.5">ON</span>
                        <span className="text-[10px] font-black text-gray-400 mr-0.5">OFF</span>
                      </div>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer h-full min-h-[80px] font-black text-xl rounded-3xl uppercase tracking-[4px] shadow-2xl active:scale-[0.98] transition-all duration-500 flex items-center justify-center relative overflow-hidden group bg-blue-600 text-white"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none" />
                  <span className="relative z-10">{loading ? "SAVING..." : (editingId ? "UPDATE LISTING" : "CONFIRM LISTING")}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--mui-palette-divider);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default MyListing;
