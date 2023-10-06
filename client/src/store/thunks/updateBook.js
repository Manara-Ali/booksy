import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateBook = createAsyncThunk(
  "book/update",
  async (updatedBook, { rejectWithValue }) => {
    console.log(updatedBook);
    try {
      await axios({
        url: `/api/v1/books/${updatedBook._id}`,
        method: "PATCH",
        data: updatedBook,
      });

      return updatedBook;
    } catch (error) {
      console.log("HERE", error);
    }
  }
);
