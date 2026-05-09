import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
  });

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/auth/get-user");
      setUser(response.data);
      setFormData({ userName: response.data.userName });
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.put("/auth/update-profile", formData);
      setUser(response.data.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  // Theme-aware styles
  const themedStyle = {
    color: "var(--mui-palette-text-primary)",
    backgroundColor: "var(--mui-palette-background-default)",
  };

  const cardStyle = {
    backgroundColor: "var(--mui-palette-background-paper)",
    borderColor: "var(--mui-palette-divider)",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" style={themedStyle}>
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-bold uppercase tracking-widest text-blue-600">Syncing Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 transition-all duration-300">
      {/* Header Profile Section */}
      <div className="relative mb-12">
        <div className="h-48 w-full rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
              </svg>
           </div>
        </div>
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-20 md:translate-x-0">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl border-4 border-white transition-transform duration-500 hover:scale-105">
              <div className="w-full h-full rounded-[2rem] bg-blue-100 flex items-center justify-center text-blue-600 text-6xl font-black">
                {user?.userName?.[0]?.toUpperCase()}
              </div>
            </div>
            <div className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-2xl shadow-lg animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-8 rounded-3xl border shadow-xl text-center md:text-left transition-all duration-300" style={cardStyle}>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2" style={{ color: "var(--mui-palette-text-primary)" }}>
              {user?.userName}
            </h2>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-6">
              {user?.role}
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest opacity-60">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest opacity-60">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                  </svg>
                </div>
                <span>{user?.college?.collegeName}</span>
              </div>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="w-full mt-8 py-3 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer"
            >
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="p-8 md:p-10 rounded-[2.5rem] border shadow-2xl transition-all duration-300" style={cardStyle}>
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-8">
                <h3 className="text-3xl font-black tracking-tighter uppercase mb-8" style={{ color: "var(--mui-palette-text-primary)" }}>
                  UPDATE PROFILE
                </h3>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60">Full Name</label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className="w-full py-4 px-6 rounded-2xl border bg-transparent focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold"
                    style={{ borderColor: "var(--mui-palette-divider)" }}
                  />
                </div>
                <div className="space-y-3 opacity-50">
                   <label className="text-xs font-bold uppercase tracking-widest">Email Address (Read-only)</label>
                   <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full py-4 px-6 rounded-2xl border bg-gray-50/5 cursor-not-allowed outline-none font-medium"
                    style={{ borderColor: "var(--mui-palette-divider)" }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 rounded-3xl bg-blue-600 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 active:scale-[0.98] cursor-pointer"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-12">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-black tracking-tighter uppercase" style={{ color: "var(--mui-palette-text-primary)" }}>
                    PROFILE DETAILS
                  </h3>
                  <div className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 text-[10px] font-black uppercase tracking-widest">
                    {user?.isVerified ? "Verified Account" : "Pending Verification"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Display Name</span>
                    <p className="text-xl font-bold" style={{ color: "var(--mui-palette-text-primary)" }}>{user?.userName}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">College Identity</span>
                    <p className="text-xl font-bold" style={{ color: "var(--mui-palette-text-primary)" }}>{user?.college?.collegeName}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Member Since</span>
                    <p className="text-xl font-bold" style={{ color: "var(--mui-palette-text-primary)" }}>
                      {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Role</span>
                    <p className="text-xl font-bold uppercase tracking-tight" style={{ color: "var(--mui-palette-text-primary)" }}>{user?.role}</p>
                  </div>
                </div>

                <div className="pt-8 border-t" style={{ borderColor: "var(--mui-palette-divider)" }}>
                  <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm mb-1">Campus Verification</h4>
                      <p className="text-xs opacity-60">Your account is linked to your campus ID.</p>
                    </div>
                    <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.607.27 1.176.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
