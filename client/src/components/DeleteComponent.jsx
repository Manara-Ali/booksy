import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../context/ModalContext";
import { deleteBook } from "../store";

const DeleteComponent = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { setModalOpen } = useContext(ModalContext);

  const { book, status } = useSelector((state) => {
    console.log(state.booksCombinedReducer);
    return state.booksCombinedReducer;
  });

  console.log(status);

  useEffect(() => {
    if (status === 204) {
      setModalOpen(false);
      document.querySelector("#main-container").classList.remove("blur");
      navigate("/");
    }
  }, [status, setModalOpen, navigate]);

  const handleBookDeletion = (id) => {
    dispatch(deleteBook(id));
  };

  return (
    <div className="modal-message">
      <>
        <Form className="delete-book-form">
          <h1>Delete Book</h1>
          <p>
            Are you sure you want to delete{" "}
            <span className="delete-title">{book.title}</span>?
          </p>
          <div className="button-div">
            <Button
              className="card-btn cancel"
              //   type="submit"
              onClick={() => {
                setModalOpen(false);
                document
                  .querySelector("#main-container")
                  .classList.remove("blur");
                // Scroll to the bottom of the page
                document.body.scrollTop = document.documentElement.scrollTop =
                  document.body.scrollHeight;
              }}
            >
              Cancel
            </Button>
            <Button
              className="card-btn delete"
              //   type="submit"
              onClick={() => {
                return handleBookDeletion(book._id);
              }}
            >
              Delete
            </Button>
          </div>
        </Form>
      </>
    </div>
  );
};

export default DeleteComponent;
