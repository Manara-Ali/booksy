import { configureStore } from "@reduxjs/toolkit";
import { booksCombinedReducer } from "./slices/booksSlice";
import { formCombinedReducer } from "./slices/formSlice";
import { usersCombinedReducer } from "./slices/usersSlice";
import { clearError } from "./actions";
import { createBook } from "./thunks/createBook";
import { fetchBook } from "./thunks/fetchBook";
import { fetchBooks } from "./thunks/fetchBooks";
import { updateBook } from "./thunks/updateBook";
import { deleteBook } from "./thunks/deleteBook";
import { signupUser } from "./thunks/signupUser";
import { loginUser } from "./thunks/loginUser";
import { logoutUser } from "./thunks/logoutUser";
import { fetchUser } from "./thunks/fetchUser";
import { accountChange } from "./thunks/accountChange";
import { passwordChange } from "./thunks/passwordChange";
import {
  enteredName,
  enteredEmail,
  enteredPassword,
  enteredPasswordConfirm,
  enteredCurrentPassword,
  enteredTitle,
  enteredGenre,
  enteredAuthor,
  enteredNumPages,
  enteredNumChapters,
  enteredSynopsis,
  enteredExplaination,
  enteredThoughts,
  enteredRating,
  enteredRecommendation,
} from "./slices/formSlice";

export const store = configureStore({
  reducer: {
    booksCombinedReducer,
    formCombinedReducer,
    usersCombinedReducer,
  },
});

export {
  createBook,
  fetchBooks,
  fetchBook,
  updateBook,
  deleteBook,
  fetchUser,
  signupUser,
  loginUser,
  logoutUser,
  enteredName,
  enteredEmail,
  enteredPassword,
  enteredPasswordConfirm,
  enteredCurrentPassword,
  enteredTitle,
  enteredGenre,
  enteredAuthor,
  enteredNumPages,
  enteredNumChapters,
  enteredSynopsis,
  enteredExplaination,
  enteredThoughts,
  enteredRating,
  enteredRecommendation,
  clearError,
  accountChange,
  passwordChange,
};
