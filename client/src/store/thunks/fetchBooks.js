import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBooks = createAsyncThunk(
  "books/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios({
        url: "/api/v1/books",
        method: "GET",
      });

      const { data } = response.data;

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
