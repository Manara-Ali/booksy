import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk("user/fetch", async () => {
  const response = await axios({
    url: "/api/v1/users/my-account",
    method: "GET",
  });

  const { data } = response.data;

  return data;
});
