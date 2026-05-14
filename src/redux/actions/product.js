import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await apiClient.get("/products/get-all");
    return res.data.data || [];
  },
);
