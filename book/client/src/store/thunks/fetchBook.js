import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBook = createAsyncThunk(
  "book/fetch",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        url: `/api/v1/books/${id}`,
        method: "GET",
      });

      const { data } = response.data;

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
