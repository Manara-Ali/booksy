import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const accountChange = createAsyncThunk(
  "change/account",
  async (obj, { rejectWithValue }) => {
    try {
      const response = await axios({
        url: "/api/v1/users/update-my-info",
        method: "PATCH",
        data: obj,
      });

      const { data } = response.data;

      const { updatedUser } = data;

      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
