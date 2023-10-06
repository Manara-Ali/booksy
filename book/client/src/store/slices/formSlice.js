import { createSlice } from "@reduxjs/toolkit";
import {
  signupUser,
  loginUser,
  accountChange,
  passwordChange,
  createBook,
} from "../index";

const formSlice = createSlice({
  name: "form",
  initialState: {
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    currentPassword: "",
    title: "",
    genre: "",
    author: "",
    numberOfPages: 0,
    numberOfChapters: 0,
    coverImage: {},
    synopsis: "",
    myExplanation: "",
    finalThoughts: "",
    ratingsAverage: 0,
    recommend: true,
  },
  reducers: {
    enteredName(state, action) {
      state.name = action.payload;
    },
    enteredEmail(state, action) {
      state.email = action.payload;
    },
    enteredPassword(state, action) {
      state.password = action.payload;
    },
    enteredPasswordConfirm(state, action) {
      state.passwordConfirm = action.payload;
    },
    enteredCurrentPassword(state, action) {
      state.currentPassword = action.payload;
    },
    enteredTitle(state, action) {
      state.title = action.payload;
    },
    enteredGenre(state, action) {
      state.genre = action.payload;
    },
    enteredAuthor(state, action) {
      state.author = action.payload;
    },
    enteredNumPages(state, action) {
      state.numberOfPages = action.payload;
    },
    enteredNumChapters(state, action) {
      state.numberOfChapters = action.payload;
    },
    enteredSynopsis(state, action) {
      state.synopsis = action.payload;
    },
    enteredExplaination(state, action) {
      state.myExplanation = action.payload;
    },
    enteredThoughts(state, action) {
      state.finalThoughts = action.payload;
    },
    enteredRating(state, action) {
      state.ratingsAverage = action.payload;
    },
    enteredRecommendation(state, action) {
      state.recommend = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.name = "";
      state.email = "";
      state.password = "";
      state.passwordConfirm = "";
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.email = "";
      state.password = "";
    });

    builder.addCase(accountChange.fulfilled, (state, action) => {
      state.name = "";
      state.email = "";
      state.currentPassword = "";
    });

    builder.addCase(passwordChange.fulfilled, (state, action) => {
      state.currentPassword = "";
      state.password = "";
      state.passwordConfirm = "";
    });

    builder.addCase(createBook.fulfilled, (state, action) => {
      state.title = "";
      state.genre = "";
      state.author = "";
      state.numberOfPages = "";
      state.numberOfChapters = "";
      state.synopsis = "";
      state.myExplanation = "";
      state.finalThoughts = "";
      state.ratingsAverage = "";
      state.recommend = true;
    });
  },
});

export const {
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
} = formSlice.actions;
export const formCombinedReducer = formSlice.reducer;
