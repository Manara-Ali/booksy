import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const passwordChange = createAsyncThunk(
  "change/password",
  async (obj, { rejectWithValue }) => {
    console.log(obj);
    try {
      const response = await axios({
        url: "/api/v1/users/update-password",
        method: "PATCH",
        data: obj,
      });

      const { data } = response.data;

      console.log(data);

      return;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
