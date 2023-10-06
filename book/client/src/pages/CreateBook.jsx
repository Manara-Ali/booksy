import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
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
  createBook,
} from "../store";

const CreateBook = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    title,
    genre,
    author,
    numberOfPages,
    numberOfChapters,
    synopsis,
    myExplanation,
    finalThoughts,
    ratingsAverage,
    recommend,
  } = useSelector((state) => {
    return state.formCombinedReducer;
  });

  const { status } = useSelector((state) => {
    return state.booksCombinedReducer;
  });

  const handleTitleChange = (e) => {
    return dispatch(enteredTitle(e.target.value));
  };

  const handleGenreChange = (e) => {
    return dispatch(enteredGenre(e.target.value));
  };

  const handleAuthorChange = (e) => {
    return dispatch(enteredAuthor(e.target.value));
  };

  const handleNumPagesChange = (e) => {
    return dispatch(enteredNumPages(Number(e.target.value)));
  };

  const handleNumChaptersChange = (e) => {
    return dispatch(enteredNumChapters(Number(e.target.value)));
  };

  const hanldeSynopsisChange = (e) => {
    return dispatch(enteredSynopsis(e.target.value));
  };

  const handleExplainationChange = (e) => {
    return dispatch(enteredExplaination(e.target.value));
  };

  const handleThoughtsChange = (e) => {
    return dispatch(enteredThoughts(e.target.value));
  };

  const handleRatingChange = (e) => {
    return dispatch(enteredRating(Number(e.target.value)));
  };

  const handleRecommendationChange = (e) => {
    const value = e.target.value === "Yes" ? true : false;
    return dispatch(enteredRecommendation(value));
  };

  const handleFormSubmission = (e, obj) => {
    e.preventDefault();
    const form = new FormData();
    for (let [key, value] of Object.entries(obj)) {
      form.append(key, value);
    }

    form.append("coverImage", document.querySelector("#cover-image").files[0]);
    form.append("images", document.querySelector("#images-1").files[0]);
    form.append("images", document.querySelector("#images-2").files[0]);
    form.append("images", document.querySelector("#images-3").files[0]);
    document.querySelector("#cover-image").value = "";
    document.querySelector("#images-1").value = "";
    document.querySelector("#images-2").value = "";
    document.querySelector("#images-3").value = "";
    dispatch(createBook(form));
    console.log("Herer");
  };

  console.log(status);

  useEffect(() => {
    if (status === "success") {
      navigate("/");
    }
  }, [status, navigate]);

  return (
    <>
      <Form
        className="add-book-form"
        onSubmit={(e) => {
          return handleFormSubmission(e, {
            title,
            genre,
            author,
            numberOfPages,
            numberOfChapters,
            synopsis,
            myExplanation,
            finalThoughts,
            ratingsAverage,
            recommend,
          });
        }}
      >
        <h1>Add Book</h1>
        {/* <p>Use this form to share a book</p> */}
        <Form.Group className="mb-3" controlId="formBasicTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Book Title"
            onChange={(e) => {
              return handleTitleChange(e);
            }}
            value={title}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicGenre">
          <Form.Label>Genre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Book Genre"
            onChange={(e) => {
              return handleGenreChange(e);
            }}
            value={genre}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicAuthor">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Book Author"
            className="input-box"
            onChange={(e) => {
              return handleAuthorChange(e);
            }}
            value={author}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPages">
          <Form.Label>Number of Pages</Form.Label>
          <Form.Control
            type="number"
            placeholder="Provide the number of pages"
            className="input-box"
            onChange={(e) => {
              return handleNumPagesChange(e);
            }}
            value={numberOfPages || ""}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicChapters">
          <Form.Label>Number of Chapters</Form.Label>
          <Form.Control
            type="number"
            placeholder="Provide the number of chapters"
            className="input-box"
            onChange={(e) => {
              return handleNumChaptersChange(e);
            }}
            value={numberOfChapters || ""}
          />
        </Form.Group>

        <Form.Group controlId="cover-image" className="my-3">
          <Form.Label>Book Cover Image</Form.Label>
          <div className="book-cover-img">
            <img id="book-cover-img" />
            <Form.Control
              className="book-img-input"
              name="coverImage"
              type="file"
              accept="image/*"
            ></Form.Control>
          </div>
        </Form.Group>

        <Form.Group controlId="images-1" className="my-3">
          <Form.Label>Additional Book Images</Form.Label>
          <div className="book-cover-img">
            <img id="book-cover-img" />
            <Form.Control
              className="book-img-input"
              name="images"
              type="file"
              accept="image/*"
            ></Form.Control>
          </div>
        </Form.Group>

        <Form.Group controlId="images-2" className="my-3">
          <Form.Label>Additional Book Images</Form.Label>
          <div className="book-cover-img">
            <img id="book-cover-img" />
            <Form.Control
              className="book-img-input"
              name="images"
              type="file"
              accept="image/*"
            ></Form.Control>
          </div>
        </Form.Group>

        <Form.Group controlId="images-3" className="my-3">
          <Form.Label>Additional Book Images</Form.Label>
          <div className="book-cover-img">
            <img id="book-cover-img" />
            <Form.Control
              className="book-img-input"
              name="images"
              type="file"
              accept="image/*"
            ></Form.Control>
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicSynopsis">
          <Form.Label>Synopsis</Form.Label>
          <Form.Control
            as="textarea"
            name="synopsis"
            rows="3"
            columns="10"
            type="text"
            placeholder="What is the book synopsis?"
            className="input-box"
            onChange={(e) => {
              return hanldeSynopsisChange(e);
            }}
            value={synopsis}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicExplanation">
          <Form.Label>My Explanation</Form.Label>
          <Form.Control
            as="textarea"
            name="explaination"
            rows="3"
            columns="10"
            type="text"
            placeholder="What is your take on this book?"
            className="input-box"
            onChange={(e) => {
              return handleExplainationChange(e);
            }}
            value={myExplanation}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicThoughts">
          <Form.Label>Final Thoughts</Form.Label>
          <Form.Control
            as="textarea"
            name="final-thoughts"
            rows="3"
            columns="10"
            type="text"
            placeholder="What are your final thoughts on the book?"
            className="input-box"
            onChange={(e) => {
              return handleThoughtsChange(e);
            }}
            value={finalThoughts}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicRating">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            type="number"
            placeholder="Provide rating for this book between 1 to 5"
            className="input-box"
            onChange={(e) => {
              return handleRatingChange(e);
            }}
            value={ratingsAverage || ""}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicRecommendation">
          <Form.Label>Would you recommend this book?</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => {
              return handleRecommendationChange(e);
            }}
          >
            <option>Yes</option>
            <option>No</option>
          </Form.Control>
        </Form.Group>

        <Button className="card-btn" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default CreateBook;
