import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const signupUser = createAsyncThunk(
  "user/signup",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios({
        url: "/api/v1/users/signup",
        method: "POST",
        data: user,
      });

      const { data } = response.data;

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
