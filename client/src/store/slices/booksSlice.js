import { createSlice, current } from "@reduxjs/toolkit";
import {
  fetchBooks,
  fetchBook,
  createBook,
  updateBook,
  deleteBook,
  clearError,
} from "../index";

const booksSlice = createSlice({
  name: "books",
  initialState: {
    data: [],
    book: {},
    error: {},
    status: "",
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchBooks.fulfilled, (state, action) => {
      state.data = action.payload.books;
      state.error = {};
      // Set the book create status back to an empty string after navigation to the home page
      state.status = "";
    });

    builder.addCase(fetchBook.fulfilled, (state, action) => {
      state.book = action.payload.book;
    });

    builder.addCase(createBook.fulfilled, (state, action) => {
      // CHECK THIS LINE OF CODE!!!!!
      console.log(action.payload);
      state.status = action.payload.status;
    });

    builder.addCase(updateBook.fulfilled, (state, action) => {
      state.data = state.data.map((element) => {
        console.log(current(element));
        return element._id === action.payload.id ? action.payload : element;
      });
    });

    builder.addCase(deleteBook.fulfilled, (state, action) => {
      // state.status = action.payload;
      state.status = action.payload;
    });

    builder.addCase(fetchBook.rejected, (state, action) => {
      state.error = action.payload;
    });

    builder.addCase(fetchBooks.rejected, (state, action) => {
      state.error = action.payload;
    });

    builder.addCase(clearError, (state, action) => {
      state.error = {};
    });
  },
});

export const booksCombinedReducer = booksSlice.reducer;
