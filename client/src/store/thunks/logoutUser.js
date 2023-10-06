import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const logoutUser = createAsyncThunk("user/logout", async () => {
  const response = await axios({
    url: "/api/v1/users/logout",
    method: "GET",
  });

  // console.log(response);

  return {};
});
