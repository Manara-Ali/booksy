import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios({
        url: "/api/v1/users/login",
        method: "POST",
        data: userData,
      });

      const { data } = response.data;

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
