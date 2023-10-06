import { createSlice } from "@reduxjs/toolkit";
import { clearError } from "../index";
import {
  signupUser,
  loginUser,
  logoutUser,
  fetchBooks,
  fetchBook,
  fetchUser,
  accountChange,
  passwordChange,
} from "../index";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    user: {},
    error: {},
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });

    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });

    builder.addCase(fetchBooks.fulfilled, (state, action) => {
      state.user = action.payload.loggedInUser;
    });

    builder.addCase(fetchBook.fulfilled, (state, action) => {
      state.user = action.payload.loggedInUser;
    });

    builder.addCase(accountChange.fulfilled, (state, action) => {
      state.user = {
        ...state.user,
        name: action.payload.name,
        email: action.payload.email,
        photo: action.payload.photo,
      };
    });

    builder.addCase(passwordChange.fulfilled, (state, action) => {
      console.log(action);
      // Send a success message to the front end
      return;
    });

    builder.addCase(signupUser.rejected, (state, action) => {
      state.error = action.payload;
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      state.error = action.payload;
    });

    builder.addCase(fetchBook.rejected, (state, action) => {
      state.user = action.payload.loggedInUser;
    });

    builder.addCase(accountChange.rejected, (state, action) => {
      state.error = action.payload;
    });

    builder.addCase(passwordChange.rejected, (state, action) => {
      state.error = action.payload;
    });

    builder.addCase(clearError, (state, action) => {
      state.error = {};
    });
  },
});

export const usersCombinedReducer = usersSlice.reducer;
