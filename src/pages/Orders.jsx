import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/orders/my-orders");
        setOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "var(--mui-palette-background-default)" }}>
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen" style={{ backgroundColor: "var(--mui-palette-background-default)" }}>
      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter" style={{ color: "var(--mui-palette-text-primary)" }}>Market History</h1>
        <p className="font-bold uppercase tracking-widest text-[10px] mt-2 opacity-50" style={{ color: "var(--mui-palette-text-secondary)" }}>All your completed deals in one place</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[2rem] p-20 text-center border border-dashed" style={{ borderColor: "var(--mui-palette-divider)", backgroundColor: "rgba(128,128,128,0.05)" }}>
          <p className="font-black uppercase tracking-widest opacity-40" style={{ color: "var(--mui-palette-text-secondary)" }}>No orders found yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => {
            const isBuyer = order.buyerId?._id === user?._id;
            const otherParty = isBuyer ? order.sellerId : order.buyerId;
            
            return (
              <div 
                key={order._id} 
                className="border rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-8 transition-all group"
                style={{ 
                  borderColor: "var(--mui-palette-divider)", 
                  backgroundColor: "var(--mui-palette-background-paper)" 
                }}
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-blue-600/10">
                  {order.productId?.images?.[0]?.url ? (
                    <img 
                      src={order.productId.images[0].url} 
                      alt={order.productId.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                       <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      isBuyer ? "bg-blue-600 text-white" : "bg-green-600 text-white"
                    }`}>
                      {isBuyer ? "Purchase" : "Sale"}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40" style={{ color: "var(--mui-palette-text-secondary)" }}>
                      ID: #{order._id.slice(-6)}
                    </span>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-1" style={{ color: "var(--mui-palette-text-primary)" }}>
                    {order.productId?.title || "Unknown Product"}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: "var(--mui-palette-text-secondary)" }}>
                    <span>Qty: {order.quantity}</span>
                    <span>•</span>
                    <span>Total: ₹{((order.productId?.price || 0) * order.quantity).toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-center md:text-right md:border-l md:pl-8" style={{ borderColor: "var(--mui-palette-divider)" }}>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-40" style={{ color: "var(--mui-palette-text-secondary)" }}>
                    {isBuyer ? "Seller" : "Buyer"}
                  </p>
                  <p className="text-xs font-black uppercase" style={{ color: "var(--mui-palette-text-primary)" }}>{otherParty?.userName || "Unknown"}</p>
                  <div className="mt-4 flex flex-col items-center md:items-end">
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full" />
                      {order.orderStatus}
                    </span>
                    <p className="text-[9px] font-bold opacity-30 mt-1 uppercase" style={{ color: "var(--mui-palette-text-secondary)" }}>
                      {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
