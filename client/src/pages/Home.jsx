import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { HiOutlinePlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { fetchBooks, clearError } from "../store";
import CardComponent from "../components/CardComponent";
import Error from "../components/Error";

const Home = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => {
    return state.booksCombinedReducer.data;
  });

  const { error } = useSelector((state) => {
    return state.booksCombinedReducer;
  });

  const bookList = data.map((element) => {
    return (
      <CardComponent
        key={element._id}
        coverImage={element.coverImage}
        title={element.title}
        synopsis={element.synopsis}
        ratingsAverage={element.ratingsAverage}
        ratingsQuantity={element.ratingsQuantity}
        id={element._id}
      />
    );
  });

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  useEffect(() => {
    if (error.message) {
      setTimeout(() => {
        dispatch(clearError());
      }, 3000);
    }
  }, [error, dispatch]);

  return (
    <div className="header">
      <div className="book-review-header">
        <h1>Latest Books Reviewed</h1>
        <Button className="add-book-btn">
          <HiOutlinePlus />
          <Link to="/book-create-summary" className="new-book">
            Add Book
          </Link>
        </Button>
      </div>
      <div className="card-container">{bookList}</div>
    </div>
  );
};

export default Home;
