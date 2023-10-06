import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import { CustomEditProvider } from "./context/ModalContext";

ReactDOM.createRoot(document.querySelector("#root")).render(
  <Provider store={store}>
    <Router>
      <CustomEditProvider>
        <App />
      </CustomEditProvider>
    </Router>
  </Provider>
);
