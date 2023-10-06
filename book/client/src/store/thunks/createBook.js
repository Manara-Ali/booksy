import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createBook = createAsyncThunk(
  "book/create",
  async (book, { rejectWithValue }) => {
    try {
      const response = await axios({
        url: "/api/v1/books",
        method: "POST",
        data: book,
      });

      const data = response.data;

      return data;
    } catch (error) {
      console.log(error);
    }
  }
);
