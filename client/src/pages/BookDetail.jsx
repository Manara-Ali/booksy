import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { fetchBook } from "../store";
import { ModalContext } from "../context/ModalContext";
import ModalWindow from "../components/ModalWindow";
import EditComponent from "../components/EditComponent";
import DeleteComponent from "../components/DeleteComponent";

const BookDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    title,
    genre,
    author,
    numberOfPages,
    numberOfChapters,
    ratingsAverage,
    ratingsQuantity,
    synopsis,
    myExplanation,
    finalThoughts,
    recommend,
    coverImage,
    images,
    createdAt,
    reviews,
    userId,
  } = useSelector((state) => {
    return state.booksCombinedReducer.book;
  });

  const { user } = useSelector((state) => {
    return state.usersCombinedReducer;
  });

  const { modalOpen, setModalOpen } = useContext(ModalContext);

  const [confirmMessage, setConfirmMessage] = useState(null);

  const date = createdAt && new Date(createdAt);

  console.log(reviews);

  // Create an effect to fetch a single book using the id
  useEffect(() => {
    dispatch(fetchBook(id));
  }, [id, dispatch]);

  return (
    <>
      <div className="header">
        <Link to="/" className="back-btn-parent">
          <Button className="back-btn">Back</Button>
        </Link>

        <div className="detail-container">
          <img
            className="cover-image"
            src={`/img/books/${coverImage}`}
            alt="book cover"
          />
          <div className="book-detail">
            <h1>Book Detail Page</h1>
            <p>Title: {title}</p>
            <p>Genre: {genre}</p>
            <p>Author: {author}</p>
            <p>Pages: {numberOfPages}</p>
            <p>Chapters: {numberOfChapters}</p>
            <p>
              Ratings: {ratingsAverage} ({ratingsQuantity})
            </p>
            <p>Synopsis: {synopsis}</p>
            <p>My Understanding of the Story Line: {myExplanation}</p>
            <p>Final Thoughts: {finalThoughts}</p>
            <p>Would you recommend this book?: {recommend && "YES"}</p>
            <p>
              Created:{" "}
              {date
                ? Intl.DateTimeFormat("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }).format(date)
                : "Loading..."}
            </p>
            <div className="image-list-container">
              {images?.map((element) => {
                return (
                  <img
                    className="image-list"
                    key={element}
                    src={`/img/books/${element}`}
                    alt="book cover"
                  />
                );
              })}
            </div>
            {user._id === userId ? (
              <div className="button-option">
                <Button
                  className="card-btn edit"
                  type="submit"
                  onClick={() => {
                    // Scroll to the top of the page
                    document.body.scrollTop =
                      document.documentElement.scrollTop = 0;

                    // Add a blur effect
                    document
                      .querySelector("#main-container")
                      .classList.add("blur");

                    // Open modal
                    setModalOpen(true);

                    setConfirmMessage(<EditComponent />);
                  }}
                >
                  Edit
                </Button>
                <Button
                  className="card-btn delete"
                  type="submit"
                  onClick={() => {
                    // Scroll to the top of the page
                    document.body.scrollTop =
                      document.documentElement.scrollTop = 0;

                    // Add a blur effect
                    document
                      .querySelector("#main-container")
                      .classList.add("blur");

                    // Open modal
                    setModalOpen(true);

                    setConfirmMessage(<DeleteComponent />);
                  }}
                >
                  Delete
                </Button>
              </div>
            ) : null}
          </div>
        </div>
        {modalOpen && <ModalWindow>{confirmMessage}</ModalWindow>}
      </div>
    </>
  );
};

export default BookDetail;
