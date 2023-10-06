import "./bootstrap.min.css";
import "./App.css";
import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";
import BookDetail from "./pages/BookDetail";
import Error from "./components/Error";
import Profile from "./pages/Profile";
import CreateBook from "./pages/CreateBook";

const App = () => {
  const { error } = useSelector((state) => {
    return state.booksCombinedReducer;
  });

  return (
    <div id="main-container">
      <Navbar />
      <div id="body-container">
        {error.message && <Error message={error.message} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/:id" element={<BookDetail />} />
          <Route path="/my-account" element={<Profile />} />
          <Route path="/book-create-summary" element={<CreateBook />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
