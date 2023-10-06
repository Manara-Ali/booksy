import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const deleteBook = createAsyncThunk(
  "book/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        url: `/api/v1/books/${id}`,
        method: "DELETE",
      });

      console.log(response);

      const { status } = response;

      return status;
    } catch (error) {
      console.log(error);
    }
  }
);
